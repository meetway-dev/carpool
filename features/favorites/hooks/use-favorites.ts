"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

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
const STORAGE_KEY = "rc.favorites";

/**
 * Device-based favorites (v1, no auth). Persists saved rides, drivers and
 * routes in localStorage. When accounts land, this migrates server-side.
 */
export function useFavorites() {
  const [state, setState] = useLocalStorage<FavoritesState>(STORAGE_KEY, EMPTY);

  const isRideSaved = useCallback(
    (rideId: string) => state.rides.includes(rideId),
    [state.rides],
  );

  const toggleRide = useCallback(
    (rideId: string) => {
      setState((prev) => {
        const exists = prev.rides.includes(rideId);
        return {
          ...prev,
          rides: exists
            ? prev.rides.filter((id) => id !== rideId)
            : [rideId, ...prev.rides],
        };
      });
    },
    [setState],
  );

  const isDriverSaved = useCallback(
    (driverId: string) => state.drivers.includes(driverId),
    [state.drivers],
  );

  const toggleDriver = useCallback(
    (driverId: string) => {
      setState((prev) => {
        const exists = prev.drivers.includes(driverId);
        return {
          ...prev,
          drivers: exists
            ? prev.drivers.filter((id) => id !== driverId)
            : [driverId, ...prev.drivers],
        };
      });
    },
    [setState],
  );

  const isRouteSaved = useCallback(
    (fromCity: string, toCity: string) =>
      state.routes.some((r) => r.fromCity === fromCity && r.toCity === toCity),
    [state.routes],
  );

  const toggleRoute = useCallback(
    (fromCity: string, toCity: string) => {
      setState((prev) => {
        const exists = prev.routes.some(
          (r) => r.fromCity === fromCity && r.toCity === toCity,
        );
        return {
          ...prev,
          routes: exists
            ? prev.routes.filter(
                (r) => !(r.fromCity === fromCity && r.toCity === toCity),
              )
            : [{ fromCity, toCity }, ...prev.routes],
        };
      });
    },
    [setState],
  );

  return {
    favorites: state,
    isRideSaved,
    toggleRide,
    isDriverSaved,
    toggleDriver,
    isRouteSaved,
    toggleRoute,
  };
}
