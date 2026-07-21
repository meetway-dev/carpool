import type { RideStatus } from "@/constants/ride-status";
import type { VehicleType, VehicleColor } from "@/constants/vehicle-types";

/** Serializable ride shape returned by services to the UI (no Mongoose docs). */
export interface RideDTO {
  id: string;
  driver: {
    name: string;
    phone: string;
    photoUrl?: string;
    verified: boolean;
    driverId?: string;
  };
  vehicle: {
    type: VehicleType;
    model: string;
    color: VehicleColor;
    number?: string;
  };
  route: {
    fromCity: string;
    toCity: string;
    pickupPoint: string;
    dropPoint: string;
  };
  pricePerSeat: number;
  seatsTotal: number;
  seatsLeft: number;
  departure: {
    date: string;
    time: string;
    timestamp: string;
  };
  arrivalEstimate?: string;
  options: {
    luggage: boolean;
    smoking: boolean;
    ac: boolean;
    femaleOnly: boolean;
    music: boolean;
    pets: boolean;
    returnTrip: boolean;
  };
  notes?: string;
  status: RideStatus;
  featured: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface RideRequestDTO {
  id: string;
  passenger: {
    name: string;
    phone: string;
  };
  fromCity: string;
  toCity: string;
  date: string;
  seats: number;
  budget?: number;
  notes?: string;
  status: "open" | "fulfilled" | "expired" | "cancelled";
  createdAt: string;
}

export interface DriverDTO {
  id: string;
  name: string;
  phone: string;
  photoUrl?: string;
  rating: number;
  ratingCount: number;
  completedTrips: number;
  memberSince: string;
  verified: boolean;
  bio?: string;
  languages: string[];
  homeCity?: string;
}

/** Standard result envelope returned from server actions. */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/** Cursor-paginated list envelope for infinite scroll. */
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/** Owner identity for device-based v1 (favorites, history, reports). */
export interface OwnerContext {
  ownerKey: string;
}
