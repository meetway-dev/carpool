"use client";

import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";

/**
 * Favorites overview. Ride details are hydrated from the API by id in Phase 5;
 * for now this confirms saved counts from device storage.
 */
export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const totalRides = favorites.rides.length;
  const totalRoutes = favorites.routes.length;
  const totalDrivers = favorites.drivers.length;
  const isEmpty = totalRides + totalRoutes + totalDrivers === 0;

  return (
    <main>
      <AppHeader title="Saved" />
      <div className="px-4 py-4">
        {isEmpty ? (
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            description="Tap the heart on any ride to save it here for quick access."
            action={
              <Button asChild>
                <Link href={ROUTES.rides}>
                  <Search /> Find rides
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <SavedStat label="Rides" value={totalRides} />
            <SavedStat label="Routes" value={totalRoutes} />
            <SavedStat label="Drivers" value={totalDrivers} />
          </div>
        )}
      </div>
    </main>
  );
}

function SavedStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-card p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
