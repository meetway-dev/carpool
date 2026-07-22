"use server";

import { connectToDatabase } from "@/lib/db/connect";
import { Notification } from "@/models/notification.model";
import type { ActionResult } from "@/types";

export async function markNotificationsRead(
  ownerKey: string,
  ids?: string[],
): Promise<ActionResult> {
  try {
    await connectToDatabase();
    const filter: Record<string, unknown> = { ownerKey, read: false };
    if (ids?.length) filter._id = { $in: ids };
    await Notification.updateMany(filter, { $set: { read: true } });
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to mark notifications read." };
  }
}
