import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ROUTES } from "@/constants/routes";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("rc_session");
  return NextResponse.redirect(new URL(ROUTES.auth.login, request.url));
}
