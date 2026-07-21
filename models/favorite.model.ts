import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const favoriteSchema = new Schema(
  {
    /** Device/session key that owns this favorite (v1 anonymous). */
    ownerKey: { type: String, required: true, index: true },
    type: { type: String, enum: ["ride", "driver", "route"], required: true },
    /** For ride/driver favorites: the referenced document id. */
    refId: { type: String },
    /** For route favorites: normalized "from->to" pair. */
    fromCity: { type: String },
    toCity: { type: String },
  },
  { timestamps: true },
);

favoriteSchema.index({ ownerKey: 1, type: 1, refId: 1 }, { unique: true, sparse: true });
favoriteSchema.index(
  { ownerKey: 1, type: 1, fromCity: 1, toCity: 1 },
  { unique: true, sparse: true },
);

export type FavoriteDocument = InferSchemaType<typeof favoriteSchema>;

export const Favorite: Model<FavoriteDocument> =
  (models.Favorite as Model<FavoriteDocument>) ??
  model<FavoriteDocument>("Favorite", favoriteSchema);
