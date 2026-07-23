import { getAuthenticatedUser } from "@/lib/auth-server";
import { connectToDatabase } from "@/lib/db/connect";
import { Booking } from "@/models/booking.model";
import { Ride } from "@/models/ride.model";
import { NextResponse } from "next/server";

export async function POST(req: Request, context: any) {
  try {
    const params = await context.params;
    const { rideId } = params;
    const body = await req.json();
    const seats = Number(body.seats ?? 1) || 1;
    const name = body.name?.trim();
    const phone = body.phone?.trim();

    await connectToDatabase();

    const user = await getAuthenticatedUser();
    const passengerName = user?.name ?? name;
    const passengerPhone = user?.phone ?? phone;

    if (!passengerName || !passengerPhone) {
      return NextResponse.json({ error: "Name and phone are required to book." }, { status: 400 });
    }

    // Atomically decrement seatsLeft if enough seats remain.
    const updated = await Ride.findOneAndUpdate(
      { _id: rideId, seatsLeft: { $gte: seats }, status: { $in: ["open"] } },
      { $inc: { seatsLeft: -seats } },
      { new: true },
    ).lean().exec();

    if (!updated) {
      return NextResponse.json({ error: "Not enough seats available." }, { status: 409 });
    }

    const created = await Booking.create({
      rideId,
      passenger: { name: passengerName, phone: passengerPhone },
      seats,
      status: "confirmed",
    });

    return NextResponse.json({ success: true, bookingId: String(created._id) });
  } catch (err) {
    console.error("POST /api/rides/[rideId]/book failed:", err);
    return NextResponse.json({ error: "Could not create booking" }, { status: 500 });
  }
}
