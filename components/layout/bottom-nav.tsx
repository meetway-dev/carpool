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
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-lg items-center justify-around px-2 pb-safe pt-1.5 pb-1.5">
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} />
        ))}

        <div className="flex w-16 flex-col items-center">
          <div className="-mt-7">
            <Button asChild variant="default" size="icon" className="h-13 w-13 rounded-full shadow-float active:scale-95">
              <Link href={ROUTES.createRide} aria-label="Post a ride">
                <Plus className="!h-6 !w-6" />
              </Link>
            </Button>
          </div>
          <span className="mt-0.5 text-[10px] font-medium text-muted-foreground">Post</span>
        </div>

        {NAV_ITEMS.slice(2).map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({ item, pathname }: { item: (typeof NAV_ITEMS)[number]; pathname: string | null }) {
  const Icon = item.icon;
  const isActive = pathname === item.href || pathname?.startsWith(item.href + "?");

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-xs transition-all active:scale-95",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className={cn("h-5 w-5 transition-all", isActive ? "stroke-[2.5px]" : "stroke-[1.75px]")} />
      <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>{item.label}</span>
      {isActive ? (
        <span className="h-1 w-1 rounded-full bg-primary" />
      ) : null}
    </Link>
  );
}
