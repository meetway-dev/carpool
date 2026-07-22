import { AppHeader } from "@/components/layout/app-header";
import { CreateRideForm } from "@/features/rides/components/create-ride-form";

export const metadata = {
  title: "Post a ride",
  description: "Publish an intercity ride on RideConnect in a few taps.",
};

export default function CreateRidePage() {
  return (
    <main>
      <AppHeader title="Post a ride" />
      <div className="px-4 py-5">
        <CreateRideForm />
      </div>
    </main>
  );
}
