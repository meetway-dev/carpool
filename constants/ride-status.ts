export const RIDE_STATUSES = [
  "open",
  "almostFull",
  "full",
  "completed",
  "cancelled",
  "expired",
  "hidden",
] as const;

export type RideStatus = (typeof RIDE_STATUSES)[number];

export const RIDE_STATUS_VALUES = RIDE_STATUSES as unknown as [string, ...string[]];

interface RideStatusMeta {
  status: RideStatus;
  label: string;
  /** Tailwind token pair for badge styling. */
  badgeClass: string;
  /** Whether the ride should appear in public browse/search. */
  publiclyVisible: boolean;
}

export const RIDE_STATUS_META: Record<RideStatus, RideStatusMeta> = {
  open: {
    status: "open",
    label: "Open",
    badgeClass: "bg-success/15 text-success",
    publiclyVisible: true,
  },
  almostFull: {
    status: "almostFull",
    label: "Almost Full",
    badgeClass: "bg-warning/15 text-warning",
    publiclyVisible: true,
  },
  full: {
    status: "full",
    label: "Full",
    badgeClass: "bg-muted text-muted-foreground",
    publiclyVisible: true,
  },
  completed: {
    status: "completed",
    label: "Completed",
    badgeClass: "bg-muted text-muted-foreground",
    publiclyVisible: false,
  },
  cancelled: {
    status: "cancelled",
    label: "Cancelled",
    badgeClass: "bg-destructive/15 text-destructive",
    publiclyVisible: false,
  },
  expired: {
    status: "expired",
    label: "Expired",
    badgeClass: "bg-muted text-muted-foreground",
    publiclyVisible: false,
  },
  hidden: {
    status: "hidden",
    label: "Hidden",
    badgeClass: "bg-muted text-muted-foreground",
    publiclyVisible: false,
  },
};

/** Statuses that appear in public browse and search results. */
export const PUBLIC_RIDE_STATUSES = RIDE_STATUSES.filter(
  (status) => RIDE_STATUS_META[status].publiclyVisible,
);

/** Seats-left threshold at/below which an open ride becomes "almostFull". */
export const ALMOST_FULL_THRESHOLD = 2;

/** Derive the seat-based status for an active ride. */
export function deriveSeatStatus(seatsLeft: number): Extract<
  RideStatus,
  "open" | "almostFull" | "full"
> {
  if (seatsLeft <= 0) return "full";
  if (seatsLeft <= ALMOST_FULL_THRESHOLD) return "almostFull";
  return "open";
}
