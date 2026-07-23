import { NextResponse, type NextRequest } from "next/server";
import { getFavoritesByOwner } from "@/services/favorite.service";
import { handleApiError } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ownerKey = request.nextUrl.searchParams.get("ownerKey");
  if (!ownerKey) {
    return NextResponse.json({ rides: [], drivers: [], routes: [] });
  }
  try {
    const favorites = await getFavoritesByOwner(ownerKey);
    return NextResponse.json(favorites);
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
