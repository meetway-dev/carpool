"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, Heart, User } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
}

const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.home, label: "Home", icon: Home },
  { href: ROUTES.rides, label: "Search", icon: Search },
  { href: ROUTES.favorites, label: "Saved", icon: Heart },
  { href: ROUTES.profile, label: "Profile", icon: User },
];

function isActive(pathname: string, href: string): boolean {
  if (href === ROUTES.home) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sticky bottom navigation with a centered floating "Create ride" action.
 * Mobile-first, one-handed reachable, safe-area aware.
 */
export function BottomNav() {
  const pathname = usePathname();
  const left = NAV_ITEMS.slice(0, 2);
  const right = NAV_ITEMS.slice(2);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/85 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5 items-center px-2">
        {left.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}

        <div className="flex items-center justify-center">
          <Link
            href={ROUTES.createRide}
            aria-label="Post a ride"
            className="flex h-14 w-14 -translate-y-5 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elevated ring-4 ring-background transition-transform active:scale-95"
          >
            <Plus className="h-7 w-7" />
          </Link>
        </div>

        {right.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-medium transition-all",
        active
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg transition-all",
          active && "bg-primary/12",
        )}
      >
        <Icon className={cn("h-5 w-5 transition-all", active && "scale-110")} />
      </span>
      {item.label}
    </Link>
  );
}
