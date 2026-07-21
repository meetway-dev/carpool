import { clientEnv } from "@/config/env";

export const siteConfig = {
  name: "RideConnect Pakistan",
  shortName: "RideConnect",
  description:
    "Find and post intercity carpool rides across Pakistan. Search by route, date, price and seats. A faster, safer alternative to WhatsApp ride groups.",
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  locale: "en_PK",
  keywords: [
    "carpool Pakistan",
    "ride sharing Islamabad",
    "Peshawar to Islamabad ride",
    "intercity rides",
    "car sharing KPK",
    "RideConnect",
  ],
  links: {
    github: "https://github.com",
  },
  contact: {
    supportEmail: "support@rideconnect.pk",
  },
} as const;

export type SiteConfig = typeof siteConfig;
