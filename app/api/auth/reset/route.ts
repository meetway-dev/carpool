import { hashPassword } from "@/lib/auth";
import { findUserByResetToken, setPasswordForUser } from "@/services/user.service";
import { resetPasswordSchema } from "@/validators/user.schema";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { token, password } = parsed.data;
    const user = await findUserByResetToken(token);
    if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    const passwordHash = hashPassword(password);
    // user._id may not be typed on lean() result, cast defensively
    const userId = String((user as any)._id ?? (user as any).id ?? (user as any).userId);
    await setPasswordForUser(userId, passwordHash);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/auth/reset failed:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
