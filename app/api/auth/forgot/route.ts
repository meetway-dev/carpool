import { clientEnv } from "@/config/env";
import { createPasswordResetToken } from "@/services/user.service";
import { forgotPasswordSchema } from "@/validators/user.schema";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email } = parsed.data;
    const token = await createPasswordResetToken(email);
    if (!token) {
      // Do not reveal account existence
      return NextResponse.json({ success: true });
    }

    const resetUrl = `${clientEnv.NEXT_PUBLIC_SITE_URL}/auth/reset/${token}`;

    // Send email using provider — currently no mailer configured. Log URL for development.
    console.info(`Password reset link for ${email}: ${resetUrl}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/auth/forgot failed:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
