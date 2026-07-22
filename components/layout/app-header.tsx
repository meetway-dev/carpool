import Link from "next/link";
import { Car } from "lucide-react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { NotificationBell } from "@/components/common/notification-bell";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

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
            {title ?? siteConfig.shortName}
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>
      {children}
    </header>
  );
}
