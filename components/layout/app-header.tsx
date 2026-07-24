import Link from "next/link";
import { type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { NotificationBell } from "@/components/common/notification-bell";

interface AppHeaderProps {
  title?: string;
  right?: ReactNode;
}

export function AppHeader({ title, right }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.home} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <span className="text-sm font-bold tracking-tight">C</span>
            </span>
            {title ? (
              <span className="text-base font-semibold tracking-tight">{title}</span>
            ) : (
              <span className="text-base font-semibold tracking-tight">
                CityPool
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <NotificationBell />
          <ThemeToggle />
          {right}
        </div>
      </div>
    </header>
  );
}
