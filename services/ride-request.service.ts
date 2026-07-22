import type { FilterQuery } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { RideRequest, type RideRequestDocument } from "@/models/ride-request.model";
import { mapRideRequestToDTO } from "@/features/requests/mappers";
import type { RideRequestDTO, PaginatedResult } from "@/types";

interface ListRequestsParams {
  fromCity?: string;
  toCity?: string;
  page?: number;
  pageSize?: number;
}

/** List open passenger ride requests, newest first, paginated. */
export async function listRideRequests(
  params: ListRequestsParams = {},
): Promise<PaginatedResult<RideRequestDTO>> {
  await connectToDatabase();

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 12;
  const skip = (page - 1) * pageSize;

  const filter: FilterQuery<RideRequestDocument> = { status: "open" };
  if (params.fromCity) filter.fromCity = params.fromCity;
  if (params.toCity) filter.toCity = params.toCity;

  const [docs, total] = await Promise.all([
    RideRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean().exec(),
    RideRequest.countDocuments(filter).exec(),
  ]);

  return {
    items: docs.map((doc) => mapRideRequestToDTO(doc as Record<string, unknown>)),
    page,
    pageSize,
    total,
    hasMore: skip + docs.length < total,
  };
}
