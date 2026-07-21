import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { REPORT_REASONS } from "@/validators/driver.schema";

const reportSchema = new Schema(
  {
    targetType: { type: String, enum: ["ride", "driver", "request"], required: true },
    targetId: { type: String, required: true, index: true },
    reason: { type: String, enum: REPORT_REASONS, required: true },
    details: { type: String, trim: true },
    reporterKey: { type: String, index: true },
    status: {
      type: String,
      enum: ["open", "reviewed", "actioned", "dismissed"],
      default: "open",
      index: true,
    },
  },
  { timestamps: true },
);

export type ReportDocument = InferSchemaType<typeof reportSchema>;

export const Report: Model<ReportDocument> =
  (models.Report as Model<ReportDocument>) ??
  model<ReportDocument>("Report", reportSchema);
