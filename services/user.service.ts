import { connectToDatabase } from "@/lib/db/connect";
import { User, type UserDocument } from "@/models/user.model";

export interface CreateEmailUserInput {
  email: string;
  passwordHash: string;
  name?: string;
  phone?: string | null;
}

export interface CreateGoogleUserInput {
  googleId: string;
  email: string;
  name?: string;
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  await connectToDatabase();
  return User.findOne({ email }).lean().exec();
}

export async function findUserById(id: string): Promise<UserDocument | null> {
  await connectToDatabase();
  return User.findById(id).lean().exec();
}

export async function findUserByGoogleId(
  googleId: string,
): Promise<UserDocument | null> {
  await connectToDatabase();
  return User.findOne({ googleId }).lean().exec();
}

export async function createEmailUser(
  input: CreateEmailUserInput,
): Promise<UserDocument> {
  await connectToDatabase();
  return User.create({
    email: input.email,
    passwordHash: input.passwordHash,
    name: input.name,
    phone: input.phone,
    provider: "email",
    verified: false,
  });
}

export async function createOrUpdateGoogleUser(
  input: CreateGoogleUserInput,
): Promise<UserDocument> {
  await connectToDatabase();
  const existing = await User.findOne({ googleId: input.googleId }).exec();
  if (existing) {
    existing.lastLoginAt = new Date();
    existing.name = existing.name || input.name;
    await existing.save();
    return existing.toObject();
  }

  const emailMatch = await User.findOne({ email: input.email }).exec();
  if (emailMatch) {
    emailMatch.googleId = input.googleId;
    emailMatch.provider = "google";
    emailMatch.verified = true;
    emailMatch.lastLoginAt = new Date();
    await emailMatch.save();
    return emailMatch.toObject();
  }

  const created = await User.create({
    googleId: input.googleId,
    email: input.email,
    name: input.name,
    provider: "google",
    verified: true,
    lastLoginAt: new Date(),
  });
  return created.toObject();
}

export async function updateLastLogin(id: string): Promise<void> {
  await connectToDatabase();
  await User.updateOne({ _id: id }, { lastLoginAt: new Date() }).exec();
}

// --- Password reset helpers ---
import { createHash } from "node:crypto";

export async function createPasswordResetToken(email: string): Promise<string | null> {
  await connectToDatabase();
  const user = await User.findOne({ email }).exec();
  if (!user) return null;

  const token = randomHex(24);
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  user.resetTokenHash = tokenHash;
  user.resetTokenExpires = expires;
  await user.save();
  return token;
}

export async function findUserByResetToken(token: string) {
  await connectToDatabase();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const now = new Date();
  const user = await User.findOne({ resetTokenHash: tokenHash, resetTokenExpires: { $gt: now } }).lean().exec();
  return user;
}

export async function setPasswordForUser(userId: string, passwordHash: string): Promise<void> {
  await connectToDatabase();
  await User.updateOne({ _id: userId }, { passwordHash, resetTokenHash: undefined, resetTokenExpires: undefined }).exec();
}

export async function updateUserProfile(userId: string, patch: Partial<{ name: string; phone?: string | null; vehicle?: { type?: string; model?: string; color?: string } }>) {
  await connectToDatabase();
  const update: any = {};
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.phone !== undefined) update.phone = patch.phone;
  if (patch.vehicle !== undefined) update.vehicle = patch.vehicle;
  await User.updateOne({ _id: userId }, { $set: update }).exec();
  return User.findById(userId).lean().exec();
}

function randomHex(bytes = 16) {
  return Buffer.from(require("crypto").randomBytes(bytes)).toString("hex");
}
