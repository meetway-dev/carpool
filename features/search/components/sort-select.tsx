"use client";

import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, DEFAULT_SORT } from "@/constants/sort";
import { useSearchQuery } from "@/features/search/hooks/use-search-query";

/** Sort dropdown that writes the chosen order to the URL. */
export function SortSelect() {
  const { get, setParams } = useSearchQuery();
  const current = get("sort") ?? DEFAULT_SORT;

  return (
    <Select
      value={current}
      onValueChange={(value) => setParams({ sort: value }, { resetPage: true })}
    >
      <SelectTrigger className="h-9 w-auto gap-1.5 border-none bg-transparent px-2 text-sm font-medium shadow-none focus:ring-0">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
