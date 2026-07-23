import type { CreateRideInput } from "@/validators/ride.schema";
import {
    Cigarette,
    Music,
    Snowflake,
    UserRound,
    type LucideIcon,
} from "lucide-react";

export interface RideOptionConfig {
  key: keyof CreateRideInput["options"];
  label: string;
  description: string;
  icon: LucideIcon;
}

/** Toggle definitions rendered in the create-ride options step. */
export const RIDE_OPTION_CONFIG: RideOptionConfig[] = [
  { key: "ac", label: "Air conditioning", description: "Cabin stays cool", icon: Snowflake },
  { key: "femaleOnly", label: "Female only", description: "Female passengers only", icon: UserRound },
  { key: "music", label: "Music allowed", description: "Music during the trip", icon: Music },
  { key: "smoking", label: "Smoking allowed", description: "Smoking permitted", icon: Cigarette },
];
