import { connectToDatabase } from "@/lib/db/connect";
import { SearchHistory } from "@/models/search-history.model";

export interface SearchHistoryEntry {
  id: string;
  fromCity?: string;
  toCity?: string;
  date?: string;
  filters?: Record<string, unknown>;
  resultsCount: number;
  createdAt: string;
}

function mapEntry(doc: Record<string, unknown>): SearchHistoryEntry {
  const createdAt = doc.createdAt as Date | string | undefined;
  return {
    id: String(doc._id),
    fromCity: doc.fromCity ? String(doc.fromCity) : undefined,
    toCity: doc.toCity ? String(doc.toCity) : undefined,
    date: doc.date ? String(doc.date) : undefined,
    filters: doc.filters as Record<string, unknown> | undefined,
    resultsCount: Number(doc.resultsCount ?? 0),
    createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function recordSearch(
  ownerKey: string,
  fromCity: string | undefined,
  toCity: string | undefined,
  date: string | undefined,
  filters: Record<string, unknown>,
  resultsCount: number,
): Promise<void> {
  if (!ownerKey) return;
  await connectToDatabase();
  await SearchHistory.create({ ownerKey, fromCity, toCity, date, filters, resultsCount });
}

export async function getRecentSearches(
  ownerKey: string,
  limit = 8,
): Promise<SearchHistoryEntry[]> {
  await connectToDatabase();
  const docs = await SearchHistory.find({ ownerKey })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();
  return docs.map((d) => mapEntry(d as Record<string, unknown>));
}

/** Top searched routes across all users (for home trending section). */
export async function getTrendingRoutes(
  limit = 6,
): Promise<Array<{ fromCity: string; toCity: string; count: number }>> {
  await connectToDatabase();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const results = await SearchHistory.aggregate([
    { $match: { fromCity: { $exists: true }, toCity: { $exists: true }, createdAt: { $gte: since } } },
    { $group: { _id: { fromCity: "$fromCity", toCity: "$toCity" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]).exec();
  return results.map((r: { _id: { fromCity: string; toCity: string }; count: number }) => ({
    fromCity: r._id.fromCity,
    toCity: r._id.toCity,
    count: r.count,
  }));
}
