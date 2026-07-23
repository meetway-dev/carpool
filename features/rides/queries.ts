import type { SearchParams } from "@/validators/search.schema";
import { getApi } from "@/lib/api-client";
import type { RideDTO, PaginatedResult } from "@/types";

/** Serialize search params into a query string for the rides API. */
export function serializeSearchParams(
  params: Partial<SearchParams> & { page?: number },
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query.set(key, String(value));
  }
  return query.toString();
}

/** Fetch one page of rides from the API. Throws on non-OK responses. */
export async function fetchRidesPage(
  params: Partial<SearchParams>,
  page: number,
  signal?: AbortSignal,
): Promise<PaginatedResult<RideDTO>> {
  const qs = serializeSearchParams({ ...params, page });
  return getApi<PaginatedResult<RideDTO>>(`/api/rides?${qs}`, signal);
}
