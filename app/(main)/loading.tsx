import { RideCardSkeletonList } from "@/features/rides/components/ride-card-skeleton";
import { AppHeader } from "@/components/layout/app-header";

export default function MainLoading() {
  return (
    <div className="animate-fade-in">
      <AppHeader />
      <div className="px-4 py-4">
        <RideCardSkeletonList count={4} />
      </div>
    </div>
  );
}
