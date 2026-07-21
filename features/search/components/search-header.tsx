"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchForm } from "@/features/search/components/search-form";
import { SortSelect } from "@/features/search/components/sort-select";
import { FilterSheet } from "@/features/search/components/filter-sheet";
import { formatRideDate } from "@/lib/utils";

interface SearchHeaderProps {
  fromCity?: string;
  toCity?: string;
  date?: string;
  seats?: number;
}

/** Sticky results header: route summary, edit-search drawer, sort and filters. */
export function SearchHeader({ fromCity, toCity, date, seats }: SearchHeaderProps) {
  const router = useRouter();
  const [editOpen, seteditOpen] = useState(false);

  const routeLabel =
    fromCity && toCity ? (
      <span className="flex items-center gap-1.5 font-semibold">
        {fromCity} <ArrowRight className="h-4 w-4 text-muted-foreground" /> {toCity}
      </span>
    ) : (
      <span className="font-semibold">All rides</span>
    );

  return (
    <div className="glass sticky top-0 z-30">
      <div className="flex items-center gap-2 px-3 py-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </Button>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm">{routeLabel}</div>
          {date ? (
            <p className="truncate text-xs text-muted-foreground">
              {formatRideDate(date)}
              {seats ? ` • ${seats} ${seats === 1 ? "seat" : "seats"}` : ""}
            </p>
          ) : null}
        </div>

        <Sheet open={editOpen} onOpenChange={seteditOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="edit search">
              <Pencil className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="rounded-b-2xl">
            <SheetHeader className="px-0">
              <SheetTitle>edit search</SheetTitle>
            </SheetHeader>
            <div className="px-5 pb-6">
              <SearchForm
                defaultFromCity={fromCity}
                defaultToCity={toCity}
                defaultDate={date}
                defaultSeats={seats ?? 1}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center justify-between border-t px-3 py-1.5">
        <SortSelect />
        <FilterSheet />
      </div>
    </div>
  );
}
