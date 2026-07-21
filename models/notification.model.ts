import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const notificationSchema = new Schema(
  {
    ownerKey: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["rideExpired", "savedRouteMatch", "seatUpdate", "announcement"],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    /** Arbitrary payload, e.g. { rideId, fromCity, toCity }. */
    meta: { type: Schema.Types.Mixed },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

notificationSchema.index({ ownerKey: 1, read: 1, createdAt: -1 });

export type NotificationDocument = InferSchemaType<typeof notificationSchema>;

export const Notification: Model<NotificationDocument> =
  (models.Notification as Model<NotificationDocument>) ??
  model<NotificationDocument>("Notification", notificationSchema);
