import { NextResponse } from "next/server";
import { expireStaleRecords } from "@/features/rides/actions/expire-rides";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await expireStaleRecords();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Cron expire failed:", error);
    return NextResponse.json({ error: "Expiry job failed" }, { status: 500 });
  }
}
