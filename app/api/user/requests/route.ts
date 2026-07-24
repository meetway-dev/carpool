import { getAuthenticatedUser } from "@/lib/auth-server";
import { connectToDatabase } from "@/lib/db/connect";
import { RideRequest } from "@/models/ride-request.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const requests = await RideRequest.find({
      "passenger.phone": user.phone,
      status: { $nin: ["expired", "cancelled", "fulfilled"] },
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      requests: requests.map((r) => ({
        id: String(r._id),
        fromCity: r.fromCity,
        toCity: r.toCity,
        date: r.date,
        seats: r.seats,
        budget: r.budget,
        notes: r.notes,
        status: r.status,
        createdAt: r.createdAt?.toISOString?.() ?? new Date().toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/user/requests failed:", error);
    return NextResponse.json({ error: "Unable to load requests" }, { status: 500 });
  }
}
