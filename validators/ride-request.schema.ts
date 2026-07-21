import { z } from "zod";
import { citySchema, phoneSchema } from "@/validators/ride.schema";

/**
 * Passenger "Need Ride" request. Passengers post what they need and drivers
 * reach out to them.
 */
export const createRideRequestSchema = z
  .object({
    passengerName: z
      .string()
      .min(2, "Name is too short")
      .max(60, "Name is too long")
      .trim(),
    phone: phoneSchema,
    fromCity: citySchema,
    toCity: citySchema,
    date: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date"),
    seats: z
      .number({ invalid_type_error: "Enter seats" })
      .int()
      .min(1, "At least 1 seat")
      .max(10, "Too many seats"),
    budget: z
      .number({ invalid_type_error: "Enter a budget" })
      .int()
      .min(0)
      .max(50_000)
      .optional(),
    notes: z.string().max(500, "Notes are too long").trim().optional().or(z.literal("")),
  })
  .refine((data) => data.fromCity !== data.toCity, {
    message: "Pickup and drop cities must differ",
    path: ["toCity"],
  });

export type CreateRideRequestInput = z.infer<typeof createRideRequestSchema>;
