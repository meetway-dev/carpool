import type { RideStatus } from "@/constants/ride-status";
import type { VehicleColor, VehicleType } from "@/constants/vehicle-types";
import type { RideDTO } from "@/types";

/**
 * Convert a lean/hydrated Mongoose ride document into a plain, serializable
 * DTO safe to pass from Server Components to the client.
 */
export function mapRideToDTO(doc: Record<string, unknown>): RideDTO {
  const driver = (doc.driver ?? {}) as Record<string, unknown>;
  const vehicle = (doc.vehicle ?? {}) as Record<string, unknown>;
  const route = (doc.route ?? {}) as Record<string, unknown>;
  const departure = (doc.departure ?? {}) as Record<string, unknown>;
  const options = (doc.options ?? {}) as Record<string, unknown>;

  const departureTimestamp = departure.timestamp as Date | string | undefined;
  const createdAt = doc.createdAt as Date | string | undefined;
  const expiresAt = doc.expiresAt as Date | string | undefined;
  const driverId = driver.driverId as { toString(): string } | undefined;

  return {
    id: String(doc._id),
    driver: {
      name: String(driver.name ?? ""),
      phone: String(driver.phone ?? ""),
      photoUrl: driver.photoUrl ? String(driver.photoUrl) : undefined,
      verified: Boolean(driver.verified),
      driverId: driverId ? driverId.toString() : undefined,
    },
    vehicle: {
      type: (vehicle.type ?? "Car") as VehicleType,
      model: String(vehicle.model ?? ""),
      color: (vehicle.color ?? "White") as VehicleColor,
      number: vehicle.number ? String(vehicle.number) : undefined,
    },
    route: {
      fromCity: String(route.fromCity ?? ""),
      toCity: String(route.toCity ?? ""),
      pickupPoint: String(route.pickupPoint ?? ""),
      dropPoint: String(route.dropPoint ?? ""),
    },
    pricePerSeat: Number(doc.pricePerSeat ?? 0),
    seatsTotal: Number(doc.seatsTotal ?? 0),
    seatsLeft: Number(doc.seatsLeft ?? 0),
    departure: {
      date: String(departure.date ?? ""),
      time: String(departure.time ?? ""),
      timestamp: departureTimestamp
        ? new Date(departureTimestamp).toISOString()
        : new Date().toISOString(),
    },
    arrivalEstimate: doc.arrivalEstimate ? String(doc.arrivalEstimate) : undefined,
    options: {
      smoking: Boolean(options.smoking),
      ac: Boolean(options.ac),
      femaleOnly: Boolean(options.femaleOnly),
      music: Boolean(options.music),
    },
    notes: doc.notes ? String(doc.notes) : undefined,
    status: (doc.status ?? "open") as RideStatus,
    featured: Boolean(doc.featured),
    createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
  };
}
