import type { RideRequestDTO } from "@/types";

/** Convert a lean Mongoose ride-request document into a serializable DTO. */
export function mapRideRequestToDTO(doc: Record<string, unknown>): RideRequestDTO {
  const passenger = (doc.passenger ?? {}) as Record<string, unknown>;
  const createdAt = doc.createdAt as Date | string | undefined;

  return {
    id: String(doc._id),
    passenger: {
      name: String(passenger.name ?? ""),
      phone: String(passenger.phone ?? ""),
    },
    fromCity: String(doc.fromCity ?? ""),
    toCity: String(doc.toCity ?? ""),
    date: String(doc.date ?? ""),
    seats: Number(doc.seats ?? 1),
    budget: doc.budget !== undefined && doc.budget !== null ? Number(doc.budget) : undefined,
    notes: doc.notes ? String(doc.notes) : undefined,
    status: (doc.status ?? "open") as RideRequestDTO["status"],
    createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
  };
}
