"use server";

import {
  toggleFavoriteRide,
  toggleFavoriteDriver,
  toggleFavoriteRoute,
} from "@/services/favorite.service";
import { handleApiError } from "@/lib/api-error";
import type { ActionResult } from "@/types";

interface ToggleResult {
  saved: boolean;
}

function assertOwner(ownerKey: string): ActionResult<ToggleResult> | null {
  if (!ownerKey || ownerKey.length < 4) {
    return { success: false, error: "Missing device identity." };
  }
  return null;
}

export async function toggleRideFavorite(
  ownerKey: string,
  rideId: string,
): Promise<ActionResult<ToggleResult>> {
  const bad = assertOwner(ownerKey);
  if (bad) return bad;
  try {
    const saved = await toggleFavoriteRide(ownerKey, rideId);
    return { success: true, data: { saved } };
  } catch (error) {
    const { error: message } = handleApiError(error);
    return { success: false, error: message };
  }
}

export async function toggleDriverFavorite(
  ownerKey: string,
  driverId: string,
): Promise<ActionResult<ToggleResult>> {
  const bad = assertOwner(ownerKey);
  if (bad) return bad;
  try {
    const saved = await toggleFavoriteDriver(ownerKey, driverId);
    return { success: true, data: { saved } };
  } catch (error) {
    const { error: message } = handleApiError(error);
    return { success: false, error: message };
  }
}

export async function toggleRouteFavorite(
  ownerKey: string,
  fromCity: string,
  toCity: string,
): Promise<ActionResult<ToggleResult>> {
  const bad = assertOwner(ownerKey);
  if (bad) return bad;
  try {
    const saved = await toggleFavoriteRoute(ownerKey, fromCity, toCity);
    return { success: true, data: { saved } };
  } catch (error) {
    const { error: message } = handleApiError(error);
    return { success: false, error: message };
  }
}
