import { z } from "zod";
import { citySchema, phoneSchema } from "@/validators/ride.schema";
import { VEHICLE_TYPE_VALUES, VEHICLE_COLORS } from "@/constants/vehicle-types";

export const driverVehicleSchema = z.object({
  type: z.enum(VEHICLE_TYPE_VALUES),
  model: z.string().min(1).max(60).trim(),
  color: z.enum(VEHICLE_COLORS as unknown as [string, ...string[]]),
  number: z.string().max(20).trim().optional().or(z.literal("")),
});

export const upsertDriverSchema = z.object({
  name: z.string().min(2).max(60).trim(),
  phone: phoneSchema,
  photoUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(500).trim().optional().or(z.literal("")),
  homeCity: citySchema.optional(),
  languages: z.array(z.string().min(1).max(30)).max(6).default([]),
  vehicle: driverVehicleSchema.optional(),
});

export type UpsertDriverInput = z.infer<typeof upsertDriverSchema>;

export const REPORT_REASONS = [
  "Fake ride",
  "Wrong price",
  "Seats not available",
  "Inappropriate content",
  "Spam or duplicate",
  "Safety concern",
  "Other",
] as const;

export const createReportSchema = z.object({
  targetType: z.enum(["ride", "driver", "request"]),
  targetId: z.string().min(1),
  reason: z.enum(REPORT_REASONS),
  details: z.string().max(500).trim().optional().or(z.literal("")),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
