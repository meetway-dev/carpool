import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchHeader } from "@/features/search/components/search-header";
import { RidesResults } from "@/features/rides/components/rides-results";
import { RideCardSkeletonList } from "@/features/rides/components/ride-card-skeleton";
import { searchRides } from "@/services/ride.service";
import { parseSearchParams, type RawSearchParams } from "@/validators/search.schema";
import type { PaginatedResult, RideDTO } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const raw = await searchParams;
  const params = parseSearchParams(raw);
  const route =
    params.fromCity && params.toCity
      ? `${params.fromCity} to ${params.toCity}`
      : "All intercity";
  return {
    title: `${route} rides`,
    description: `Browse and compare ${route.toLowerCase()} carpool rides — filter by price, seats, time and vehicle on RideConnect.`,
  };
}

export default async function RidesPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = parseSearchParams(raw);

  let initialData: PaginatedResult<RideDTO> | undefined;
  try {
    initialData = await searchRides(params);
  } catch (error) {
    console.error("Initial ride search failed:", error);
    initialData = undefined;
  }

  return (
    <main>
      <SearchHeader
        fromCity={params.fromCity}
        toCity={params.toCity}
        date={params.date}
        seats={params.seats}
      />

      <div className="px-4 py-4">
        <Suspense fallback={<RideCardSkeletonList count={5} />}>
          <RidesResults params={params} initialData={initialData} />
        </Suspense>
      </div>
    </main>
  );
}
