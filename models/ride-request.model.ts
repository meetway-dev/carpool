import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CITY_NAMES } from "@/constants/cities";

const passengerSubSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, index: true },
  },
  { _id: false },
);

const rideRequestSchema = new Schema(
  {
    passenger: { type: passengerSubSchema, required: true },
    fromCity: { type: String, enum: CITY_NAMES, required: true },
    toCity: { type: String, enum: CITY_NAMES, required: true },
    date: { type: String, required: true },
    seats: { type: Number, required: true, min: 1 },
    budget: { type: Number, min: 0 },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["open", "fulfilled", "expired", "cancelled"],
      default: "open",
      index: true,
    },
    ownerKey: { type: String, index: true },
    expiresAt: { type: Date, index: true },
  },
  { timestamps: true },
);

rideRequestSchema.index({ fromCity: 1, toCity: 1, date: 1 });

export type RideRequestDocument = InferSchemaType<typeof rideRequestSchema>;

export const RideRequest: Model<RideRequestDocument> =
  (models.RideRequest as Model<RideRequestDocument>) ??
  model<RideRequestDocument>("RideRequest", rideRequestSchema);
