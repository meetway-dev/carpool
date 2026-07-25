import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-accent/40 px-6 py-14 text-center animate-fade-in",
        className,
      )}
    >
      {Icon ? (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Icon className="h-6 w-6" />
        </span>
      ) : null}
      <div className="space-y-1.5">
        <p className="text-base font-semibold">{title}</p>
        {description ? (
          <p className="mx-auto max-w-[260px] text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
