import Link from "next/link";
import {
  Car,
  MapPin,
  Clock,
  Users,
  BadgeCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RideStatusBadge } from "@/features/rides/components/ride-status-badge";
import { RideAmenities } from "@/features/rides/components/ride-amenities";
import { RideActions } from "@/features/rides/components/ride-actions";
import { ROUTES } from "@/constants/routes";
import { formatPrice, formatRideDate, formatTime, timeAgo, cn } from "@/lib/utils";
import type { RideDTO } from "@/types";

export function RideCard({ ride }: { ride: RideDTO }) {
  const seatsClass =
    ride.seatsLeft <= 0
      ? "text-muted-foreground"
      : ride.seatsLeft <= 2
        ? "text-warning font-semibold"
        : "text-success font-semibold";

  return (
    <Card
      className={cn(
        "card-interactive overflow-hidden shadow-soft",
        ride.featured && "ring-1 ring-primary/30",
      )}
    >
      {/* Featured accent bar */}
      {ride.featured ? (
        <div className="h-0.5 w-full bg-primary/50" />
      ) : null}

      <CardContent className="space-y-3.5 p-4">
        {/* Driver row */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={ROUTES.rideDetails(ride.id)}
            className="flex min-w-0 items-center gap-3"
          >
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-primary ring-2 ring-background">
              {ride.driver.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ride.driver.photoUrl}
                  alt={ride.driver.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Car className="h-5 w-5" />
              )}
              {ride.driver.verified ? (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-1 ring-background">
                  <BadgeCheck className="h-3 w-3" />
                </span>
              ) : null}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">
                {ride.driver.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {ride.vehicle.model} · {ride.vehicle.color} · {ride.vehicle.type}
              </p>
            </div>
          </Link>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {ride.featured ? (
              <Badge variant="default" className="gap-1 text-[10px]">
                <Sparkles className="h-2.5 w-2.5" /> Featured
              </Badge>
            ) : null}
            <RideStatusBadge status={ride.status} />
          </div>
        </div>

        {/* Route */}
        <Link
          href={ROUTES.rideDetails(ride.id)}
          className="flex items-center gap-2 rounded-xl bg-accent/50 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{ride.route.fromCity}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{ride.route.toCity}</span>
        </Link>

        {/* Time + seats */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatRideDate(ride.departure.date)}, {formatTime(ride.departure.time)}
          </span>
          <span className={cn("flex items-center gap-1.5", seatsClass)}>
            <Users className="h-4 w-4" />
            {ride.seatsLeft > 0 ? `${ride.seatsLeft} seat${ride.seatsLeft === 1 ? "" : "s"} left` : "Full"}
          </span>
        </div>

        <RideAmenities options={ride.options} max={4} />

        <Separator className="opacity-60" />

        {/* Price + time */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tabular-nums text-primary">
              {formatPrice(ride.pricePerSeat)}
            </span>
            <span className="text-xs text-muted-foreground">/ seat</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {timeAgo(ride.createdAt)}
          </span>
        </div>

        <RideActions ride={ride} variant="card" />
      </CardContent>
    </Card>
  );
}
