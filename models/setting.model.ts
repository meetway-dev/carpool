import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Key/value settings store for feature flags, announcements and tunable
 * config (e.g. rate-limit overrides) editable from the admin dashboard.
 */
const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed },
    description: { type: String },
  },
  { timestamps: true },
);

export type SettingDocument = InferSchemaType<typeof settingSchema>;

export const Setting: Model<SettingDocument> =
  (models.Setting as Model<SettingDocument>) ??
  model<SettingDocument>("Setting", settingSchema);
