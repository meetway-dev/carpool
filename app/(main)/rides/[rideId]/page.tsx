import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Car,
  BadgeCheck,
  Users,
  Calendar,
  MapPin,
  ArrowLeft,
  Palette,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RideStatusBadge } from "@/features/rides/components/ride-status-badge";
import { RideAmenities } from "@/features/rides/components/ride-amenities";
import { RideActions } from "@/features/rides/components/ride-actions";
import { RideTimeline } from "@/features/rides/components/ride-timeline";
import { SafetyTips } from "@/features/rides/components/safety-tips";
import { RideCard } from "@/features/rides/components/ride-card";
import { getRideById, getRelatedRides } from "@/services/ride.service";
import { ROUTES } from "@/constants/routes";
import { formatPrice, formatRideDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ rideId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rideId } = await params;
  const ride = await getRideById(rideId);
  if (!ride) return { title: "Ride not found" };

  const title = `${ride.route.fromCity} → ${ride.route.toCity} • ${formatPrice(ride.pricePerSeat)}/seat`;
  return {
    title,
    description: `${ride.vehicle.model} ride from ${ride.route.fromCity} to ${ride.route.toCity} on ${formatRideDate(ride.departure.date)}. ${ride.seatsLeft} seats left.`,
    alternates: { canonical: `${siteConfig.url}${ROUTES.rideDetails(rideId)}` },
  };
}

export default async function RideDetailsPage({ params }: PageProps) {
  const { rideId } = await params;
  const ride = await getRideById(rideId);

  if (!ride) notFound();

  const related = await getRelatedRides(
    ride.route.fromCity,
    ride.route.toCity,
    ride.id,
    3,
  );

  return (
    <main className="pb-28">
      <header className="glass sticky top-0 z-30 flex items-center gap-2 px-3 py-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back to rides">
          <Link href={ROUTES.rides}>
            <ArrowLeft />
          </Link>
        </Button>
        <span className="text-sm font-semibold">Ride details</span>
        <div className="ml-auto">
          <RideStatusBadge status={ride.status} />
        </div>
      </header>

      <div className="space-y-4 px-4 py-4">
        {/* Driver */}
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              {ride.driver.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ride.driver.photoUrl}
                  alt={ride.driver.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Car className="h-6 w-6" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-semibold">{ride.driver.name}</p>
                {ride.driver.verified ? (
                  <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                {ride.driver.verified ? "Verified driver" : "Driver"}
              </p>
            </div>
            {ride.driver.driverId ? (
              <Button asChild variant="outline" size="sm">
                <Link href={ROUTES.driverProfile(ride.driver.driverId)}>Profile</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>

        {/* Trip summary */}
        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">
                  {formatPrice(ride.pricePerSeat)}
                </span>
                <span className="text-sm text-muted-foreground"> / seat</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {ride.seatsLeft}/{ride.seatsTotal}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatRideDate(ride.departure.date)}
            </div>

            <Separator />

            <RideTimeline
              fromCity={ride.route.fromCity}
              toCity={ride.route.toCity}
              pickupPoint={ride.route.pickupPoint}
              dropPoint={ride.route.dropPoint}
              departureTime={ride.departure.time}
              arrivalEstimate={ride.arrivalEstimate}
            />
          </CardContent>
        </Card>

        {/* Vehicle */}
        <Card>
          <CardContent className="space-y-3 p-4">
            <p className="text-sm font-semibold">Vehicle</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoRow icon={Car} label="Model" value={ride.vehicle.model} />
              <InfoRow icon={Hash} label="Type" value={ride.vehicle.type} />
              <InfoRow icon={Palette} label="Color" value={ride.vehicle.color} />
              {ride.vehicle.number ? (
                <InfoRow icon={Hash} label="Number" value={ride.vehicle.number} />
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardContent className="space-y-3 p-4">
            <p className="text-sm font-semibold">Ride rules &amp; amenities</p>
            <RideAmenities options={ride.options} />
            {ride.notes ? (
              <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                {ride.notes}
              </p>
            ) : null}
          </CardContent>
        </Card>

        {/* Map placeholder */}
        <Card>
          <CardContent className="p-4">
            <div className="flex h-32 flex-col items-center justify-center gap-1 rounded-xl bg-muted text-muted-foreground">
              <MapPin className="h-6 w-6" />
              <p className="text-xs">Map view coming soon</p>
            </div>
          </CardContent>
        </Card>

        <SafetyTips />

        {/* Related */}
        {related.length > 0 ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">
                More on {ride.route.fromCity} → {ride.route.toCity}
              </h2>
              <Badge variant="muted">{related.length}</Badge>
            </div>
            {related.map((r) => (
              <RideCard key={r.id} ride={r} />
            ))}
          </section>
        ) : null}
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg border-t bg-background/90 p-3 backdrop-blur-xl">
        <div className="space-y-2">
          <RideActions ride={ride} variant="detail" />
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Car;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
    </div>
  );
}
