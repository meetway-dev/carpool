import { createSessionToken, verifyPassword } from "@/lib/auth";
import { findUserByEmail } from "@/services/user.service";
import { loginSchema } from "@/validators/user.schema";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fix the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const user = await findUserByEmail(data.email);
    if (!user || !user.passwordHash || !verifyPassword(data.password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const userId = String((user as any)._id ?? (user as any).id);
    const token = createSessionToken(userId);

    const cookieStore = await cookies();
    cookieStore.set("rc_session", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);
    return NextResponse.json(
      { error: "Could not login. Please try again." },
      { status: 500 },
    );
  }
}
