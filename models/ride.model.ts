import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { RIDE_STATUSES } from "@/constants/ride-status";
import { VEHICLE_TYPES, VEHICLE_COLORS } from "@/constants/vehicle-types";
import { CITY_NAMES } from "@/constants/cities";

const driverSubSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, index: true },
    photoUrl: { type: String },
    verified: { type: Boolean, default: false },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
  },
  { _id: false },
);

const vehicleSubSchema = new Schema(
  {
    type: { type: String, enum: VEHICLE_TYPES, required: true },
    model: { type: String, required: true, trim: true },
    color: { type: String, enum: VEHICLE_COLORS, required: true },
    number: { type: String, trim: true },
  },
  { _id: false },
);

const routeSubSchema = new Schema(
  {
    fromCity: { type: String, enum: CITY_NAMES, required: true },
    toCity: { type: String, enum: CITY_NAMES, required: true },
    pickupPoint: { type: String, required: true, trim: true },
    dropPoint: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const departureSubSchema = new Schema(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    timestamp: { type: Date, required: true, index: true },
  },
  { _id: false },
);

const optionsSubSchema = new Schema(
  {
    luggage: { type: Boolean, default: true },
    smoking: { type: Boolean, default: false },
    ac: { type: Boolean, default: true },
    femaleOnly: { type: Boolean, default: false },
    music: { type: Boolean, default: true },
    pets: { type: Boolean, default: false },
    returnTrip: { type: Boolean, default: false },
  },
  { _id: false },
);

const recurrenceSubSchema = new Schema(
  {
    repeatDaily: { type: Boolean, default: false },
    repeatWeekly: { type: Boolean, default: false },
  },
  { _id: false },
);

const rideSchema = new Schema(
  {
    driver: { type: driverSubSchema, required: true },
    vehicle: { type: vehicleSubSchema, required: true },
    route: { type: routeSubSchema, required: true },
    pricePerSeat: { type: Number, required: true, min: 0 },
    seatsTotal: { type: Number, required: true, min: 1 },
    seatsLeft: { type: Number, required: true, min: 0 },
    departure: { type: departureSubSchema, required: true },
    arrivalEstimate: { type: String, trim: true },
    options: { type: optionsSubSchema, default: () => ({}) },
    recurrence: { type: recurrenceSubSchema, default: () => ({}) },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: RIDE_STATUSES,
      default: "open",
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    /** Hash of normalized route+driver+departure used for duplicate detection. */
    duplicateHash: { type: String, index: true },
    /** Denormalized lowercased text for keyword/text search. */
    searchText: { type: String },
    /** Device/session key of the poster (v1 anonymous ownership). */
    ownerKey: { type: String, index: true },
    expiresAt: { type: Date, index: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Compound index powering the primary route+date+status query path.
rideSchema.index({ "route.fromCity": 1, "route.toCity": 1, "departure.timestamp": 1 });
rideSchema.index({ status: 1, "departure.timestamp": 1 });
rideSchema.index({ status: 1, featured: -1, createdAt: -1 });
rideSchema.index({ searchText: "text" });

export type RideDocument = InferSchemaType<typeof rideSchema>;

export const Ride: Model<RideDocument> =
  (models.Ride as Model<RideDocument>) ?? model<RideDocument>("Ride", rideSchema);
