import { z } from "zod";

/**
 * Server-side environment schema. Validated once at module load so the app
 * fails fast on misconfiguration instead of throwing deep inside a request.
 */
const serverEnvSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .refine(
      (value) => value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
      "MONGODB_URI must be a valid MongoDB connection string",
    ),
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),
  ADMIN_PHONES: z
    .string()
    .default("")
    .transform((value) =>
      value
        .split(",")
        .map((phone) => phone.trim())
        .filter(Boolean),
    ),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

/**
 * Public environment schema. Only `NEXT_PUBLIC_*` values are exposed to the
 * browser bundle.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL")
    .default("http://localhost:3000"),
});

function parseServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid server environment variables:\n${issues}`);
  }
  return parsed.data;
}

function parseClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid public environment variables:\n${issues}`);
  }
  return parsed.data;
}

/**
 * `clientEnv` is safe to import anywhere. Access `serverEnv` only in
 * server-only modules (route handlers, server actions, services).
 */
export const clientEnv = parseClientEnv();

let cachedServerEnv: z.infer<typeof serverEnvSchema> | null = null;

export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must not be called on the client");
  }
  if (!cachedServerEnv) {
    cachedServerEnv = parseServerEnv();
  }
  return cachedServerEnv;
}
