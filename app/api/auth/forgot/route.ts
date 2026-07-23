import { clientEnv } from "@/config/env";
import { createPasswordResetToken } from "@/services/user.service";
import { handleApiError } from "@/lib/api-error";
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
      return NextResponse.json({ success: true });
    }

    const resetUrl = `${clientEnv.NEXT_PUBLIC_SITE_URL}/auth/reset/${token}`;

    console.info(`Password reset link for ${email}: ${resetUrl}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
