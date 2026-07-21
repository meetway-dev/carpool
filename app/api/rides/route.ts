import { NextResponse, type NextRequest } from "next/server";
import { searchRides } from "@/services/ride.service";
import { parseSearchParams } from "@/validators/search.schema";
import { rateLimiters } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * GET /api/rides — paginated ride search powering client-side infinite scroll.
 * Query params match `searchParamsSchema` (fromCity, toCity, sort, page, ...).
 */
export async function GET(request: NextRequest) {
  const identifier =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";

  const limited = rateLimiters.search(identifier);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const raw: Record<string, string | undefined> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    raw[key] = value;
  });

  try {
    const params = parseSearchParams(raw);
    const result = await searchRides(params);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("GET /api/rides failed:", error);
    return NextResponse.json(
      { error: "Failed to load rides. Please try again." },
      { status: 500 },
    );
  }
}
