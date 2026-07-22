import { NextResponse, type NextRequest } from "next/server";
import { getRidesByIds } from "@/services/ride.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.getAll("ids");
  if (!ids.length) return NextResponse.json([]);
  try {
    const rides = await getRidesByIds(ids.slice(0, 50));
    return NextResponse.json(rides);
  } catch {
    return NextResponse.json({ error: "Failed to load rides" }, { status: 500 });
  }
}
