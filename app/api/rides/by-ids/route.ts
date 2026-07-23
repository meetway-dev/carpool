import { NextResponse, type NextRequest } from "next/server";
import { getRidesByIds } from "@/services/ride.service";
import { handleApiError } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.getAll("ids");
  if (!ids.length) return NextResponse.json([]);
  try {
    const rides = await getRidesByIds(ids.slice(0, 50));
    return NextResponse.json(rides);
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
