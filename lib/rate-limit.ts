/**
 * Lightweight in-memory rate limiter using a fixed-window counter.
 *
 * Suitable for the free-tier serverless model where a single instance handles
 * bursts. For multi-region scale this should be swapped for an Atlas-backed or
 * Upstash Redis limiter; the interface is intentionally minimal to allow that.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  /** Unique bucket key, e.g. `create-ride:<ip>`. */
  key: string;
  /** Max requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/** Occasionally purge expired entries to bound memory usage. */
function sweep(now: number): void {
  if (store.size < 500) return;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, limit, remaining: limit - 1, resetAt };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  return {
    success: existing.count <= limit,
    limit,
    remaining,
    resetAt: existing.resetAt,
  };
}

/** Preconfigured limiters for common actions. */
export const rateLimiters = {
  createRide: (identifier: string) =>
    rateLimit({ key: `create-ride:${identifier}`, limit: 5, windowMs: 60 * 60 * 1000 }),
  createRequest: (identifier: string) =>
    rateLimit({ key: `create-request:${identifier}`, limit: 5, windowMs: 60 * 60 * 1000 }),
  report: (identifier: string) =>
    rateLimit({ key: `report:${identifier}`, limit: 10, windowMs: 60 * 60 * 1000 }),
  search: (identifier: string) =>
    rateLimit({ key: `search:${identifier}`, limit: 60, windowMs: 60 * 1000 }),
} as const;
