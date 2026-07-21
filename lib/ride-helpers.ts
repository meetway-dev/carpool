import { createHash } from "node:crypto";
import { deriveSeatStatus, type RideStatus } from "@/constants/ride-status";

interface DepartureParts {
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
}

/** Combine date + time strings into a single Date (local server time). */
export function computeDepartureTimestamp({ date, time }: DepartureParts): Date {
  return new Date(`${date}T${time}:00`);
}

/**
 * Default expiry: the later of (departure time) or (now) is when a ride is no
 * longer relevant. We expire shortly after departure so results stay fresh.
 */
export function computeExpiresAt(departure: Date): Date {
  const buffer = 3 * 60 * 60 * 1000; // 3 hours past departure
  return new Date(departure.getTime() + buffer);
}

interface DuplicateHashInput {
  phone: string;
  fromCity: string;
  toCity: string;
  date: string;
  time: string;
}

/**
 * Stable hash identifying a logically-identical posting (same driver, route and
 * departure). Used to detect and reject duplicate posts.
 */
export function buildDuplicateHash({
  phone,
  fromCity,
  toCity,
  date,
  time,
}: DuplicateHashInput): string {
  const normalized = [phone, fromCity, toCity, date, time]
    .map((part) => part.trim().toLowerCase())
    .join("|");
  return createHash("sha1").update(normalized).digest("hex");
}

interface SearchTextInput {
  driverName: string;
  fromCity: string;
  toCity: string;
  pickupPoint: string;
  dropPoint: string;
  vehicleModel: string;
  vehicleType: string;
  notes?: string;
}

/** Denormalized lowercase blob powering keyword/text search. */
export function buildSearchText(input: SearchTextInput): string {
  return [
    input.driverName,
    input.fromCity,
    input.toCity,
    input.pickupPoint,
    input.dropPoint,
    input.vehicleModel,
    input.vehicleType,
    input.notes ?? "",
  ]
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Resolve the correct status given seats and whether the ride has expired. */
export function resolveRideStatus(seatsLeft: number, departure: Date): RideStatus {
  if (departure.getTime() < Date.now()) return "expired";
  return deriveSeatStatus(seatsLeft);
}
