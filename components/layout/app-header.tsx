import { NotificationBell } from "@/components/common/notification-bell";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Car, User } from "lucide-react";
import Link from "next/link";

interface AppHeaderProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function AppHeader({ title, children, className }: AppHeaderProps) {
  return (
    <header className={cn("glass sticky top-0 z-30", className)}>
      <div className="flex items-center justify-between px-4 py-3">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Car className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            {title ?? "CityPool"}
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <NotificationBell />
          <ThemeToggle />
          <Link
            href={ROUTES.profile}
            aria-label="Go to profile"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:bg-accent"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
      {children}
    </header>
  );
}
