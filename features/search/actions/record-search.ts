"use server";

import { recordSearch } from "@/services/search-history.service";

/**
 * Persist a search to the user's history (fire-and-forget from the client).
 * Silently ignores failures — history is non-critical.
 */
export async function saveSearchToHistory(
  ownerKey: string,
  params: {
    fromCity?: string;
    toCity?: string;
    date?: string;
    filters: Record<string, unknown>;
    resultsCount: number;
  },
): Promise<void> {
  if (!ownerKey) return;
  try {
    await recordSearch(
      ownerKey,
      params.fromCity,
      params.toCity,
      params.date,
      params.filters,
      params.resultsCount,
    );
  } catch {
    // Non-critical.
  }
}
