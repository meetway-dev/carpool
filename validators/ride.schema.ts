import { CITY_NAMES } from "@/constants/cities";
import { VEHICLE_COLORS, VEHICLE_TYPE_VALUES } from "@/constants/vehicle-types";
import { isValidPakistaniPhone, normalizePakistaniPhone } from "@/lib/phone";
import { z } from "zod";

/** Reusable Pakistani phone field that normalizes to E.164 on parse. */
export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .refine(isValidPakistaniPhone, "Enter a valid Pakistani mobile number")
  .transform((value) => normalizePakistaniPhone(value) as string);

export const citySchema = z.enum(CITY_NAMES, {
  errorMap: () => ({ message: "Select a supported city" }),
});

const vehicleTypeSchema = z.enum(VEHICLE_TYPE_VALUES, {
  errorMap: () => ({ message: "Select a vehicle type" }),
});

const vehicleColorSchema = z.enum(
  VEHICLE_COLORS as unknown as [string, ...string[]],
  { errorMap: () => ({ message: "Select a vehicle color" }) },
);

/** "HH:mm" 24-hour time string. */
const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time (HH:mm)");

/** Ride options / amenities. */
export const rideOptionsSchema = z.object({
  smoking: z.boolean().default(false),
  ac: z.boolean().default(true),
  femaleOnly: z.boolean().default(false),
  music: z.boolean().default(true),
});

export const rideRecurrenceSchema = z.object({
  repeatDaily: z.boolean().default(false),
  repeatWeekly: z.boolean().default(false),
});

/**
 * Base object schema (no cross-field refinements) so it can be reused for
 * partial update schemas via `.partial()`.
 */
export const rideBaseSchema = z.object({
  driverName: z
    .string()
    .min(2, "Name is too short")
    .max(60, "Name is too long")
    .trim(),
  phone: phoneSchema,
  vehicleType: vehicleTypeSchema,
  vehicleModel: z.string().min(1, "Vehicle model is required").max(60).trim(),
  vehicleColor: vehicleColorSchema,
  vehicleNumber: z.string().max(20).trim().optional().or(z.literal("")),
  pricePerSeat: z
    .number({ invalid_type_error: "Enter a price" })
    .int("Price must be a whole number")
    .min(50, "Price seems too low")
    .max(50_000, "Price seems too high"),
  seatsTotal: z
    .number({ invalid_type_error: "Enter seats" })
    .int()
    .min(1, "At least 1 seat")
    .max(30, "Too many seats"),
  fromCity: citySchema,
  toCity: citySchema,
  pickupPoint: z.string().trim().max(120, "Pickup point is too long").optional().or(z.literal("")),
  dropPoint: z.string().trim().max(120, "Drop point is too long").optional().or(z.literal("")),
  date: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date"),
  time: timeSchema,
  arrivalEstimate: z.string().max(60).trim().optional().or(z.literal("")),
  notes: z.string().max(500, "Notes are too long").trim().optional().or(z.literal("")),
  options: rideOptionsSchema,
  recurrence: rideRecurrenceSchema,
  autoExpire: z.boolean().default(true),
});

/**
 * Create-ride input. Used both on the client (React Hook Form) and on the
 * server (server action) so validation logic never diverges.
 */
export const createRideSchema = rideBaseSchema
  .refine((data) => data.fromCity !== data.toCity, {
    message: "Pickup and drop cities must differ",
    path: ["toCity"],
  })
  .refine(
    (data) => {
      const departure = new Date(`${data.date}T${data.time}:00`);
      return departure.getTime() > Date.now() - 60_000;
    },
    { message: "Departure must be in the future", path: ["date"] },
  );

export type CreateRideInput = z.infer<typeof createRideSchema>;

/** Partial update schema for editing rides (admin / driver). */
export const updateRideSchema = rideBaseSchema.partial().extend({
  seatsLeft: z.number().int().min(0).max(30).optional(),
});

export type UpdateRideInput = z.infer<typeof updateRideSchema>;
