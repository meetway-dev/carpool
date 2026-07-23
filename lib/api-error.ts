const MONGO_DUPLICATE_KEY_CODE = 11000;

function isMongoDuplicateKeyError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { code?: number; name?: string };
  return err.code === MONGO_DUPLICATE_KEY_CODE || err.name === "MongoServerError";
}

function extractMongoDuplicateField(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const err = error as { keyPattern?: Record<string, unknown> };
  const keyPattern = err.keyPattern;
  if (!keyPattern) return null;
  const field = Object.keys(keyPattern)[0];
  if (!field) return null;

  if (field === "email") return "This email is already registered.";
  if (field === "phone") return "This phone number is already in use.";
  if (field === "googleId") return "A Google account with this email already exists.";
  if (field === "resetTokenHash") return "A password reset is already in progress.";
  return `${field} already exists.`;
}

function isMongoValidationError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { name?: string };
  return err.name === "ValidationError";
}

function isMongoCastError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { name?: string };
  return err.name === "CastError";
}

function isMongoServerSelectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { name?: string; message?: string };
  return (
    err.name === "MongoServerSelectionError" ||
    (err.message?.includes("ECONNREFUSED") ?? false) ||
    (err.message?.includes("failed to connect") ?? false)
  );
}

export function handleApiError(error: unknown): { error: string; status: number } {
  if (isMongoServerSelectionError(error)) {
    console.error("Database connection error:", error);
    return { error: "Service temporarily unavailable. Please try again later.", status: 503 };
  }

  if (isMongoDuplicateKeyError(error)) {
    const fieldMessage = extractMongoDuplicateField(error);
    console.error("Duplicate key error:", error);
    return { error: fieldMessage ?? "This record already exists.", status: 409 };
  }

  if (isMongoValidationError(error)) {
    console.error("Validation error:", error);
    if (!error || typeof error !== "object") {
      return { error: "Invalid data provided.", status: 400 };
    }
    const validationError = error as { message?: string; errors?: Record<string, unknown[]> };
    const issues = validationError.errors
      ? Object.entries(validationError.errors)
          .map(([field, msgs]) => `${field}: ${(msgs as unknown[]).map((m) => (typeof m === "string" ? m : String(m))).join(", ")}`)
          .join("; ")
      : validationError.message ?? "Invalid data provided.";
    return { error: issues, status: 400 };
  }

  if (isMongoCastError(error)) {
    console.error("Invalid ID error:", error);
    return { error: "Invalid resource identifier.", status: 400 };
  }

  if (error instanceof Error) {
    console.error("Unexpected API error:", error.message);
    return { error: error.message || "An unexpected error occurred.", status: 500 };
  }

  console.error("Unknown API error:", error);
  return { error: "An unexpected error occurred.", status: 500 };
}
