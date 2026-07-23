/**
 * Supported cities. Adding a city here automatically makes it available in
 * search, create-ride, validators and seeds. Keep slugs stable once shipped —
 * they are used in URLs and stored documents reference the `name`.
 */
export interface City {
  name: string;
  slug: string;
  province: "Islamabad Capital Territory" | "Punjab" | "Khyber Pakhtunkhwa";
  /** Rough coordinates for future map features. */
  lat: number;
  lng: number;
}

export const CITIES: readonly City[] = [
  { name: "Islamabad", slug: "islamabad", province: "Islamabad Capital Territory", lat: 33.6844, lng: 73.0479 },
  { name: "Rawalpindi", slug: "rawalpindi", province: "Punjab", lat: 33.5651, lng: 73.0169 },
  { name: "Peshawar", slug: "peshawar", province: "Khyber Pakhtunkhwa", lat: 34.0151, lng: 71.5249 },
  { name: "Mardan", slug: "mardan", province: "Khyber Pakhtunkhwa", lat: 34.1989, lng: 72.0231 },
  { name: "Swabi", slug: "swabi", province: "Khyber Pakhtunkhwa", lat: 34.1202, lng: 72.4699 },
  { name: "Takht Bhai", slug: "takht-bhai", province: "Khyber Pakhtunkhwa", lat: 34.2921, lng: 71.9465 },
  { name: "Nowshera", slug: "nowshera", province: "Khyber Pakhtunkhwa", lat: 34.0153, lng: 71.9747 },
  { name: "Charsadda", slug: "charsadda", province: "Khyber Pakhtunkhwa", lat: 34.1453, lng: 71.7308 },
  { name: "Abbottabad", slug: "abbottabad", province: "Khyber Pakhtunkhwa", lat: 34.1688, lng: 73.2215 },
  { name: "Haripur", slug: "haripur", province: "Khyber Pakhtunkhwa", lat: 33.9946, lng: 72.9106 },
  { name: "Mansehra", slug: "mansehra", province: "Khyber Pakhtunkhwa", lat: 34.3333, lng: 73.2 },
  { name: "Lahore", slug: "lahore", province: "Punjab", lat: 31.5204, lng: 74.3587 },
] as const;

export const CITY_NAMES = CITIES.map((city) => city.name) as [string, ...string[]];

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((city) => city.slug === slug);
}

export function getCityByName(name: string): City | undefined {
  return CITIES.find((city) => city.name.toLowerCase() === name.toLowerCase());
}

export function isSupportedCity(name: string): boolean {
  return getCityByName(name) !== undefined;
}
