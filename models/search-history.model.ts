import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const searchHistorySchema = new Schema(
  {
    ownerKey: { type: String, required: true, index: true },
    fromCity: { type: String },
    toCity: { type: String },
    date: { type: String },
    /** Serialized filter snapshot for re-running the search. */
    filters: { type: Schema.Types.Mixed },
    resultsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

searchHistorySchema.index({ ownerKey: 1, createdAt: -1 });
// Aggregate route popularity across all users for analytics/home.
searchHistorySchema.index({ fromCity: 1, toCity: 1, createdAt: -1 });

export type SearchHistoryDocument = InferSchemaType<typeof searchHistorySchema>;

export const SearchHistory: Model<SearchHistoryDocument> =
  (models.SearchHistory as Model<SearchHistoryDocument>) ??
  model<SearchHistoryDocument>("SearchHistory", searchHistorySchema);
