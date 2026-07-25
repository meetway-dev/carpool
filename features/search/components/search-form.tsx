"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DEFAULT_SEARCH_PAIR, ROUTES } from "@/constants/routes";
import { serializeSearchParams } from "@/features/rides/queries";
import { CitySelect } from "@/features/search/components/city-select";
import { ArrowRightLeft, Calendar, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface SearchFormProps {
  defaultFromCity?: string;
  defaultToCity?: string;
  defaultDate?: string;
  defaultSeats?: number;
  compact?: boolean;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function SearchForm({
  defaultFromCity = DEFAULT_SEARCH_PAIR.fromCity,
  defaultToCity = DEFAULT_SEARCH_PAIR.toCity,
  defaultDate,
  defaultSeats = 1,
  compact = false,
}: SearchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fromCity, setFromCity] = useState(defaultFromCity);
  const [toCity, setToCity] = useState(defaultToCity);
  const [date, setDate] = useState(defaultDate ?? "");
  const [seats, setSeats] = useState(String(defaultSeats));

  function swap() {
    setFromCity(toCity);
    setToCity(fromCity);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const qs = serializeSearchParams({
      fromCity: fromCity || undefined,
      toCity: toCity || undefined,
      date: date || undefined,
      seats: Number(seats) || undefined,
    });
    startTransition(() => {
      router.push(`${ROUTES.rides}?${qs}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
        <div className="space-y-1.5">
          {!compact ? <Label className="text-[11px] font-medium text-muted-foreground">From</Label> : null}
          <CitySelect
            value={fromCity}
            onChange={setFromCity}
            exclude={toCity}
            placeholder="From"
            ariaLabel="From city"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="mb-0.5 h-9 w-9 shrink-0 rounded-full"
          onClick={swap}
          aria-label="Swap cities"
        >
          <ArrowRightLeft className="h-3.5 w-3.5" />
        </Button>
        <div className="space-y-1.5">
          {!compact ? <Label className="text-[11px] font-medium text-muted-foreground">To</Label> : null}
          <CitySelect
            value={toCity}
            onChange={setToCity}
            exclude={fromCity}
            placeholder="To"
            ariaLabel="To city"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 pl-9"
            aria-label="Departure date"
          />
        </div>
        <Select value={seats} onValueChange={setSeats}>
          <SelectTrigger aria-label="Seats required" className="h-10">
            <Users className="mr-1.5 h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} {n === 1 ? "seat" : "seats"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        size="lg"
        loading={isPending}
        className="w-full text-sm font-semibold"
      >
        <Search className="h-4 w-4" /> Search rides
      </Button>
    </form>
  );
}
