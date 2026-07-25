import Link from "next/link";
import { Sparkles, TrendingUp, Plus, Clock, ArrowRight, Users, MapPin, Calendar } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchForm } from "@/features/search/components/search-form";
import { RecentSearches } from "@/features/search/components/recent-searches";
import { RideCard } from "@/features/rides/components/ride-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { getFeaturedRides } from "@/services/ride.service";
import { listRideRequests } from "@/services/ride-request.service";
import { ROUTES, POPULAR_ROUTES } from "@/constants/routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <main className="animate-fade-in">
      <AppHeader />

      <section className="px-4 pt-4 pb-2">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <SearchForm />
        </div>
      </section>

      <RecentSearches />

      <section className="space-y-3 px-4 pt-6">
        <div className="flex items-center justify-between">
          <SectionHeading icon={TrendingUp} title="Popular routes" />
          <Link
            href={ROUTES.rides}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
          {POPULAR_ROUTES.map((route) => (
            <Link
              key={route.label}
              href={`${ROUTES.rides}?fromCity=${encodeURIComponent(route.fromCity)}&toCity=${encodeURIComponent(route.toCity)}`}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft transition-all hover:border-primary/30 hover:bg-accent active:scale-[0.97]"
            >
              <MapPin className="h-3 w-3 text-primary" />
              {route.fromCity}
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              {route.toCity}
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pt-6 pb-28">
        <Tabs defaultValue="rides" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="rides" className="flex-1">
              Rides
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              Passenger requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rides" className="mt-4 space-y-3">
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
          </TabsContent>

          <TabsContent value="requests" className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <SectionHeading icon={Users} title="Passenger requests" />
            </div>

            {publicRequests.length > 0 ? (
              <div className="space-y-2.5">
                {publicRequests.map((request) => (
                  <Link
                    key={request.id}
                    href={ROUTES.requests}
                    className="card-interactive block rounded-xl border border-border bg-card p-3.5 shadow-soft"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {request.fromCity}
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        {request.toCity}
                      </div>
                      <Badge variant="secondary">
                        {request.seats} seat{request.seats === 1 ? "" : "s"}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {request.date}
                      </span>
                      {request.budget ? (
                        <span className="font-medium text-foreground">Rs {request.budget}</span>
                      ) : null}
                    </div>
                    {request.notes ? (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{request.notes}</p>
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
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <h2 className="text-sm font-semibold">{title}</h2>
    </div>
  );
}
