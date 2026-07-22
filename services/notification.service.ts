import { connectToDatabase } from "@/lib/db/connect";
import { Notification } from "@/models/notification.model";

export interface NotificationDTO {
  id: string;
  type: string;
  title: string;
  body: string;
  meta?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

function mapNotification(doc: Record<string, unknown>): NotificationDTO {
  const createdAt = doc.createdAt as Date | string | undefined;
  return {
    id: String(doc._id),
    type: String(doc.type ?? ""),
    title: String(doc.title ?? ""),
    body: String(doc.body ?? ""),
    meta: doc.meta as Record<string, unknown> | undefined,
    read: Boolean(doc.read),
    createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function getNotifications(
  ownerKey: string,
  limit = 30,
): Promise<NotificationDTO[]> {
  await connectToDatabase();
  const docs = await Notification.find({ ownerKey })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();
  return docs.map((d) => mapNotification(d as Record<string, unknown>));
}

export async function getUnreadCount(ownerKey: string): Promise<number> {
  await connectToDatabase();
  return Notification.countDocuments({ ownerKey, read: false }).exec();
}

export async function createNotification(
  ownerKey: string,
  type: string,
  title: string,
  body: string,
  meta?: Record<string, unknown>,
): Promise<void> {
  await connectToDatabase();
  await Notification.create({ ownerKey, type, title, body, meta, read: false });
}
