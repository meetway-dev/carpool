import { findUserById } from "@/services/user.service";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE_NAME = "rc_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_BYTES = 64;

function getAuthSecret(): string {
  return process.env.AUTH_COOKIE_SECRET || "change-me-in-production";
}

export function hashPassword(password: string): string {
  const salt = randomBytes(PASSWORD_SALT_BYTES).toString("hex");
  const derived = scryptSync(password, salt, PASSWORD_KEY_BYTES).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, derived] = storedHash.split(":");
  if (!salt || !derived) return false;
  const attempted = scryptSync(password, salt, PASSWORD_KEY_BYTES).toString("hex");
  try {
    return timingSafeEqual(Buffer.from(attempted, "hex"), Buffer.from(derived, "hex"));
  } catch {
    return false;
  }
}

interface SessionPayload {
  userId: string;
  exp: number;
}

function signPayload(payload: SessionPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getAuthSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

function verifyPayload(token: string): SessionPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = createHmac("sha256", getAuthSecret())
    .update(encoded)
    .digest("base64url");

  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken(userId: string): string {
  return signPayload({ userId, exp: Date.now() + SESSION_MAX_AGE * 1000 });
}

export function getSessionCookieValue(token: string): string {
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}; ${
    process.env.NODE_ENV === "production" ? "Secure;" : ""
  }`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${
    process.env.NODE_ENV === "production" ? "Secure;" : ""
  }`;
}

export function getSessionTokenFromCookie(cookieValue?: string): string | null {
  return cookieValue && cookieValue.includes(".") ? cookieValue : null;
}

export async function getUserFromSessionToken(token?: string) {
  if (!token) return null;
  const payload = verifyPayload(token);
  if (!payload) return null;
  return findUserById(payload.userId);
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}
