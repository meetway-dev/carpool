import { Badge } from "@/components/ui/badge";
import { RIDE_STATUS_META, type RideStatus } from "@/constants/ride-status";
import { cn } from "@/lib/utils";

const VARIANT_BY_STATUS: Record<
  RideStatus,
  "success" | "warning" | "muted" | "destructive"
> = {
  open: "success",
  almostFull: "warning",
  full: "muted",
  completed: "muted",
  cancelled: "destructive",
  expired: "muted",
  hidden: "muted",
};

export function RideStatusBadge({
  status,
  className,
}: {
  status: RideStatus;
  className?: string;
}) {
  const meta = RIDE_STATUS_META[status];
  return (
    <Badge variant={VARIANT_BY_STATUS[status]} className={cn("text-[11px]", className)}>
      {meta.label}
    </Badge>
  );
}
