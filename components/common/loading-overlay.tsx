"use client";

import { useEffect, useState } from "react";

/** Full-screen loading overlay shown during initial hydration. */
export function LoadingOverlay({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border border-primary/20" />
            <div className="absolute inset-0 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" style={{ animationDirection: "reverse", animationDuration: "0.9s" }} />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
