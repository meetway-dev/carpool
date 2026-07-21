import Link from "next/link";
import { Sparkles, TrendingUp, Plus, Clock } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchForm } from "@/features/search/components/search-form";
import { RideCard } from "@/features/rides/components/ride-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { getFeaturedRides } from "@/services/ride.service";
import { ROUTES, POPULAR_ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import type { RideDTO } from "@/types";

export const dynamic = "force-dynamic";

async function loadFeatured(): Promise<RideDTO[]> {
  try {
    return await getFeaturedRides(6);
  } catch (error) {
    console.error("Failed to load featured rides:", error);
    return [];
  }
}

export default async function HomePage() {
  const featured = await loadFeatured();

  return (
    <main>
      <AppHeader />

      <section className="space-y-4 px-4 pt-5">
        <div className="space-y-1.5">
          <Badge variant="success">Live in KPK &amp; Islamabad</Badge>
          <h1 className="text-2xl font-bold leading-tight">
            Find your next ride in seconds.
          </h1>
          <p className="text-sm text-muted-foreground">{siteConfig.description}</p>
        </div>

        <Card className="glass">
          <CardContent className="p-4">
            <SearchForm />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3 px-4 pt-8">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Popular routes</h2>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {POPULAR_ROUTES.map((route) => (
            <Link
              key={route.label}
              href={`${ROUTES.rides}?fromCity=${encodeURIComponent(route.fromCity)}&toCity=${encodeURIComponent(route.toCity)}`}
              className="whitespace-nowrap rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
            >
              {route.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3 px-4 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Featured &amp; upcoming rides</h2>
          </div>
          <Link
            href={ROUTES.rides}
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
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
