"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDeviceKey } from "@/hooks/use-device-key";
import {
  toggleRideFavorite,
  toggleDriverFavorite,
  toggleRouteFavorite,
} from "@/features/favorites/actions/toggle-favorite";

interface SavedRoute {
  fromCity: string;
  toCity: string;
}

interface FavoritesState {
  rides: string[];
  drivers: string[];
  routes: SavedRoute[];
}

const EMPTY: FavoritesState = { rides: [], drivers: [], routes: [] };

async function fetchFavorites(ownerKey: string): Promise<FavoritesState> {
  const res = await fetch(`/api/favorites?ownerKey=${encodeURIComponent(ownerKey)}`);
  if (!res.ok) return EMPTY;
  return res.json() as Promise<FavoritesState>;
}

/**
 * Server-persisted favorites keyed by the anonymous device key. Uses TanStack
 * Query with optimistic cache updates so the UI feels instant while the toggle
 * server action commits. Route favorites drive saved-route notifications.
 */
export function useFavorites() {
  const deviceKey = useDeviceKey();
  const queryClient = useQueryClient();
  const queryKey = ["favorites", deviceKey];

  const { data: favorites = EMPTY } = useQuery({
    queryKey,
    queryFn: () => fetchFavorites(deviceKey!),
    enabled: Boolean(deviceKey),
    staleTime: 30_000,
  });

  const patch = useCallback(
    (updater: (prev: FavoritesState) => FavoritesState) => {
      queryClient.setQueryData<FavoritesState>(queryKey, (prev) =>
        updater(prev ?? EMPTY),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryClient, deviceKey],
  );

  const isRideSaved = useCallback(
    (rideId: string) => favorites.rides.includes(rideId),
    [favorites.rides],
  );

  const toggleRide = useCallback(
    (rideId: string) => {
      if (!deviceKey) return;
      const wasSaved = favorites.rides.includes(rideId);
      patch((prev) => ({
        ...prev,
        rides: wasSaved
          ? prev.rides.filter((id) => id !== rideId)
          : [rideId, ...prev.rides],
      }));
      void toggleRideFavorite(deviceKey, rideId).then((res) => {
        if (!res.success) {
          patch((prev) => ({
            ...prev,
            rides: wasSaved
              ? [rideId, ...prev.rides]
              : prev.rides.filter((id) => id !== rideId),
          }));
          toast.error(res.error);
        }
      });
    },
    [deviceKey, favorites.rides, patch],
  );

  const isDriverSaved = useCallback(
    (driverId: string) => favorites.drivers.includes(driverId),
    [favorites.drivers],
  );

  const toggleDriver = useCallback(
    (driverId: string) => {
      if (!deviceKey) return;
      const wasSaved = favorites.drivers.includes(driverId);
      patch((prev) => ({
        ...prev,
        drivers: wasSaved
          ? prev.drivers.filter((id) => id !== driverId)
          : [driverId, ...prev.drivers],
      }));
      void toggleDriverFavorite(deviceKey, driverId).then((res) => {
        if (!res.success) {
          patch((prev) => ({
            ...prev,
            drivers: wasSaved
              ? [driverId, ...prev.drivers]
              : prev.drivers.filter((id) => id !== driverId),
          }));
          toast.error(res.error);
        }
      });
    },
    [deviceKey, favorites.drivers, patch],
  );

  const isRouteSaved = useCallback(
    (fromCity: string, toCity: string) =>
      favorites.routes.some((r) => r.fromCity === fromCity && r.toCity === toCity),
    [favorites.routes],
  );

  const toggleRoute = useCallback(
    (fromCity: string, toCity: string) => {
      if (!deviceKey) return;
      const wasSaved = favorites.routes.some(
        (r) => r.fromCity === fromCity && r.toCity === toCity,
      );
      patch((prev) => ({
        ...prev,
        routes: wasSaved
          ? prev.routes.filter((r) => !(r.fromCity === fromCity && r.toCity === toCity))
          : [{ fromCity, toCity }, ...prev.routes],
      }));
      void toggleRouteFavorite(deviceKey, fromCity, toCity).then((res) => {
        if (!res.success) {
          patch((prev) => ({
            ...prev,
            routes: wasSaved
              ? [{ fromCity, toCity }, ...prev.routes]
              : prev.routes.filter(
                  (r) => !(r.fromCity === fromCity && r.toCity === toCity),
                ),
          }));
          toast.error(res.error);
        }
      });
    },
    [deviceKey, favorites.routes, patch],
  );

  return {
    favorites,
    isRideSaved,
    toggleRide,
    isDriverSaved,
    toggleDriver,
    isRouteSaved,
    toggleRoute,
  };
}
