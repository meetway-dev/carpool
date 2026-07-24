import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/constants/routes";
import { ProfileForm } from "@/features/profile/profile-form";
import { Heart, LogOut, Plus, ShieldCheck, User, Car } from "lucide-react";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { connectToDatabase } from "@/lib/db/connect";
import { Ride } from "@/models/ride.model";
import { RideRequest } from "@/models/ride-request.model";
import { RideCard } from "@/features/rides/components/ride-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { RideCardSkeleton } from "@/features/rides/components/ride-card-skeleton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Profile" };

const LINKS = [
  { href: ROUTES.createRide, label: "Post a ride", icon: Plus },
  { href: ROUTES.favorites, label: "Saved rides", icon: Heart },
];

async function getActiveRide(phone: string) {
  await connectToDatabase();
  return Ride.findOne({
    "driver.phone": phone,
    status: { $nin: ["expired", "cancelled", "completed"] },
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}

async function getActiveRequests(phone: string) {
  await connectToDatabase();
  return RideRequest.find({
    "passenger.phone": phone,
    status: { $nin: ["expired", "cancelled", "fulfilled"] },
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  const hasUser = Boolean(user);

  let activeRide: Awaited<ReturnType<typeof getActiveRide>> | null = null;
  let activeRequests: Awaited<ReturnType<typeof getActiveRequests>> = [];

  if (hasUser && user?.phone) {
    const [ride, requests] = await Promise.all([
      getActiveRide(user.phone),
      getActiveRequests(user.phone),
    ]);
    activeRide = ride;
    activeRequests = requests;
  }

  return (
    <main>
      <AppHeader title="Profile" />
      <div className="px-4 py-4">
        <Tabs defaultValue={activeRide ? "ride" : "requests"} className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="ride" className="flex-1">
              My ride
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              My requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ride" className="space-y-3">
            {activeRide ? (
              <div className="space-y-3">
                <RideCard ride={activeRide as any} />
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={ROUTES.rides}>Find rides</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href={ROUTES.createRide}>
                      <Car className="mr-2 h-4 w-4" /> Post another
                    </Link>
                  </Button>
                </div>
              </div>
            ) : hasUser ? (
              <EmptyState
                icon={Car}
                title="No active ride"
                description="You don&apos;t have an active ride right now. Post one when you travel."
                action={
                  <Button asChild>
                    <Link href={ROUTES.createRide}>
                      <Plus /> Post a ride
                    </Link>
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={User}
                title="Sign in to view your ride"
                description="Login to manage your active ride and requests."
                action={
                  <Button asChild>
                    <Link href={ROUTES.auth.login}>Login</Link>
                  </Button>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-3">
            {activeRequests.length > 0 ? (
              activeRequests.map((req) => (
                <Card key={String(req._id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {req.fromCity} → {req.toCity}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {req.date} • {req.seats} seat{req.seats === 1 ? "" : "s"}
                          {req.budget ? ` • Rs ${req.budget}` : ""}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-primary">
                        {req.status}
                      </span>
                    </div>
                    {req.notes ? (
                      <p className="mt-2 text-xs text-muted-foreground">{req.notes}</p>
                    ) : null}
                  </CardContent>
                </Card>
              ))
            ) : hasUser ? (
              <EmptyState
                icon={User}
                title="No active requests"
                description="You haven&apos;t posted any ride requests yet."
                action={
                  <Button asChild>
                    <Link href={ROUTES.requests}>
                      <Plus /> Post a request
                    </Link>
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={User}
                title="Sign in to view your requests"
                description="Login to see and manage your ride requests."
                action={
                  <Button asChild>
                    <Link href={ROUTES.auth.login}>Login</Link>
                  </Button>
                }
              />
            )}
          </TabsContent>
        </Tabs>

        {hasUser ? (
          <div className="mt-6 space-y-3">
            <ProfileForm />

            <div className="space-y-2">
              {LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.href}
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href={link.href}>
                      <Icon /> {link.label}
                    </Link>
                  </Button>
                );
              })}

              <Button asChild variant="destructive" className="w-full justify-start">
                <Link href={ROUTES.auth.logout}>
                  <LogOut /> Logout
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-accent/40 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
              Profile details are stored locally. Login to sync ride history and requests.
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
