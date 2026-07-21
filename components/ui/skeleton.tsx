import { cn } from "@/lib/utils";

/** Shimmering skeleton placeholder. Uses the `.skeleton` utility in globals.css. */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />;
}

export { Skeleton };
