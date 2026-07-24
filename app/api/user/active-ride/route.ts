import { getAuthenticatedUser } from "@/lib/auth-server";
import { connectToDatabase } from "@/lib/db/connect";
import { Ride } from "@/models/ride.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const ride = await Ride.findOne({
      "driver.phone": user.phone,
      status: { $nin: ["expired", "cancelled", "completed"] },
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!ride) return NextResponse.json({ ride: null });

    return NextResponse.json({
      ride: {
        id: String(ride._id),
        fromCity: ride.route.fromCity,
        toCity: ride.route.toCity,
        date: ride.departure.date,
        time: ride.departure.time,
        pricePerSeat: ride.pricePerSeat,
        seatsTotal: ride.seatsTotal,
        seatsLeft: ride.seatsLeft,
        status: ride.status,
        vehicle: ride.vehicle,
      },
    });
  } catch (error) {
    console.error("GET /api/user/active-ride failed:", error);
    return NextResponse.json({ error: "Unable to load active ride" }, { status: 500 });
  }
}
