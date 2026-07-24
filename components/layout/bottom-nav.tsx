"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: ROUTES.home, label: "Home", icon: Home },
  { href: ROUTES.rides, label: "Rides", icon: Search },
  { href: ROUTES.favorites, label: "Saved", icon: Heart },
  { href: ROUTES.notifications, label: "Alerts", icon: Bell },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 pb-safe pt-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "?");

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.25px]" : "stroke-[1.75px]")} />
              <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>{item.label}</span>
            </Link>
          );
        })}

        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <Button asChild variant="default" size="icon" className="h-12 w-12 rounded-full shadow-md">
            <Link href={ROUTES.createRide} aria-label="Post a ride">
              <Plus className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
