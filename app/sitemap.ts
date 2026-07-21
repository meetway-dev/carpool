import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { CITIES } from "@/constants/cities";
import { POPULAR_ROUTES } from "@/constants/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url;

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/rides`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/requests`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/rides/create`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Pre-render popular route search URLs for SEO discovery.
  const routeEntries: MetadataRoute.Sitemap = POPULAR_ROUTES.map((route) => ({
    url: `${base}/rides?fromCity=${encodeURIComponent(route.fromCity)}&toCity=${encodeURIComponent(route.toCity)}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const cityEntries: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${base}/rides?fromCity=${encodeURIComponent(city.name)}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...routeEntries, ...cityEntries];
}
