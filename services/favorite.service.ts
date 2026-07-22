import { connectToDatabase } from "@/lib/db/connect";
import { Favorite } from "@/models/favorite.model";

export interface FavoriteState {
  rides: string[];
  drivers: string[];
  routes: Array<{ fromCity: string; toCity: string }>;
}

export async function getFavoritesByOwner(ownerKey: string): Promise<FavoriteState> {
  await connectToDatabase();
  const docs = await Favorite.find({ ownerKey }).lean().exec();
  const state: FavoriteState = { rides: [], drivers: [], routes: [] };
  for (const doc of docs) {
    const d = doc as Record<string, unknown>;
    if (d.type === "ride" && d.refId) state.rides.push(String(d.refId));
    else if (d.type === "driver" && d.refId) state.drivers.push(String(d.refId));
    else if (d.type === "route" && d.fromCity && d.toCity)
      state.routes.push({ fromCity: String(d.fromCity), toCity: String(d.toCity) });
  }
  return state;
}

export async function toggleFavoriteRide(
  ownerKey: string,
  rideId: string,
): Promise<boolean> {
  await connectToDatabase();
  const existing = await Favorite.findOne({ ownerKey, type: "ride", refId: rideId }).exec();
  if (existing) {
    await existing.deleteOne();
    return false;
  }
  await Favorite.create({ ownerKey, type: "ride", refId: rideId });
  return true;
}

export async function toggleFavoriteDriver(
  ownerKey: string,
  driverId: string,
): Promise<boolean> {
  await connectToDatabase();
  const existing = await Favorite.findOne({ ownerKey, type: "driver", refId: driverId }).exec();
  if (existing) {
    await existing.deleteOne();
    return false;
  }
  await Favorite.create({ ownerKey, type: "driver", refId: driverId });
  return true;
}

export async function toggleFavoriteRoute(
  ownerKey: string,
  fromCity: string,
  toCity: string,
): Promise<boolean> {
  await connectToDatabase();
  const existing = await Favorite.findOne({ ownerKey, type: "route", fromCity, toCity }).exec();
  if (existing) {
    await existing.deleteOne();
    return false;
  }
  await Favorite.create({ ownerKey, type: "route", fromCity, toCity });
  return true;
}

/** Return ownerKeys that have saved a specific route (for notifications). */
export async function getRouteFollowers(
  fromCity: string,
  toCity: string,
): Promise<string[]> {
  await connectToDatabase();
  const docs = await Favorite.find({ type: "route", fromCity, toCity })
    .select("ownerKey")
    .lean()
    .exec();
  return docs.map((d) => String((d as Record<string, unknown>).ownerKey));
}
