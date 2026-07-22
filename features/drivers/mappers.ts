import type { DriverDTO } from "@/types";

/** Convert a lean Mongoose driver document into a serializable DTO. */
export function mapDriverToDTO(doc: Record<string, unknown>): DriverDTO {
  const vehicle = doc.vehicle as Record<string, unknown> | undefined;
  const createdAt = doc.createdAt as Date | string | undefined;

  return {
    id: String(doc._id),
    name: String(doc.name ?? ""),
    phone: String(doc.phone ?? ""),
    photoUrl: doc.photoUrl ? String(doc.photoUrl) : undefined,
    rating: Number(doc.rating ?? 0),
    ratingCount: Number(doc.ratingCount ?? 0),
    completedTrips: Number(doc.completedTrips ?? 0),
    memberSince: createdAt
      ? new Date(createdAt).toISOString()
      : new Date().toISOString(),
    verified: Boolean(doc.verified),
    bio: doc.bio ? String(doc.bio) : undefined,
    languages: Array.isArray(doc.languages) ? (doc.languages as string[]) : [],
    homeCity: doc.homeCity ? String(doc.homeCity) : undefined,
    vehicle: vehicle
      ? {
          type: String(vehicle.type ?? ""),
          model: String(vehicle.model ?? ""),
          color: String(vehicle.color ?? ""),
          number: vehicle.number ? String(vehicle.number) : undefined,
        }
      : undefined,
  };
}
