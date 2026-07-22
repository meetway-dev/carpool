import { NextResponse, type NextRequest } from "next/server";
import { getFavoritesByOwner } from "@/services/favorite.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ownerKey = request.nextUrl.searchParams.get("ownerKey");
  if (!ownerKey) {
    return NextResponse.json({ rides: [], drivers: [], routes: [] });
  }
  try {
    const favorites = await getFavoritesByOwner(ownerKey);
    return NextResponse.json(favorites);
  } catch {
    return NextResponse.json({ error: "Failed to load favorites" }, { status: 500 });
  }
}
