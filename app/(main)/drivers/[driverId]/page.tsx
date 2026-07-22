import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Car,
  BadgeCheck,
  Star,
  MapPin,
  Languages,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RideCard } from "@/features/rides/components/ride-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { SaveDriverButton } from "@/features/drivers/components/save-driver-button";
import { getDriverById } from "@/services/driver.service";
import { getRidesByDriver } from "@/services/ride.service";
import { ROUTES } from "@/constants/routes";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ driverId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { driverId } = await params;
  const driver = await getDriverById(driverId);
  if (!driver) return { title: "Driver not found" };
  return {
    title: `${driver.name} — Driver profile`,
    description: `${driver.completedTrips} trips completed. ${driver.vehicle ? `Drives a ${driver.vehicle.model}.` : ""} Find rides with ${driver.name} on RideConnect.`,
  };
}

export default async function DriverProfilePage({ params }: PageProps) {
  const { driverId } = await params;
  const [driver, rides] = await Promise.all([
    getDriverById(driverId),
    getRidesByDriver(driverId),
  ]);

  if (!driver) notFound();

  return (
    <main className="pb-8">
      <header className="glass sticky top-0 z-30 flex items-center gap-2 px-3 py-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back">
          <Link href={ROUTES.rides}>
            <ArrowLeft />
          </Link>
        </Button>
        <span className="text-sm font-semibold">Driver profile</span>
      </header>

      <div className="space-y-4 px-4 py-4">
        {/* Profile card */}
        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                {driver.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={driver.photoUrl}
                    alt={driver.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <Car className="h-7 w-7" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-bold">{driver.name}</h1>
                  {driver.verified ? (
                    <BadgeCheck className="h-5 w-5 text-primary" />
                  ) : null}
                </div>
                {driver.homeCity ? (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {driver.homeCity}
                  </p>
                ) : null}
                <div className="mt-1 flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    {driver.rating > 0 ? driver.rating.toFixed(1) : "New"}
                    {driver.ratingCount > 0 ? (
                      <span className="text-xs text-muted-foreground">
                        ({driver.ratingCount})
                      </span>
                    ) : null}
                  </span>
                  <span className="text-muted-foreground">
                    {driver.completedTrips} trips
                  </span>
                </div>
              </div>
              <SaveDriverButton driverId={driver.id} />
            </div>

            {driver.bio ? (
              <p className="text-sm text-muted-foreground">{driver.bio}</p>
            ) : null}

            {driver.languages.length > 0 ? (
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-wrap gap-1.5">
                  {driver.languages.map((lang) => (
                    <Badge key={lang} variant="secondary">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Vehicle */}
        {driver.vehicle ? (
          <Card>
            <CardContent className="space-y-2 p-4">
              <p className="text-sm font-semibold">Vehicle</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <VehicleRow label="Model" value={driver.vehicle.model} />
                <VehicleRow label="Type" value={driver.vehicle.type} />
                <VehicleRow label="Color" value={driver.vehicle.color} />
                {driver.vehicle.number ? (
                  <VehicleRow label="Number" value={driver.vehicle.number} />
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Separator />

        {/* Active rides */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">
            Upcoming rides ({rides.length})
          </h2>
          {rides.length > 0 ? (
            rides.map((ride) => <RideCard key={ride.id} ride={ride} />)
          ) : (
            <EmptyState
              icon={Car}
              title="No upcoming rides"
              description="This driver has no active rides right now."
            />
          )}
        </div>
      </div>
    </main>
  );
}

function VehicleRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
