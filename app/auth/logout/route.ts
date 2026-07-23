import { clearSessionCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true }, {
    headers: { "Set-Cookie": clearSessionCookie() },
  });
}
