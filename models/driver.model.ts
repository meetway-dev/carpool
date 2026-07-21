import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { VEHICLE_TYPES, VEHICLE_COLORS } from "@/constants/vehicle-types";
import { CITY_NAMES } from "@/constants/cities";

const driverVehicleSubSchema = new Schema(
  {
    type: { type: String, enum: VEHICLE_TYPES },
    model: { type: String, trim: true },
    color: { type: String, enum: VEHICLE_COLORS },
    number: { type: String, trim: true },
  },
  { _id: false },
);

const driverSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, index: true },
    photoUrl: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    completedTrips: { type: Number, default: 0, min: 0 },
    verified: { type: Boolean, default: false, index: true },
    blocked: { type: Boolean, default: false, index: true },
    bio: { type: String, trim: true },
    homeCity: { type: String, enum: CITY_NAMES },
    languages: { type: [String], default: [] },
    vehicle: { type: driverVehicleSubSchema },
  },
  { timestamps: true },
);

export type DriverDocument = InferSchemaType<typeof driverSchema>;

export const Driver: Model<DriverDocument> =
  (models.Driver as Model<DriverDocument>) ??
  model<DriverDocument>("Driver", driverSchema);
