import { NextResponse, type NextRequest } from "next/server";
import { getNotifications } from "@/services/notification.service";
import { handleApiError } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ownerKey = request.nextUrl.searchParams.get("ownerKey");
  if (!ownerKey) {
    return NextResponse.json({ error: "ownerKey required" }, { status: 400 });
  }
  try {
    const notifications = await getNotifications(ownerKey);
    return NextResponse.json(notifications);
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
