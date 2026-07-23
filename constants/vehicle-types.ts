export const VEHICLE_TYPES = [
  "Car",
  "SUV",
  "Van",
  "Hiace",
  "Coaster",
  "Bike",
] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const VEHICLE_TYPE_VALUES = VEHICLE_TYPES as unknown as [string, ...string[]];

interface VehicleTypeMeta {
  type: VehicleType;
  /** Typical seat capacity, used as a create-ride default hint. */
  defaultSeats: number;
  maxSeats: number;
}

export const VEHICLE_TYPE_META: Record<VehicleType, VehicleTypeMeta> = {
  Car: { type: "Car", defaultSeats: 4, maxSeats: 4 },
  SUV: { type: "SUV", defaultSeats: 4, maxSeats: 6 },
  Van: { type: "Van", defaultSeats: 6, maxSeats: 8 },
  Hiace: { type: "Hiace", defaultSeats: 12, maxSeats: 16 },
  Coaster: { type: "Coaster", defaultSeats: 20, maxSeats: 30 },
  Bike: { type: "Bike", defaultSeats: 1, maxSeats: 1 },
};

export const VEHICLE_COLORS = [
  "White",
  "Black",
  "Silver",
  "Grey",
  "Blue",
  "Red",
  "Green",
  "Brown",
  "Other",
] as const;

export type VehicleColor = (typeof VEHICLE_COLORS)[number];
