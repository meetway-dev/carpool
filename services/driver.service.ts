import { connectToDatabase } from "@/lib/db/connect";
import { Driver } from "@/models/driver.model";
import { mapDriverToDTO } from "@/features/drivers/mappers";
import type { VehicleType, VehicleColor } from "@/constants/vehicle-types";
import type { DriverDTO } from "@/types";

interface UpsertDriverFromRideInput {
  name: string;
  phone: string;
  vehicle: {
    type: string;
    model: string;
    color: string;
    number?: string;
  };
}

/**
 * Ensure a Driver record exists for a phone number, updating light profile
 * fields from the latest ride. Returns the driver id so rides can link to it.
 * Returns null for blocked drivers (their posts should be rejected upstream).
 */
export async function upsertDriverFromRide(
  input: UpsertDriverFromRideInput,
): Promise<{ driverId: string; verified: boolean } | null> {
  await connectToDatabase();

  const existing = await Driver.findOne({ phone: input.phone }).exec();

  if (existing?.blocked) {
    return null;
  }

  const vehicle = {
    type: input.vehicle.type as VehicleType,
    model: input.vehicle.model,
    color: input.vehicle.color as VehicleColor,
    number: input.vehicle.number,
  };

  if (existing) {
    existing.name = input.name;
    existing.vehicle = vehicle;
    await existing.save();
    return { driverId: String(existing._id), verified: Boolean(existing.verified) };
  }

  const created = await Driver.create({
    name: input.name,
    phone: input.phone,
    vehicle,
  });

  return { driverId: String(created._id), verified: false };
}

/** Fetch a driver profile by id. Returns null when not found / bad id. */
export async function getDriverById(id: string): Promise<DriverDTO | null> {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  await connectToDatabase();
  const doc = await Driver.findById(id).lean().exec();
  if (!doc) return null;
  return mapDriverToDTO(doc as Record<string, unknown>);
}

/** True when a phone number belongs to a blocked driver. */
export async function isPhoneBlocked(phone: string): Promise<boolean> {
  await connectToDatabase();
  const doc = await Driver.findOne({ phone, blocked: true }).select("_id").lean().exec();
  return Boolean(doc);
}
