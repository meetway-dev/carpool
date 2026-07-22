import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  current: number;
  className?: string;
}

/** Horizontal step progress indicator for multi-step forms. */
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
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isDone && "bg-primary text-primary-foreground",
                  isActive && "bg-primary/15 text-primary ring-2 ring-primary",
                  !isDone && !isActive && "bg-muted text-muted-foreground",
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : index + 1}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-colors",
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
