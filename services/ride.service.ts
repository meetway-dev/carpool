import type { FilterQuery, SortOrder } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { Ride, type RideDocument } from "@/models/ride.model";
import { mapRideToDTO } from "@/features/rides/mappers";
import { PUBLIC_RIDE_STATUSES } from "@/constants/ride-status";
import { TIME_WINDOWS, type TimeWindowKey } from "@/constants/routes";
import type { SearchParams } from "@/validators/search.schema";
import type { RideDTO, PaginatedResult } from "@/types";
import type { SortOption } from "@/constants/sort";

/** Resolve a date preset (today/tomorrow/weekend) into concrete yyyy-mm-dd strings. */
function resolveDatePreset(preset: SearchParams["datePreset"]): string[] {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  if (preset === "today") return [iso(today)];
  if (preset === "tomorrow") {
    const t = new Date(today);
    t.setDate(t.getDate() + 1);
    return [iso(t)];
  }
  if (preset === "weekend") {
    // Next Saturday and Sunday.
    const dates: string[] = [];
    const cursor = new Date(today);
    for (let i = 0; i < 7; i += 1) {
      const day = cursor.getDay();
      if (day === 6 || day === 0) dates.push(iso(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }
  return [];
}

/** Map a sort option to a Mongoose sort spec. */
function buildSort(sort: SortOption): Record<string, SortOrder> {
  switch (sort) {
    case "priceAsc":
      return { pricePerSeat: 1, "departure.timestamp": 1 };
    case "priceDesc":
      return { pricePerSeat: -1, "departure.timestamp": 1 };
    case "departureAsc":
    case "closest":
      return { "departure.timestamp": 1 };
    case "departureDesc":
      return { "departure.timestamp": -1 };
    case "newest":
      return { createdAt: -1 };
    case "oldest":
      return { createdAt: 1 };
    case "mostSeats":
      return { seatsLeft: -1, "departure.timestamp": 1 };
    case "bestRated":
      // Verified drivers first as a rating proxy at ride level.
      return { "driver.verified": -1, "departure.timestamp": 1 };
    default:
      return { "departure.timestamp": 1 };
  }
}

/** Build the Mongoose filter from validated search params. */
function buildFilter(params: SearchParams): FilterQuery<RideDocument> {
  const filter: FilterQuery<RideDocument> = {
    status: { $in: PUBLIC_RIDE_STATUSES },
  };

  if (params.fromCity) filter["route.fromCity"] = params.fromCity;
  if (params.toCity) filter["route.toCity"] = params.toCity;

  // Date: explicit date wins, else preset.
  const dates = params.date ? [params.date] : resolveDatePreset(params.datePreset);
  if (dates.length === 1) {
    filter["departure.date"] = dates[0];
  } else if (dates.length > 1) {
    filter["departure.date"] = { $in: dates };
  }

  // Only show rides departing in the future (unless a specific past date asked).
  if (dates.length === 0) {
    filter["departure.timestamp"] = { $gte: new Date() };
  }

  if (params.seats) filter.seatsLeft = { $gte: params.seats };

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    filter.pricePerSeat = {};
    if (params.minPrice !== undefined) filter.pricePerSeat.$gte = params.minPrice;
    if (params.maxPrice !== undefined) filter.pricePerSeat.$lte = params.maxPrice;
  }

  if (params.vehicleType) filter["vehicle.type"] = params.vehicleType;
  if (params.femaleOnly) filter["options.femaleOnly"] = true;
  if (params.ac) filter["options.ac"] = true;
  if (params.verified) filter["driver.verified"] = true;

  if (params.driverName) {
    filter["driver.name"] = { $regex: escapeRegex(params.driverName), $options: "i" };
  }
  if (params.phone) {
    filter["driver.phone"] = { $regex: escapeRegex(params.phone), $options: "i" };
  }
  if (params.keyword) {
    filter.searchText = { $regex: escapeRegex(params.keyword), $options: "i" };
  }

  // Time-of-day window filter (applied on the stored HH:mm string).
  if (params.timeWindow) {
    const window = TIME_WINDOWS[params.timeWindow as TimeWindowKey];
    if (window) {
      if (window.from <= window.to) {
        filter["departure.time"] = { $gte: window.from, $lte: window.to };
      } else {
        // Night window wraps past midnight.
        filter.$or = [
          { "departure.time": { $gte: window.from } },
          { "departure.time": { $lte: window.to } },
        ];
      }
    }
  }

  return filter;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Search rides with filters, sorting and pagination. Returns serializable DTOs
 * plus pagination metadata for infinite scroll.
 */
export async function searchRides(params: SearchParams): Promise<PaginatedResult<RideDTO>> {
  await connectToDatabase();

  const filter = buildFilter(params);
  const sort = buildSort(params.sort);
  const skip = (params.page - 1) * params.pageSize;

  const [docs, total] = await Promise.all([
    Ride.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(params.pageSize)
      .lean()
      .exec(),
    Ride.countDocuments(filter).exec(),
  ]);

  return {
    items: docs.map((doc) => mapRideToDTO(doc as Record<string, unknown>)),
    page: params.page,
    pageSize: params.pageSize,
    total,
    hasMore: skip + docs.length < total,
  };
}

/** Fetch a single ride by id. Returns null when not found or malformed id. */
export async function getRideById(id: string): Promise<RideDTO | null> {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  await connectToDatabase();

  const doc = await Ride.findById(id).lean().exec();
  if (!doc) return null;
  return mapRideToDTO(doc as Record<string, unknown>);
}

/** Increment view count (fire-and-forget from details page). */
export async function incrementRideView(id: string): Promise<void> {
  if (!/^[a-f0-9]{24}$/i.test(id)) return;
  await connectToDatabase();
  await Ride.updateOne({ _id: id }, { $inc: { viewCount: 1 } }).exec();
}

/** Featured + soonest rides for the home screen. */
export async function getFeaturedRides(limit = 6): Promise<RideDTO[]> {
  await connectToDatabase();
  const docs = await Ride.find({
    status: { $in: PUBLIC_RIDE_STATUSES },
    "departure.timestamp": { $gte: new Date() },
  })
    .sort({ featured: -1, "departure.timestamp": 1 })
    .limit(limit)
    .lean()
    .exec();
  return docs.map((doc) => mapRideToDTO(doc as Record<string, unknown>));
}

/** Rides posted by a specific driver (for driver profile page). */
export async function getRidesByDriver(
  driverId: string,
  limit = 10,
): Promise<RideDTO[]> {
  if (!/^[a-f0-9]{24}$/i.test(driverId)) return [];
  await connectToDatabase();
  const docs = await Ride.find({
    "driver.driverId": driverId,
    status: { $in: PUBLIC_RIDE_STATUSES },
    "departure.timestamp": { $gte: new Date() },
  })
    .sort({ "departure.timestamp": 1 })
    .limit(limit)
    .lean()
    .exec();
  return docs.map((doc) => mapRideToDTO(doc as Record<string, unknown>));
}

/** Fetch multiple rides by id array (used by favorites hydration). */
export async function getRidesByIds(ids: string[]): Promise<RideDTO[]> {
  const validIds = ids.filter((id) => /^[a-f0-9]{24}$/i.test(id));
  if (validIds.length === 0) return [];
  await connectToDatabase();
  const docs = await Ride.find({ _id: { $in: validIds } }).lean().exec();
  return docs.map((doc) => mapRideToDTO(doc as Record<string, unknown>));
}

/** Rides on a specific route (used by ride details "more on this route"). */
export async function getRelatedRides(
  fromCity: string,
  toCity: string,
  excludeId: string,
  limit = 4,
): Promise<RideDTO[]> {
  await connectToDatabase();
  const docs = await Ride.find({
    _id: { $ne: excludeId },
    "route.fromCity": fromCity,
    "route.toCity": toCity,
    status: { $in: PUBLIC_RIDE_STATUSES },
    "departure.timestamp": { $gte: new Date() },
  })
    .sort({ "departure.timestamp": 1 })
    .limit(limit)
    .lean()
    .exec();
  return docs.map((doc) => mapRideToDTO(doc as Record<string, unknown>));
}
