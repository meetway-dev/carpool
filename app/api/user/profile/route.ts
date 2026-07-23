import { getAuthenticatedUser } from "@/lib/auth-server";
import { updateUserProfile } from "@/services/user.service";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, phone, vehicle } = body as any;

    const updated = await updateUserProfile(String((user as any)._id ?? (user as any).id), {
      name,
      phone,
      vehicle,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
