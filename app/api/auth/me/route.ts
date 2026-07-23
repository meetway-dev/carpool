import { getAuthenticatedUser } from "@/lib/auth-server";
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
    console.error("GET /api/auth/me failed:", error);
    return NextResponse.json(null, { status: 500 });
  }
}
