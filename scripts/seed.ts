import "dotenv/config";
import mongoose from "mongoose";
import { CITIES } from "../constants/cities";
import { VEHICLE_TYPE_META, VEHICLE_COLORS, type VehicleType } from "../constants/vehicle-types";
import { Ride } from "../models/ride.model";
import { Driver } from "../models/driver.model";
import { RideRequest } from "../models/ride-request.model";
import { normalizePakistaniPhone } from "../lib/phone";
import {
  computeDepartureTimestamp,
  computeExpiresAt,
  buildDuplicateHash,
  buildSearchText,
  resolveRideStatus,
} from "../lib/ride-helpers";

/**
 * Seed script — populates realistic drivers, rides and passenger requests so
 * the UI is fully populated during development.
 *
 * Usage: npm run seed
 * Requires MONGODB_URI in the environment (.env).
 */

const MONGODB_URI = process.env.MONGODB_URI;

const DRIVER_NAMES = [
  "Imran Khan",
  "Bilal Ahmed",
  "Fahad Iqbal",
  "Usman Ali",
  "Zeeshan Malik",
  "Kamran Shah",
  "Adnan Yousaf",
  "Waqas Nawaz",
  "Hamza Tariq",
  "Saad Rehman",
  "Noman Aslam",
  "Junaid Akbar",
];

const VEHICLE_MODELS: Record<VehicleType, string[]> = {
  Car: ["Toyota Corolla", "Honda City", "Suzuki Cultus", "Toyota Yaris", "Honda Civic"],
  SUV: ["Toyota Fortuner", "Kia Sportage", "Hyundai Tucson", "Honda BR-V"],
  Van: ["Suzuki APV", "Toyota Noah", "Nissan Serena"],
  Hiace: ["Toyota Hiace", "Toyota Grand Cabin"],
  Coaster: ["Toyota Coaster", "Higer Bus"],
  Bike: ["Honda CG 125", "Yamaha YBR"],
};

const PICKUP_POINTS = [
  "Faizabad",
  "Motorway Toll Plaza",
  "Saddar",
  "GT Road Stop",
  "Ring Road",
  "Main Bazaar",
  "Bus Terminal",
  "University Chowk",
];

const PHONE_POOL = [
  "03001234501",
  "03011234502",
  "03211234503",
  "03331234504",
  "03451234505",
  "03121234506",
  "03091234507",
  "03151234508",
  "03411234509",
  "03221234510",
  "03051234511",
  "03361234512",
];

function pick<T>(arr: readonly T[]): T {
  const value = arr[Math.floor(Math.random() * arr.length)];
  if (value === undefined) throw new Error("pick() from empty array");
  return value;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** yyyy-mm-dd for `daysFromNow` (0 = today). */
function dateString(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

function timeString(): string {
  const hour = randomInt(5, 22);
  const minute = pick([0, 15, 30, 45]);
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

async function seed() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to your .env file before seeding.");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  console.log("Clearing existing rides, drivers and requests...");
  await Promise.all([
    Ride.deleteMany({}),
    Driver.deleteMany({}),
    RideRequest.deleteMany({}),
  ]);

  // --- Drivers -----------------------------------------------------------
  const drivers = DRIVER_NAMES.map((name, index) => {
    const phone = normalizePakistaniPhone(PHONE_POOL[index % PHONE_POOL.length]!)!;
    const vehicleType = pick(Object.keys(VEHICLE_MODELS) as VehicleType[]);
    return {
      name,
      phone,
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
      ratingCount: randomInt(3, 120),
      completedTrips: randomInt(5, 400),
      verified: Math.random() > 0.4,
      homeCity: pick(CITIES).name,
      languages: pick([["Urdu", "Pashto"], ["Urdu", "English"], ["Urdu"], ["Pashto", "Urdu", "English"]]),
      vehicle: {
        type: vehicleType,
        model: pick(VEHICLE_MODELS[vehicleType]),
        color: pick(VEHICLE_COLORS),
      },
    };
  });

  const insertedDrivers = await Driver.insertMany(drivers);
  console.log(`Inserted ${insertedDrivers.length} drivers.`);

  // --- Rides -------------------------------------------------------------
  const rideDocs: Record<string, unknown>[] = [];

  for (let i = 0; i < 60; i += 1) {
    const driver = pick(insertedDrivers);
    const fromCity = pick(CITIES).name;
    let toCity = pick(CITIES).name;
    while (toCity === fromCity) {
      toCity = pick(CITIES).name;
    }

    const vehicleType = (driver.vehicle?.type as VehicleType | undefined) ?? "Car";
    const meta = VEHICLE_TYPE_META[vehicleType];
    const seatsTotal = randomInt(1, meta.maxSeats);
    const seatsLeft = randomInt(0, seatsTotal);

    const date = dateString(randomInt(0, 6));
    const time = timeString();
    const departure = computeDepartureTimestamp({ date, time });
    const status = resolveRideStatus(seatsLeft, departure);

    const searchText = buildSearchText({
      driverName: driver.name,
      fromCity,
      toCity,
      pickupPoint: pick(PICKUP_POINTS),
      dropPoint: pick(PICKUP_POINTS),
      vehicleModel: driver.vehicle?.model ?? "Toyota Corolla",
      vehicleType,
    });

    rideDocs.push({
      driver: {
        name: driver.name,
        phone: driver.phone,
        verified: driver.verified,
        driverId: driver._id,
      },
      vehicle: {
        type: vehicleType,
        model: driver.vehicle?.model ?? "Toyota Corolla",
        color: (driver.vehicle?.color as string | undefined) ?? "White",
      },
      route: {
        fromCity,
        toCity,
        pickupPoint: pick(PICKUP_POINTS),
        dropPoint: pick(PICKUP_POINTS),
      },
      pricePerSeat: randomInt(3, 30) * 100,
      seatsTotal,
      seatsLeft,
      departure: { date, time, timestamp: departure },
      arrivalEstimate: `~${randomInt(1, 4)}h ${pick([0, 15, 30, 45])}m`,
      options: {
        luggage: Math.random() > 0.2,
        smoking: Math.random() > 0.8,
        ac: Math.random() > 0.3,
        femaleOnly: Math.random() > 0.85,
        music: Math.random() > 0.4,
        pets: Math.random() > 0.9,
        returnTrip: Math.random() > 0.7,
      },
      recurrence: { repeatDaily: Math.random() > 0.8, repeatWeekly: false },
      notes: pick(["", "Leaving on time please.", "AC ride, comfortable seats.", "No smoking inside."]),
      status,
      featured: Math.random() > 0.85,
      duplicateHash: buildDuplicateHash({ phone: driver.phone, fromCity, toCity, date, time }),
      searchText,
      ownerKey: `seed:${driver.phone}`,
      expiresAt: computeExpiresAt(departure),
      viewCount: randomInt(0, 500),
    });
  }

  const insertedRides = await Ride.insertMany(rideDocs);
  console.log(`Inserted ${insertedRides.length} rides.`);

  // --- Passenger requests ------------------------------------------------
  const requestDocs = Array.from({ length: 12 }).map(() => {
    const fromCity = pick(CITIES).name;
    let toCity = pick(CITIES).name;
    while (toCity === fromCity) {
      toCity = pick(CITIES).name;
    }
    const date = dateString(randomInt(0, 5));
    const phone = normalizePakistaniPhone(pick(PHONE_POOL))!;
    return {
      passenger: { name: pick(DRIVER_NAMES), phone },
      fromCity,
      toCity,
      date,
      seats: randomInt(1, 4),
      budget: randomInt(3, 25) * 100,
      notes: pick(["", "Need AC car.", "Flexible on timing.", "Two passengers."]),
      status: "open" as const,
      ownerKey: `seed:${phone}`,
      expiresAt: computeExpiresAt(new Date(`${date}T23:59:00`)),
    };
  });

  const insertedRequests = await RideRequest.insertMany(requestDocs);
  console.log(`Inserted ${insertedRequests.length} passenger requests.`);

  await mongoose.disconnect();
  console.log("Seed complete. Disconnected.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
