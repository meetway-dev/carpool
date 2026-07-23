import { createSessionToken, hashPassword } from "@/lib/auth";
import { createEmailUser } from "@/services/user.service";
import { handleApiError } from "@/lib/api-error";
import { signupSchema } from "@/validators/user.schema";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fix the highlighted fields." , fieldErrors: parsed.error.flatten().fieldErrors},
        { status: 400 },
      );
    }

    const data = parsed.data;
    const passwordHash = hashPassword(data.password);
    const user = await createEmailUser({
      email: data.email,
      passwordHash,
      name: data.name,
      phone: data.phone,
    });

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
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
