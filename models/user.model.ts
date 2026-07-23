import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String },
    googleId: { type: String },
    name: { type: String, trim: true },
    phone: { type: String, trim: true, index: true, unique: true, sparse: true },
    vehicle: {
      type: {
        type: String,
      },
      model: { type: String },
      color: { type: String },
    },
    provider: { type: String, enum: ["email", "google"], required: true },
    verified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    // Password reset token hash and expiry for forgot-password flow
    resetTokenHash: { type: String, index: true, sparse: true },
    resetTokenExpires: { type: Date, index: true, sparse: true },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

export type UserDocument = InferSchemaType<typeof userSchema>;

export const User: Model<UserDocument> =
  (models.User as Model<UserDocument>) ?? model<UserDocument>("User", userSchema);
