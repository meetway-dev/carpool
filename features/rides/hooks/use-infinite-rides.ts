"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchRidesPage } from "@/features/rides/queries";
import type { SearchParams } from "@/validators/search.schema";
import type { PaginatedResult, RideDTO } from "@/types";

/**
 * Infinite-scroll rides query. Keyed by the active filter set so changing any
 * filter transparently starts a fresh paginated stream.
 */
export function useInfiniteRides(
  params: Partial<SearchParams>,
  initialData?: PaginatedResult<RideDTO>,
) {
  return useInfiniteQuery({
    queryKey: ["rides", params],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => fetchRidesPage(params, pageParam, signal),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialData: initialData
      ? { pages: [initialData], pageParams: [1] }
      : undefined,
  });
}
