import { NextResponse, type NextRequest } from "next/server";
import { getRecentSearches } from "@/services/search-history.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ownerKey = request.nextUrl.searchParams.get("ownerKey");
  if (!ownerKey) {
    return NextResponse.json({ error: "ownerKey required" }, { status: 400 });
  }
  try {
    const history = await getRecentSearches(ownerKey);
    return NextResponse.json(history);
  } catch {
    return NextResponse.json({ error: "Failed to load search history" }, { status: 500 });
  }
}
