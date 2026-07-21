import {
  Snowflake,
  Luggage,
  Cigarette,
  Music,
  PawPrint,
  Repeat,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RideDTO } from "@/types";

interface Amenity {
  key: keyof RideDTO["options"];
  label: string;
  icon: LucideIcon;
  /** Whether this amenity is a positive highlight (true) or a restriction. */
  positive: boolean;
}

const AMENITIES: Amenity[] = [
  { key: "ac", label: "AC", icon: Snowflake, positive: true },
  { key: "femaleOnly", label: "Female only", icon: UserRound, positive: true },
  { key: "luggage", label: "Luggage", icon: Luggage, positive: true },
  { key: "music", label: "Music", icon: Music, positive: true },
  { key: "pets", label: "Pets", icon: PawPrint, positive: true },
  { key: "returnTrip", label: "Return trip", icon: Repeat, positive: true },
  { key: "smoking", label: "Smoking", icon: Cigarette, positive: false },
];

/** Compact amenity chip row shown on ride cards and details. */
export function RideAmenities({
  options,
  className,
  max,
}: {
  options: RideDTO["options"];
  className?: string;
  max?: number;
}) {
  const active = AMENITIES.filter((a) => options[a.key]);
  const visible = max ? active.slice(0, max) : active;

  if (visible.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((amenity) => {
        const Icon = amenity.icon;
        return (
          <span
            key={amenity.key}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium",
              amenity.positive
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {amenity.label}
          </span>
        );
      })}
    </div>
  );
}
