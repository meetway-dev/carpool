"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CITIES } from "@/constants/cities";
import { useMemo, useState } from "react";

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
  const [query, setQuery] = useState("");

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CITIES.filter((city) => city.name !== exclude).filter((city) => {
      if (!q) return true;
      return city.name.toLowerCase().includes(q) || city.slug.toLowerCase().includes(q);
    });
  }, [query, exclude]);
  return (
    <Select value={value ?? ""} onValueChange={onChange}>
      <SelectTrigger aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="px-3 py-2">
          <Input
            placeholder="Search city"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <SelectSeparator />
        {options.map((city) => (
          <SelectItem key={city.slug} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
