import Link from "next/link";
import type { Metadata } from "next";
import { Plus, Inbox, MapPin, ArrowRight, Calendar } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { RequestCard } from "@/features/requests/components/request-card";
import { listRideRequests } from "@/services/ride-request.service";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { connectToDatabase } from "@/lib/db/connect";
import { RideRequest } from "@/models/ride-request.model";
import { ROUTES } from "@/constants/routes";
import type { RideRequestDTO } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Passenger requests",
  description:
    "Passengers looking for rides across Pakistan. Drivers can offer a ride directly via WhatsApp or call.",
};

async function loadPublicRequests(): Promise<RideRequestDTO[]> {
  try {
    const result = await listRideRequests({ pageSize: 30 });
    return result.items;
  } catch (error) {
    console.error("Failed to load ride requests:", error);
    return [];
  }
}

async function loadMyRequests(phone: string) {
  await connectToDatabase();
  const docs = await RideRequest.find({
    "passenger.phone": phone,
    status: { $nin: ["expired", "cancelled", "fulfilled"] },
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return docs.map((req) => ({
    id: String(req._id),
    fromCity: req.fromCity,
    toCity: req.toCity,
    date: req.date,
    seats: req.seats,
    budget: req.budget,
    notes: req.notes,
    status: req.status,
    createdAt: req.createdAt?.toISOString?.() ?? new Date().toISOString(),
  })) as RideRequestDTO[];
}

function RequestRow({ request }: { request: RideRequestDTO }) {
  return (
    <Card className="card-interactive">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {request.fromCity}
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            {request.toCity}
          </div>
          <Badge variant="default">{request.status}</Badge>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {request.date}
          </span>
          <span>{request.seats} seat{request.seats === 1 ? "" : "s"}</span>
          {request.budget ? (
            <span className="font-medium text-foreground">Rs {request.budget}</span>
          ) : null}
        </div>
        {request.notes ? (
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{request.notes}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default async function RequestsPage() {
  const user = await getAuthenticatedUser();
  const hasUser = Boolean(user?.phone);
  const publicRequests = await loadPublicRequests();
  const myRequests = hasUser && user?.phone ? await loadMyRequests(user.phone) : [];

  return (
    <main className="animate-fade-in">
      <AppHeader title="Requests" />

      <div className="px-4 py-4">
        <Tabs defaultValue={hasUser ? "my" : "public"} className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="my" className="flex-1">
              My requests
            </TabsTrigger>
            <TabsTrigger value="public" className="flex-1">
              Public
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="space-y-3">
            {myRequests.length > 0 ? (
              myRequests.map((request) => (
                <RequestRow key={request.id} request={request} />
              ))
            ) : hasUser ? (
              <EmptyState
                icon={Inbox}
                title="No active requests"
                description="You haven&apos;t posted any ride requests yet."
                action={
                  <Button asChild>
                    <Link href={ROUTES.createRequest}>
                      <Plus /> Post a request
                    </Link>
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={Inbox}
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

          <TabsContent value="public" className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-accent/40 p-4">
              <p className="text-xs text-muted-foreground">
                Need a ride? Post a request and let drivers come to you.
              </p>
              <Button asChild size="sm">
                <Link href={ROUTES.createRequest}>
                  <Plus /> Post
                </Link>
              </Button>
            </div>

            {publicRequests.length > 0 ? (
              publicRequests.map((request) => (
                <RequestRow key={request.id} request={request} />
              ))
            ) : (
              <EmptyState
                icon={Inbox}
                title="No requests yet"
                description="Be the first to post a ride request and drivers will reach out."
                action={
                  <Button asChild>
                    <Link href={ROUTES.createRequest}>
                      <Plus /> Post a request
                    </Link>
                  </Button>
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
