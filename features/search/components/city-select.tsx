"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITIES } from "@/constants/cities";

interface CitySelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** City name to exclude from options (e.g. the already-picked origin). */
  exclude?: string;
  ariaLabel?: string;
}

/** Reusable city picker backed by the CITIES constant. */
export function CitySelect({
  value,
  onChange,
  placeholder = "Select city",
  exclude,
  ariaLabel,
}: CitySelectProps) {
  return (
    <Select value={value ?? ""} onValueChange={onChange}>
      <SelectTrigger aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {CITIES.filter((city) => city.name !== exclude).map((city) => (
          <SelectItem key={city.slug} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
