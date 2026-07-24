"use server";

import { connectToDatabase } from "@/lib/db/connect";
import { Ride } from "@/models/ride.model";
import { RideRequest } from "@/models/ride-request.model";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";

/**
 * Expire rides and ride requests that have passed their expiresAt date and
 * are still in an active/completed state. This is intended to be called on
 * a schedule (Vercel Cron / external cron).
 */
export async function expireStaleRecords(): Promise<{ rides: number; requests: number }> {
  await connectToDatabase();

  const now = new Date();

  const rideResult = await Ride.updateMany(
    {
      expiresAt: { $lte: now },
      status: { $nin: ["expired", "cancelled"] },
    },
    { $set: { status: "expired" } },
  ).exec();

  const requestResult = await RideRequest.updateMany(
    {
      expiresAt: { $lte: now },
      status: { $nin: ["expired", "cancelled", "fulfilled"] },
    },
    { $set: { status: "expired" } },
  ).exec();

  revalidatePath(ROUTES.home);
  revalidatePath(ROUTES.rides);
  revalidatePath(ROUTES.requests);
  revalidatePath(ROUTES.favorites);
  revalidatePath(ROUTES.profile);

  return {
    rides: rideResult.modifiedCount,
    requests: requestResult.modifiedCount,
  };
}
