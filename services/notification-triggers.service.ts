import { connectToDatabase } from "@/lib/db/connect";
import { Notification } from "@/models/notification.model";
import { getRouteFollowers } from "@/services/favorite.service";
import type { RideDTO } from "@/types";

/**
 * Fan-out notifications to all users who saved the route of a newly posted ride.
 * Called fire-and-forget from createRide — errors are swallowed so they never
 * block the ride creation response.
 */
export async function notifyRouteFollowers(ride: RideDTO): Promise<void> {
  try {
    const followers = await getRouteFollowers(ride.route.fromCity, ride.route.toCity);
    if (followers.length === 0) return;

    await connectToDatabase();

    const docs = followers.map((ownerKey) => ({
      ownerKey,
      type: "savedRouteMatch",
      title: `New ride: ${ride.route.fromCity} → ${ride.route.toCity}`,
      body: `${ride.driver.name} posted a ride for Rs ${ride.pricePerSeat}/seat on ${ride.departure.date}.`,
      meta: { rideId: ride.id, fromCity: ride.route.fromCity, toCity: ride.route.toCity },
      read: false,
    }));

    await Notification.insertMany(docs, { ordered: false });
  } catch (error) {
    console.error("notifyRouteFollowers failed (non-fatal):", error);
  }
}
