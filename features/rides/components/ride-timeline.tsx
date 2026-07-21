import { MapPin, Flag, Circle } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface RideTimelineProps {
  fromCity: string;
  toCity: string;
  pickupPoint: string;
  dropPoint: string;
  departureTime: string;
  arrivalEstimate?: string;
}

/** Vertical pickup → destination timeline shown on the ride details page. */
export function RideTimeline({
  fromCity,
  toCity,
  pickupPoint,
  dropPoint,
  departureTime,
  arrivalEstimate,
}: RideTimelineProps) {
  return (
    <div className="relative pl-7">
      {/* connecting line */}
      <span
        aria-hidden
        className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-border"
      />

      <div className="relative space-y-6">
        <div className="relative">
          <span className="absolute -left-7 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Circle className="h-2.5 w-2.5 fill-current" />
          </span>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{fromCity}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {pickupPoint}
              </p>
            </div>
            <span className="whitespace-nowrap text-sm font-medium">
              {formatTime(departureTime)}
            </span>
          </div>
        </div>

        <div className="relative">
          <span className="absolute -left-7 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
            <Flag className="h-3 w-3" />
          </span>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{toCity}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {dropPoint}
              </p>
            </div>
            {arrivalEstimate ? (
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {arrivalEstimate}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
