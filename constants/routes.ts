import { CITIES } from "@/constants/cities";

/** App route paths in one place to avoid magic strings. */
export const ROUTES = {
  home: "/",
  rides: "/rides",
  createRide: "/rides/create",
  rideDetails: (rideId: string) => `/rides/${rideId}`,
  requests: "/requests",
  createRequest: "/requests/create",
  driverProfile: (driverId: string) => `/drivers/${driverId}`,
  favorites: "/favorites",
  notifications: "/notifications",
  profile: "/profile",
  admin: {
    root: "/admin",
    rides: "/admin/rides",
    users: "/admin/users",
    reports: "/admin/reports",
    analytics: "/admin/analytics",
  },
} as const;

export interface PopularRoute {
  fromCity: string;
  toCity: string;
  label: string;
}

/** Curated high-traffic routes surfaced on the home screen. */
export const POPULAR_ROUTES: readonly PopularRoute[] = [
  { fromCity: "Peshawar", toCity: "Islamabad", label: "Peshawar → Islamabad" },
  { fromCity: "Islamabad", toCity: "Peshawar", label: "Islamabad → Peshawar" },
  { fromCity: "Mardan", toCity: "Islamabad", label: "Mardan → Islamabad" },
  { fromCity: "Swabi", toCity: "Islamabad", label: "Swabi → Islamabad" },
  { fromCity: "Abbottabad", toCity: "Rawalpindi", label: "Abbottabad → Rawalpindi" },
  { fromCity: "Islamabad", toCity: "Abbottabad", label: "Islamabad → Abbottabad" },
] as const;

/** Time-of-day windows used by search filters (24h ranges). */
export const TIME_WINDOWS = {
  morning: { label: "Morning", from: "05:00", to: "11:59" },
  afternoon: { label: "Afternoon", from: "12:00", to: "16:59" },
  evening: { label: "Evening", from: "17:00", to: "20:59" },
  night: { label: "Night", from: "21:00", to: "04:59" },
} as const;

export type TimeWindowKey = keyof typeof TIME_WINDOWS;

export const TIME_WINDOW_KEYS = Object.keys(TIME_WINDOWS) as TimeWindowKey[];

/** Build the default city pair for the home search (first two cities). */
export const DEFAULT_SEARCH_PAIR = {
  fromCity: CITIES[0]?.name ?? "Islamabad",
  toCity: CITIES[2]?.name ?? "Peshawar",
} as const;
