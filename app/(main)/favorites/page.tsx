"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Heart, Search, MapPin, ArrowRight } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { RideCard } from "@/features/rides/components/ride-card";
import { RideCardSkeletonList } from "@/features/rides/components/ride-card-skeleton";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { ROUTES } from "@/constants/routes";
import type { RideDTO } from "@/types";

async function fetchRidesByIds(ids: string[]): Promise<RideDTO[]> {
  if (!ids.length) return [];
  const qs = ids.map((id) => `ids=${id}`).join("&");
  const res = await fetch(`/api/rides/by-ids?${qs}`);
  if (!res.ok) return [];
  return res.json() as Promise<RideDTO[]>;
}

export default function FavoritesPage() {
  const { favorites, toggleRoute } = useFavorites();

  const { data: savedRides, isLoading } = useQuery({
    queryKey: ["saved-rides", favorites.rides],
    queryFn: () => fetchRidesByIds(favorites.rides),
    enabled: favorites.rides.length > 0,
  });

  return (
    <main>
      <AppHeader title="Saved" />
      <div className="px-4 py-4">
        <Tabs defaultValue="rides">
          <TabsList className="w-full">
            <TabsTrigger value="rides" className="flex-1">
              Rides {favorites.rides.length > 0 ? `(${favorites.rides.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex-1">
              Routes {favorites.routes.length > 0 ? `(${favorites.routes.length})` : ""}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rides" className="mt-4 space-y-3">
            {favorites.rides.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No saved rides"
                description="Tap the heart on any ride to save it here."
                action={
                  <Button asChild>
                    <Link href={ROUTES.rides}>
                      <Search /> Find rides
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

          <TabsContent value="routes" className="mt-4 space-y-2">
            {favorites.routes.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="No saved routes"
                description="Save a route to get notified when new rides are posted."
              />
            ) : (
              favorites.routes.map((route) => (
                <div
                  key={`${route.fromCity}-${route.toCity}`}
                  className="flex items-center justify-between rounded-xl border bg-card p-3"
                >
                  <Link
                    href={`${ROUTES.rides}?fromCity=${encodeURIComponent(route.fromCity)}&toCity=${encodeURIComponent(route.toCity)}`}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    {route.fromCity}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    {route.toCity}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRoute(route.fromCity, route.toCity)}
                    className="text-muted-foreground"
                  >
                    Remove
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
