import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const bookingSchema = new Schema(
  {
    rideId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "Ride" },
    passenger: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    seats: { type: Number, required: true, min: 1 },
      status: { type: String, enum: ["confirmed", "pending", "cancelled"], default: "confirmed" },
      notes: { type: String, trim: true },
    ownerKey: { type: String, index: true },
  },
  { timestamps: true },
);

export type BookingDocument = InferSchemaType<typeof bookingSchema>;

export const Booking: Model<BookingDocument> =
  (models.Booking as Model<BookingDocument>) ?? model<BookingDocument>("Booking", bookingSchema);
