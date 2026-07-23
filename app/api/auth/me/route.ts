import { getAuthenticatedUser } from "@/lib/auth-server";
import { handleApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json(null);

    return NextResponse.json({
      id: (user as any)._id ?? (user as any).id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      provider: user.provider,
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
