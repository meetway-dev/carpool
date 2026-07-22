"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db/connect";
import { Ride } from "@/models/ride.model";
import { createRideSchema } from "@/validators/ride.schema";
import { rateLimiters } from "@/lib/rate-limit";
import { upsertDriverFromRide } from "@/services/driver.service";
import {
  computeDepartureTimestamp,
  computeExpiresAt,
  buildDuplicateHash,
  buildSearchText,
  resolveRideStatus,
} from "@/lib/ride-helpers";
import { ROUTES } from "@/constants/routes";
import type { ActionResult } from "@/types";

interface CreateRideResult {
  rideId: string;
}

/**
 * Create a ride: validates input, blocks duplicates and blocked drivers,
 * derives denormalized fields, links/creates the driver record and persists.
 */
export async function createRide(
  input: unknown,
  ownerKey: string,
): Promise<ActionResult<CreateRideResult>> {
  const parsed = createRideSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // Rate limit per client (IP falls back to device key).
  const headerList = await headers();
  const identifier =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? ownerKey ?? "anonymous";
  const limited = rateLimiters.createRide(identifier);
  if (!limited.success) {
    return {
      success: false,
      error: "You've posted several rides recently. Please try again later.",
    };
  }

  try {
    await connectToDatabase();

    const departure = computeDepartureTimestamp({ date: data.date, time: data.time });
    const duplicateHash = buildDuplicateHash({
      phone: data.phone,
      fromCity: data.fromCity,
      toCity: data.toCity,
      date: data.date,
      time: data.time,
    });

    // Duplicate detection — same driver, route and departure already posted.
    const existing = await Ride.findOne({
      duplicateHash,
      status: { $nin: ["expired", "cancelled", "completed"] },
    })
      .select("_id")
      .lean()
      .exec();

    if (existing) {
      return {
        success: false,
        error: "You already posted an identical ride for this route and time.",
      };
    }

    // Link or create the driver (also rejects blocked numbers).
    const driver = await upsertDriverFromRide({
      name: data.driverName,
      phone: data.phone,
      vehicle: {
        type: data.vehicleType,
        model: data.vehicleModel,
        color: data.vehicleColor,
        number: data.vehicleNumber || undefined,
      },
    });

    if (!driver) {
      return {
        success: false,
        error: "This phone number is not allowed to post rides.",
      };
    }

    const status = resolveRideStatus(data.seatsTotal, departure);
    const searchText = buildSearchText({
      driverName: data.driverName,
      fromCity: data.fromCity,
      toCity: data.toCity,
      pickupPoint: data.pickupPoint,
      dropPoint: data.dropPoint,
      vehicleModel: data.vehicleModel,
      vehicleType: data.vehicleType,
      notes: data.notes || undefined,
    });

    const created = await Ride.create({
      driver: {
        name: data.driverName,
        phone: data.phone,
        verified: driver.verified,
        driverId: driver.driverId,
      },
      vehicle: {
        type: data.vehicleType,
        model: data.vehicleModel,
        color: data.vehicleColor,
        number: data.vehicleNumber || undefined,
      },
      route: {
        fromCity: data.fromCity,
        toCity: data.toCity,
        pickupPoint: data.pickupPoint,
        dropPoint: data.dropPoint,
      },
      pricePerSeat: data.pricePerSeat,
      seatsTotal: data.seatsTotal,
      seatsLeft: data.seatsTotal,
      departure: { date: data.date, time: data.time, timestamp: departure },
      arrivalEstimate: data.arrivalEstimate || undefined,
      options: data.options,
      recurrence: data.recurrence,
      notes: data.notes || undefined,
      status,
      duplicateHash,
      searchText,
      ownerKey: ownerKey || undefined,
      expiresAt: data.autoExpire ? computeExpiresAt(departure) : undefined,
    });

    revalidatePath(ROUTES.rides);
    revalidatePath(ROUTES.home);

    return { success: true, data: { rideId: String(created._id) } };
  } catch (error) {
    console.error("createRide failed:", error);
    return { success: false, error: "Could not publish your ride. Please try again." };
  }
}
