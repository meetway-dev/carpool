import { AppHeader } from "@/components/layout/app-header";
import { RequestForm } from "@/features/requests/components/request-form";

export const metadata = {
  title: "Post a ride request",
  description: "Tell drivers where you need to go and let them offer you a ride.",
};

export default function CreateRequestPage() {
  return (
    <main>
      <AppHeader title="Need a ride" />
      <div className="space-y-4 px-4 py-5">
        <p className="text-sm text-muted-foreground">
          Post your trip details and available drivers will contact you directly.
        </p>
        <RequestForm />
      </div>
    </main>
  );
}
