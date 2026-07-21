import Link from "next/link";
import { Car, MapPin, Clock, Users, BadgeCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RideStatusBadge } from "@/features/rides/components/ride-status-badge";
import { RideAmenities } from "@/features/rides/components/ride-amenities";
import { RideActions } from "@/features/rides/components/ride-actions";
import { ROUTES } from "@/constants/routes";
import { formatPrice, formatRideDate, formatTime, timeAgo, cn } from "@/lib/utils";
import type { RideDTO } from "@/types";

/** Primary ride listing card used across home, search results and related lists. */
export function RideCard({ ride }: { ride: RideDTO }) {
  const seatsClass =
    ride.seatsLeft <= 0
      ? "text-muted-foreground"
      : ride.seatsLeft <= 2
        ? "text-warning"
        : "text-success";

  return (
    <Card className={cn("overflow-hidden", ride.featured && "ring-1 ring-primary/40")}>
      <CardContent className="space-y-3 p-4">
        {/* Header: driver + status */}
        <div className="flex items-start justify-between gap-2">
          <Link href={ROUTES.rideDetails(ride.id)} className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
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
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="truncate text-sm font-semibold">
                  {ride.driver.name}
                </span>
                {ride.driver.verified ? (
                  <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                ) : null}
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {ride.vehicle.model} • {ride.vehicle.color} • {ride.vehicle.type}
              </p>
            </div>
          </Link>
          <div className="flex flex-col items-end gap-1">
            {ride.featured ? <Badge variant="default">Featured</Badge> : null}
            <RideStatusBadge status={ride.status} />
          </div>
        </div>

        {/* Route */}
        <Link
          href={ROUTES.rideDetails(ride.id)}
          className="flex items-center gap-2 text-sm font-medium"
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
          <span className={cn("flex items-center gap-1.5 font-medium", seatsClass)}>
            <Users className="h-4 w-4" />
            {ride.seatsLeft > 0 ? `${ride.seatsLeft} left` : "Full"}
          </span>
        </div>

        <RideAmenities options={ride.options} max={4} />

        <Separator />

        {/* Price + posted time */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">{formatPrice(ride.pricePerSeat)}</span>
            <span className="text-xs text-muted-foreground"> / seat</span>
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
