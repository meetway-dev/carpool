"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api-error";
import { RideRequest } from "@/models/ride-request.model";
import { createRideRequestSchema } from "@/validators/ride-request.schema";
import { rateLimiters } from "@/lib/rate-limit";
import { computeExpiresAt } from "@/lib/ride-helpers";
import { ROUTES } from "@/constants/routes";
import type { ActionResult } from "@/types";

interface CreateRideRequestResult {
  requestId: string;
}

export async function createRideRequest(
  input: unknown,
  ownerKey: string,
): Promise<ActionResult<CreateRideRequestResult>> {
  const parsed = createRideRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  const headerList = await headers();
  const identifier =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? ownerKey ?? "anonymous";
  const limited = rateLimiters.createRequest(identifier);
  if (!limited.success) {
    return {
      success: false,
      error: "You've posted several requests recently. Please try again later.",
    };
  }

  try {
    await connectToDatabase();

    const expiresAt = computeExpiresAt(new Date(`${data.date}T23:59:00`));

    const created = await RideRequest.create({
      passenger: { name: data.passengerName, phone: data.phone },
      fromCity: data.fromCity,
      toCity: data.toCity,
      date: data.date,
      seats: data.seats,
      budget: data.budget,
      notes: data.notes || undefined,
      status: "open",
      ownerKey: ownerKey || undefined,
      expiresAt,
    });

    revalidatePath(ROUTES.requests);

    return { success: true, data: { requestId: String(created._id) } };
  } catch (error) {
    const { error: message } = handleApiError(error);
    return { success: false, error: message };
  }
}
