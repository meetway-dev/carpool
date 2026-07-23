import Link from "next/link";
import { Sparkles, TrendingUp, Plus, Clock, ArrowRight } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";

import { SearchForm } from "@/features/search/components/search-form";
import { RecentSearches } from "@/features/search/components/recent-searches";
import { RideCard } from "@/features/rides/components/ride-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { getFeaturedRides } from "@/services/ride.service";
import { ROUTES, POPULAR_ROUTES } from "@/constants/routes";

import type { RideDTO } from "@/types";

export const dynamic = "force-dynamic";

async function loadFeatured(): Promise<RideDTO[]> {
  try {
    return await getFeaturedRides(6);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await loadFeatured();

  return (
    <main>
      <AppHeader />

      {/* Search */}
      <section className="relative overflow-hidden px-4 pb-6 pt-5">
        <div className="rounded-2xl border bg-card/80 p-4 shadow-elevated backdrop-blur-sm">
          <SearchForm />
        </div>
      </section>

      <RecentSearches />

      {/* Popular routes */}
      <section className="space-y-3 px-4 pt-7">
        <SectionHeading icon={TrendingUp} title="Popular routes" />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {POPULAR_ROUTES.map((route) => (
            <Link
              key={route.label}
              href={`${ROUTES.rides}?fromCity=${encodeURIComponent(route.fromCity)}&toCity=${encodeURIComponent(route.toCity)}`}
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-soft transition-all hover:border-primary/40 hover:bg-accent hover:shadow-elevated"
            >
              {route.fromCity}
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              {route.toCity}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured rides */}
      <section className="space-y-3 px-4 pt-7 pb-4">
        <div className="flex items-center justify-between">
          <SectionHeading icon={Sparkles} title="Featured rides" />
          <Link
            href={ROUTES.rides}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="space-y-3">
            {featured.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Clock}
            title="No rides yet"
            description="Be the first to post a ride, or check back soon as drivers add trips."
            action={
              <Button asChild>
                <Link href={ROUTES.createRide}>
                  <Plus /> Post a ride
                </Link>
              </Button>
            }
          />
        )}
      </section>
    </main>
  );
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: typeof TrendingUp;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <h2 className="text-sm font-semibold">{title}</h2>
    </div>
  );
}
