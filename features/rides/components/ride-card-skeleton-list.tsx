import { Skeleton } from "@/components/ui/skeleton";
import { RideCard } from "@/features/rides/components/ride-card";
import { RideCardSkeleton } from "@/features/rides/components/ride-card-skeleton";

export function RideCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <RideCardSkeleton key={i} />
      ))}
    </div>
  );
}
