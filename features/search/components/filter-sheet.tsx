"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VEHICLE_TYPES } from "@/constants/vehicle-types";
import { TIME_WINDOWS, TIME_WINDOW_KEYS } from "@/constants/routes";
import { formatPrice } from "@/lib/utils";
import { useSearchQuery } from "@/features/search/hooks/use-search-query";

const PRICE_MIN = 0;
const PRICE_MAX = 5000;
const PRICE_STEP = 100;

/** Advanced filter drawer. Applies all filters to the URL on submit. */
export function FilterSheet() {
  const { get, setParams, clearFilters, searchParams } = useSearchQuery();
  const [open, setOpen] = useState(false);

  const [timeWindow, setTimeWindow] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [driverName, setDriverName] = useState("");
  const [phone, setPhone] = useState("");
  const [keyword, setKeyword] = useState("");
  const [ac, setAc] = useState(false);
  const [femaleOnly, setFemaleOnly] = useState(false);
  const [verified, setVerified] = useState(false);

  // Hydrate local state from the URL whenever the sheet opens.
  useEffect(() => {
    if (!open) return;
    setTimeWindow(get("timeWindow") ?? "");
    setVehicleType(get("vehicleType") ?? "");
    setPriceRange([
      Number(get("minPrice") ?? PRICE_MIN),
      Number(get("maxPrice") ?? PRICE_MAX),
    ]);
    setDriverName(get("driverName") ?? "");
    setPhone(get("phone") ?? "");
    setKeyword(get("keyword") ?? "");
    setAc(get("ac") === "true");
    setFemaleOnly(get("femaleOnly") === "true");
    setVerified(get("verified") === "true");
  }, [open, get]);

  const activeCount = countActiveFilters(searchParams);

  function apply() {
    setParams(
      {
        timeWindow: timeWindow || undefined,
        vehicleType: vehicleType || undefined,
        minPrice: priceRange[0] > PRICE_MIN ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < PRICE_MAX ? priceRange[1] : undefined,
        driverName: driverName.trim() || undefined,
        phone: phone.trim() || undefined,
        keyword: keyword.trim() || undefined,
        ac: ac || undefined,
        femaleOnly: femaleOnly || undefined,
        verified: verified || undefined,
      },
      { resetPage: true },
    );
    setOpen(false);
  }

  function reset() {
    clearFilters();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 ? (
            <Badge variant="default" className="ml-0.5 px-1.5 py-0">
              {activeCount}
            </Badge>
          ) : null}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto">
        <SheetHeader className="px-0">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine your ride search.</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-5 pb-4">
          {/* Time of day */}
          <div className="space-y-2">
            <Label>Departure time</Label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_WINDOW_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTimeWindow(timeWindow === key ? "" : key)}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                    timeWindow === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "hover:bg-accent"
                  }`}
                >
                  {TIME_WINDOWS[key].label}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Price per seat</Label>
              <span className="text-sm text-muted-foreground">
                {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                {priceRange[1] >= PRICE_MAX ? "+" : ""}
              </span>
            </div>
            <Slider
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={priceRange}
              onValueChange={(v) => setPriceRange([v[0] ?? PRICE_MIN, v[1] ?? PRICE_MAX])}
            />
          </div>

          {/* Vehicle type */}
          <div className="space-y-2">
            <Label>Vehicle type</Label>
            <Select
              value={vehicleType || "any"}
              onValueChange={(v) => setVehicleType(v === "any" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any vehicle</SelectItem>
                {VEHICLE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Toggles */}
          <div className="space-y-3">
            <ToggleRow label="Air conditioning" checked={ac} onChange={setAc} />
            <ToggleRow
              label="Female friendly"
              checked={femaleOnly}
              onChange={setFemaleOnly}
            />
            <ToggleRow
              label="Verified drivers only"
              checked={verified}
              onChange={setVerified}
            />
          </div>

          <Separator />

          {/* Text filters */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="filter-driver">Driver name</Label>
              <Input
                id="filter-driver"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g. Bilal"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-phone">Phone number</Label>
              <Input
                id="filter-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0300..."
                inputMode="tel"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-keyword">Keyword</Label>
              <Input
                id="filter-keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Pickup point, notes…"
              />
            </div>
          </div>
        </div>

        <SheetFooter className="sticky bottom-0 border-t bg-background">
          <Button variant="ghost" onClick={reset} className="sm:flex-1">
            Reset
          </Button>
          <SheetClose asChild>
            <Button onClick={apply} className="sm:flex-1">
              Show results
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

const FILTER_KEYS = [
  "timeWindow",
  "vehicleType",
  "minPrice",
  "maxPrice",
  "driverName",
  "phone",
  "keyword",
  "ac",
  "femaleOnly",
  "verified",
];

function countActiveFilters(searchParams: URLSearchParams): number {
  return FILTER_KEYS.filter((key) => searchParams.get(key)).length;
}
