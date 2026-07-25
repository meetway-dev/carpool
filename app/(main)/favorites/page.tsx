"use client";

import { EmptyState } from "@/components/feedback/empty-state";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/constants/routes";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { RideCard } from "@/features/rides/components/ride-card";
import { RideCardSkeletonList } from "@/features/rides/components/ride-card-skeleton";
import { getApi } from "@/lib/api-client";
import type { RideDTO } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Heart, MapPin, Search, X } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function fetchRidesByIds(ids: string[]): Promise<RideDTO[]> {
  if (!ids.length) return [];
  const qs = ids.map((id) => `ids=${id}`).join("&");
  return getApi<RideDTO[]>(`/api/rides/by-ids?${qs}`);
}

export default function FavoritesPage() {
  const { favorites, toggleRoute } = useFavorites();

  const { data: savedRides, isLoading } = useQuery({
    queryKey: ["saved-rides", favorites.rides],
    queryFn: () => fetchRidesByIds(favorites.rides),
    enabled: favorites.rides.length > 0,
  });

  return (
    <main className="animate-fade-in">
      <AppHeader title="Saved" />
      <div className="px-4 py-4">
        <Tabs defaultValue="rides">
          <TabsList className="w-full">
            <TabsTrigger value="rides" className="flex-1 gap-1.5">
              Rides
              {favorites.rides.length > 0 ? (
                <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 py-0 text-[11px]">
                  {favorites.rides.length}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex-1 gap-1.5">
              Routes
              {favorites.routes.length > 0 ? (
                <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 py-0 text-[11px]">
                  {favorites.routes.length}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rides" className="mt-4 space-y-3">
            {favorites.rides.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No saved rides"
                description="Tap the heart on any ride to save it here for quick access."
                action={
                  <Button asChild>
                    <Link href={ROUTES.rides}>
                      <Search className="h-4 w-4" /> Find rides
                    </Link>
                  </Button>
                }
              />
            ) : isLoading ? (
              <RideCardSkeletonList count={3} />
            ) : (
              (savedRides ?? []).map((ride) => <RideCard key={ride.id} ride={ride} />)
            )}
          </TabsContent>

          <TabsContent value="routes" className="mt-4 space-y-2.5">
            {favorites.routes.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="No saved routes"
                description="Save a route to quickly search for rides on your frequent trips."
              />
            ) : (
              favorites.routes.map((route) => (
                <div
                  key={`${route.fromCity}-${route.toCity}`}
                  className="card-interactive flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-soft"
                >
                  <Link
                    href={`${ROUTES.rides}?fromCity=${encodeURIComponent(route.fromCity)}&toCity=${encodeURIComponent(route.toCity)}`}
                    className="flex items-center gap-2.5 text-sm font-medium"
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    {route.fromCity}
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    {route.toCity}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRoute(route.fromCity, route.toCity)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${route.fromCity} to ${route.toCity}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
