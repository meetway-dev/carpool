export const SORT_OPTIONS = [
  { value: "priceAsc", label: "Lowest Price" },
  { value: "priceDesc", label: "Highest Price" },
  { value: "departureAsc", label: "Earliest Departure" },
  { value: "departureDesc", label: "Latest Departure" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "mostSeats", label: "Most Seats" },
  { value: "bestRated", label: "Best Rated" },
  { value: "closest", label: "Closest Departure" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const SORT_VALUES = SORT_OPTIONS.map((option) => option.value) as [
  SortOption,
  ...SortOption[],
];

export const DEFAULT_SORT: SortOption = "closest";

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;
