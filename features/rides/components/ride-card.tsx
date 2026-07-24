import Link from "next/link";
import {
  Car,
  MapPin,
  Clock,
  Users,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="card-interactive overflow-hidden">
      {ride.featured ? (
        <div className="h-0.5 w-full bg-primary/60" />
      ) : null}

      <CardContent className="space-y-2.5 p-3.5">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={ROUTES.rideDetails(ride.id)}
            className="flex min-w-0 items-center gap-3"
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-1 ring-border">
              {ride.driver.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ride.driver.photoUrl}
                  alt={ride.driver.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Car className="h-3.5 w-3.5" />
              )}
              {ride.driver.verified ? (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-primary-foreground ring-[1.5px] ring-background">
                  <BadgeCheck className="h-2 w-2" />
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
            <RideStatusBadge status={ride.status} />
          </div>
        </div>

        <Link
          href={ROUTES.rideDetails(ride.id)}
          className="flex items-center gap-2 rounded-lg bg-accent/60 px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate">{ride.route.fromCity}</span>
          <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="truncate">{ride.route.toCity}</span>
        </Link>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {formatRideDate(ride.departure.date)}, {formatTime(ride.departure.time)}
          </span>
          <span className={cn("flex items-center gap-1.5", seatsClass)}>
            <Users className="h-3.5 w-3.5" />
            {ride.seatsLeft > 0 ? `${ride.seatsLeft}/${ride.seatsTotal} seats` : "Full"}
          </span>
        </div>

        <RideAmenities options={ride.options} max={4} />

        <Separator className="opacity-80" />

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tabular-nums text-foreground">
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
