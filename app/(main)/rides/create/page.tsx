import Link from "next/link";
import { Plus, Construction } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export const metadata = { title: "Post a ride" };

/** Placeholder — the full multi-step create form ships in Phase 4. */
export default function CreateRidePage() {
  return (
    <main>
      <AppHeader title="Post a ride" />
      <div className="px-4 py-6">
        <EmptyState
          icon={Construction}
          title="Create ride form coming next"
          description="The full posting experience with duplicate detection and validation arrives in Phase 4."
          action={
            <Button asChild variant="outline">
              <Link href={ROUTES.rides}>
                <Plus /> Browse rides for now
              </Link>
            </Button>
          }
        />
      </div>
    </main>
  );
}
