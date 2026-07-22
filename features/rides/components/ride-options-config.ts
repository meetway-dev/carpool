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
import type { CreateRideInput } from "@/validators/ride.schema";

export interface RideOptionConfig {
  key: keyof CreateRideInput["options"];
  label: string;
  description: string;
  icon: LucideIcon;
}

/** Toggle definitions rendered in the create-ride options step. */
export const RIDE_OPTION_CONFIG: RideOptionConfig[] = [
  { key: "ac", label: "Air conditioning", description: "Cabin stays cool", icon: Snowflake },
  { key: "luggage", label: "Luggage allowed", description: "Space for bags", icon: Luggage },
  { key: "femaleOnly", label: "Female only", description: "Female passengers only", icon: UserRound },
  { key: "music", label: "Music allowed", description: "Music during the trip", icon: Music },
  { key: "pets", label: "Pets allowed", description: "Pets are welcome", icon: PawPrint },
  { key: "smoking", label: "Smoking allowed", description: "Smoking permitted", icon: Cigarette },
  { key: "returnTrip", label: "Return trip", description: "Offers a return leg", icon: Repeat },
];
