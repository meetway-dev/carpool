"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { SearchParams } from "@/validators/search.schema";

type Patch = Partial<Record<keyof SearchParams, string | number | boolean | undefined>>;

/**
 * Read/update the active search filters via the URL query string. The URL is
 * the single source of truth so results, filters and sharing stay in sync.
 */
export function useSearchQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback(
    (key: keyof SearchParams): string | undefined =>
      searchParams.get(key) ?? undefined,
    [searchParams],
  );

  const setParams = useCallback(
    (patch: Patch, options?: { resetPage?: boolean }) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === "" || value === false) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }
      if (options?.resetPage) next.delete("page");
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams();
    // Preserve the core route/date/seats, drop advanced filters.
    for (const key of ["fromCity", "toCity", "date", "seats", "sort"]) {
      const value = searchParams.get(key);
      if (value) next.set(key, value);
    }
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  return { get, setParams, clearFilters, searchParams };
}
