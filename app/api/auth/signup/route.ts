import { createSessionToken, getSessionCookieValue, hashPassword } from "@/lib/auth";
import { createEmailUser } from "@/services/user.service";
import { signupSchema } from "@/validators/user.schema";
import { NextResponse, type NextRequest } from "next/server";

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
    return NextResponse.json(
      { success: true },
      { headers: { "Set-Cookie": getSessionCookieValue(token) } },
    );
  } catch (error) {
    console.error("POST /api/auth/signup failed:", error);
    return NextResponse.json(
      { error: "Could not create account. Please try again." },
      { status: 500 },
    );
  }
}
