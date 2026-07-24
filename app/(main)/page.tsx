import Link from "next/link";
import { Sparkles, TrendingUp, Plus, Clock, ArrowRight, Users } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/features/search/components/search-form";
import { RecentSearches } from "@/features/search/components/recent-searches";
import { RideCard } from "@/features/rides/components/ride-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { getFeaturedRides } from "@/services/ride.service";
import { listRideRequests } from "@/services/ride-request.service";
import { ROUTES, POPULAR_ROUTES } from "@/constants/routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

import type { RideDTO } from "@/types";

export const dynamic = "force-dynamic";

async function loadFeatured(): Promise<RideDTO[]> {
  try {
    return await getFeaturedRides(6);
  } catch {
    return [];
  }
}

async function loadPublicRequests() {
  try {
    const result = await listRideRequests({ pageSize: 20 });
    return result.items;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await loadFeatured();
  const publicRequests = await loadPublicRequests();

  return (
    <main>
      <AppHeader />

      <section className="px-4 pb-4 pt-4">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
          <SearchForm />
        </div>
      </section>

      <RecentSearches />

      <section className="space-y-2.5 px-4 pt-5">
        <div className="flex items-center justify-between">
          <SectionHeading icon={TrendingUp} title="Popular routes" />
          <Link
            href={ROUTES.rides}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {POPULAR_ROUTES.map((route) => (
            <Link
              key={route.label}
              href={`${ROUTES.rides}?fromCity=${encodeURIComponent(route.fromCity)}&toCity=${encodeURIComponent(route.toCity)}`}
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium shadow-sm transition-all hover:border-primary/30 hover:bg-accent"
            >
              {route.fromCity}
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              {route.toCity}
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pt-5 pb-24">
        <Tabs defaultValue="rides" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="rides" className="flex-1">
              Rides
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              Passenger requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rides" className="space-y-2.5 mt-3">
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
              <div className="space-y-2.5">
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
          </TabsContent>

          <TabsContent value="requests" className="space-y-2.5 mt-3">
            <div className="flex items-center justify-between">
              <SectionHeading icon={Users} title="Passenger requests" />
            </div>

            {publicRequests.length > 0 ? (
              <div className="space-y-2">
                {publicRequests.map((request) => (
                  <Link
                    key={request.id}
                    href={ROUTES.requests}
                    className="block rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:border-primary/30 hover:bg-accent"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        {request.fromCity} → {request.toCity}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {request.seats} seat{request.seats === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {request.date}
                      {request.budget ? ` • Rs ${request.budget}` : ""}
                    </p>
                    {request.notes ? (
                      <p className="mt-1.5 text-xs text-muted-foreground">{request.notes}</p>
                    ) : null}
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No requests yet"
                description="Passengers haven't posted any requests. Be the first to share your ride needs."
                action={
                  <Button asChild>
                    <Link href={ROUTES.requests}>
                      <Plus /> Post a request
                    </Link>
                  </Button>
                }
              />
            )}
          </TabsContent>
        </Tabs>
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
