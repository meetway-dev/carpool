"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { History, ArrowRight } from "lucide-react";
import { useDeviceKey } from "@/hooks/use-device-key";
import { ROUTES } from "@/constants/routes";
import type { SearchHistoryEntry } from "@/services/search-history.service";

async function fetchHistory(ownerKey: string): Promise<SearchHistoryEntry[]> {
  const res = await fetch(`/api/search-history?ownerKey=${encodeURIComponent(ownerKey)}`);
  if (!res.ok) return [];
  return res.json() as Promise<SearchHistoryEntry[]>;
}

/** Recent searches chip row on the home screen. Renders nothing when empty. */
export function RecentSearches() {
  const deviceKey = useDeviceKey();

  const { data } = useQuery({
    queryKey: ["search-history", deviceKey],
    queryFn: () => fetchHistory(deviceKey!),
    enabled: Boolean(deviceKey),
    staleTime: 30_000,
  });

  const searches = (data ?? []).filter((s) => s.fromCity && s.toCity).slice(0, 6);
  if (searches.length === 0) return null;

  return (
    <section className="space-y-3 px-4 pt-8">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Recent searches</h2>
      </div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {searches.map((search) => (
          <Link
            key={search.id}
            href={`${ROUTES.rides}?fromCity=${encodeURIComponent(search.fromCity!)}&toCity=${encodeURIComponent(search.toCity!)}${search.date ? `&date=${search.date}` : ""}`}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-card px-3.5 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
          >
            {search.fromCity}
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            {search.toCity}
          </Link>
        ))}
      </div>
    </section>
  );
}
