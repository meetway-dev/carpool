"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, Wind, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useSearchQuery } from "@/features/search/hooks/use-search-query";

const PRICE_MIN = 0;
const PRICE_MAX = 5000;

export function FilterSheet() {
  const { get, setParams, clearFilters, searchParams } = useSearchQuery();
  const [open, setOpen] = useState(false);

  const [timeWindow, setTimeWindow] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [driverName, setDriverName] = useState("");
  const [phone, setPhone] = useState("");
  const [keyword, setKeyword] = useState("");
  const [ac, setAc] = useState(false);
  const [femaleOnly, setFemaleOnly] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTimeWindow(get("timeWindow") ?? "");
    setVehicleType(get("vehicleType") ?? "");
    setStatus(get("status") ?? "");
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
        status: status || undefined,
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
            <Badge variant="default" className="ml-0.5 h-5 rounded-full px-1.5 py-0 text-[11px]">
              {activeCount}
            </Badge>
          ) : null}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl">
        <div className="mx-auto mb-2 mt-2 h-1 w-10 rounded-full bg-muted-foreground/30" />

        <SheetHeader className="px-4 pb-3">
          <SheetTitle className="text-base">Filters</SheetTitle>
          <SheetDescription className="text-xs">Refine your ride search.</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ride type</p>
            <div className="space-y-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select
                  value={status || "active"}
                  onValueChange={(v) => setStatus(v === "active" ? "" : v)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Active" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="almostFull">Almost full</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Vehicle type</Label>
                <Select
                  value={vehicleType || "any"}
                  onValueChange={(v) => setVehicleType(v === "any" ? "" : v)}
                >
                  <SelectTrigger className="h-10">
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
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preferences</p>
            <div className="space-y-3">
              <ToggleRow icon={Wind} label="Air conditioning" checked={ac} onChange={setAc} />
              <ToggleRow
                icon={UserCheck}
                label="Female friendly"
                checked={femaleOnly}
                onChange={setFemaleOnly}
              />
              <ToggleRow
                icon={ShieldCheck}
                label="Verified drivers only"
                checked={verified}
                onChange={setVerified}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search</p>
            <div className="space-y-2.5">
              <div className="space-y-1.5">
                <Label htmlFor="filter-driver" className="text-xs">Driver name</Label>
                <Input
                  id="filter-driver"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Bilal"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="filter-phone" className="text-xs">Phone number</Label>
                <Input
                  id="filter-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0300..."
                  inputMode="tel"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="filter-keyword" className="text-xs">Keyword</Label>
                <Input
                  id="filter-keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Pickup point, notes…"
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="sticky bottom-0 border-t bg-background/95 backdrop-blur-sm px-4 py-3 pb-safe">
          <Button variant="outline" onClick={reset} className="flex-1">
            Reset all
          </Button>
          <SheetClose asChild>
            <Button onClick={apply} className="flex-1">
              Show results
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg px-1 py-1">
      <span className="flex items-center gap-2.5 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

const FILTER_KEYS = [
  "timeWindow",
  "vehicleType",
  "status",
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
