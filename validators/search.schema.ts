import { z } from "zod";
import { CITY_NAMES } from "@/constants/cities";
import { VEHICLE_TYPE_VALUES } from "@/constants/vehicle-types";
import { SORT_VALUES, DEFAULT_SORT, MAX_PAGE_SIZE } from "@/constants/sort";
import { TIME_WINDOW_KEYS } from "@/constants/routes";

const optionalCity = z.enum(CITY_NAMES).optional();

/**
 * Search / filter parameters. Parsed from URL query strings, so all fields are
 * optional and coerced. Drives both the results page (server) and the
 * infinite-scroll API (route handler).
 */
export const searchParamsSchema = z.object({
  fromCity: optionalCity,
  toCity: optionalCity,
  /** ISO date (yyyy-mm-dd) or one of the quick tokens. */
  date: z.string().optional(),
  datePreset: z.enum(["today", "tomorrow", "weekend"]).optional(),
  timeWindow: z
    .enum(TIME_WINDOW_KEYS as unknown as [string, ...string[]])
    .optional(),
  seats: z.coerce.number().int().min(1).max(4).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  vehicleType: z
    .enum(VEHICLE_TYPE_VALUES)
    .optional(),
  driverName: z.string().max(60).trim().optional(),
  phone: z.string().max(20).trim().optional(),
  keyword: z.string().max(80).trim().optional(),
  femaleOnly: z.coerce.boolean().optional(),
  ac: z.coerce.boolean().optional(),
  verified: z.coerce.boolean().optional(),
  sort: z.enum(SORT_VALUES).default(DEFAULT_SORT),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(12),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

/** Raw, unparsed query shape as it arrives from Next.js searchParams. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/** Safely parse loosely-typed searchParams into a validated SearchParams. */
export function parseSearchParams(raw: RawSearchParams): SearchParams {
  const flattened: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(raw)) {
    flattened[key] = Array.isArray(value) ? value[0] : value;
  }
  const result = searchParamsSchema.safeParse(flattened);
  return result.success ? result.data : searchParamsSchema.parse({});
}
