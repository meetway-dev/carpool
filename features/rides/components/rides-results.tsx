"use client";

import { useEffect, useMemo, useRef } from "react";
import { SearchX, Loader2, AlertCircle } from "lucide-react";
import { RideCard } from "@/features/rides/components/ride-card";
import { RideCardSkeletonList } from "@/features/rides/components/ride-card-skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInfiniteRides } from "@/features/rides/hooks/use-infinite-rides";
import { saveSearchToHistory } from "@/features/search/actions/record-search";
import { useDeviceKey } from "@/hooks/use-device-key";
import type { SearchParams } from "@/validators/search.schema";
import type { PaginatedResult, RideDTO } from "@/types";

interface RidesResultsProps {
  params: Partial<SearchParams>;
  initialData?: PaginatedResult<RideDTO>;
}

/** Client-side infinite-scroll list of rides driven by the active filters. */
export function RidesResults({ params, initialData }: RidesResultsProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteRides(params, initialData);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const deviceKey = useDeviceKey();
  const recordedRef = useRef(false);

  const rides = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );
  const total = data?.pages[0]?.total ?? 0;

  // Record this search to history once, when a route is present and results resolve.
  useEffect(() => {
    if (recordedRef.current || !deviceKey || isLoading) return;
    if (!params.fromCity && !params.toCity) return;
    recordedRef.current = true;
    void saveSearchToHistory(deviceKey, {
      fromCity: params.fromCity,
      toCity: params.toCity,
      date: params.date,
      filters: {
        sort: params.sort,
        vehicleType: params.vehicleType,
        seats: params.seats,
        timeWindow: params.timeWindow,
      },
      resultsCount: total,
    });
  }, [deviceKey, isLoading, params, total]);

  // Auto-load the next page when the sentinel scrolls into view.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <RideCardSkeletonList count={5} />;
  }

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Couldn't load rides"
        description={error instanceof Error ? error.message : "Please try again."}
        action={
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        }
      />
    );
  }

  if (rides.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No rides found"
        description="Try widening your filters, choosing another date, or checking back soon."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="tabular-nums">
          {total} {total === 1 ? "ride" : "rides"}
        </Badge>
      </div>

      <div className="space-y-3">
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>

      <div ref={sentinelRef} aria-hidden className="h-px" />

      {isFetchingNextPage ? (
        <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading more…
        </div>
      ) : null}

      {!hasNextPage && rides.length > 0 ? (
        <p className="py-3 text-center text-xs text-muted-foreground">
          You&apos;ve reached the end.
        </p>
      ) : null}
    </div>
  );
}
