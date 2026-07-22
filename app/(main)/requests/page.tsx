import Link from "next/link";
import type { Metadata } from "next";
import { Plus, Inbox } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { RequestCard } from "@/features/requests/components/request-card";
import { listRideRequests } from "@/services/ride-request.service";
import { ROUTES } from "@/constants/routes";
import type { RideRequestDTO } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Passenger requests",
  description:
    "Passengers looking for rides across Pakistan. Drivers can offer a ride directly via WhatsApp or call.",
};

async function loadRequests(): Promise<RideRequestDTO[]> {
  try {
    const result = await listRideRequests({ pageSize: 30 });
    return result.items;
  } catch (error) {
    console.error("Failed to load ride requests:", error);
    return [];
  }
}

export default async function RequestsPage() {
  const requests = await loadRequests();

  return (
    <main>
      <AppHeader title="Passenger requests" />

      <div className="space-y-4 px-4 py-4">
        <div className="flex items-center justify-between gap-2 rounded-xl border bg-accent/40 p-3">
          <p className="text-xs text-muted-foreground">
            Need a ride? Post a request and let drivers come to you.
          </p>
          <Button asChild size="sm">
            <Link href={ROUTES.createRequest}>
              <Plus /> Post
            </Link>
          </Button>
        </div>

        {requests.length > 0 ? (
          <div className="space-y-3">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
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
      </div>
    </main>
  );
}
