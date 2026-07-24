import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  current: number;
  className?: string;
}

export function StepIndicator({ steps, current, className }: StepIndicatorProps) {
  return (
    <ol className={cn("flex items-center gap-2", className)}>
      {steps.map((label, index) => {
        const isDone = index < current;
        const isActive = index === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                  isDone && "bg-primary text-primary-foreground",
                  isActive && "bg-primary/15 text-primary ring-1 ring-primary",
                  !isDone && !isActive && "bg-muted text-muted-foreground",
                )}
              >
                {isDone ? <Check className="h-3 w-3" /> : index + 1}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span
                className={cn(
                  "h-px flex-1 rounded-full transition-colors",
                  isDone ? "bg-primary" : "bg-muted",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
