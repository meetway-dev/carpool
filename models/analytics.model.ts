import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const routeCountSubSchema = new Schema(
  {
    fromCity: { type: String, required: true },
    toCity: { type: String, required: true },
    count: { type: Number, default: 0 },
  },
  { _id: false },
);

/**
 * Daily analytics bucket. One document per calendar day (yyyy-mm-dd) so the
 * admin dashboard can render growth charts without expensive live aggregation.
 */
const analyticsSchema = new Schema(
  {
    /** Day bucket key, e.g. "2026-07-22". */
    date: { type: String, required: true, unique: true, index: true },
    ridesCreated: { type: Number, default: 0 },
    requestsCreated: { type: Number, default: 0 },
    searches: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    cancellations: { type: Number, default: 0 },
    expirations: { type: Number, default: 0 },
    avgPrice: { type: Number, default: 0 },
    avgSeats: { type: Number, default: 0 },
    routeCounts: { type: [routeCountSubSchema], default: [] },
    /** 24-length array; index = hour of day, value = search/ride volume. */
    hourlyActivity: { type: [Number], default: () => new Array(24).fill(0) },
  },
  { timestamps: true },
);

export type AnalyticsDocument = InferSchemaType<typeof analyticsSchema>;

export const Analytics: Model<AnalyticsDocument> =
  (models.Analytics as Model<AnalyticsDocument>) ??
  model<AnalyticsDocument>("Analytics", analyticsSchema);
