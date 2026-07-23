"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function RouteChangeIndicator() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // show the indicator briefly when the pathname changes
    if (prev.current && prev.current !== pathname) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(t);
    }
    prev.current = pathname;
    return;
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="h-1 w-full bg-primary/90 shadow-lg shadow-primary/20 animate-pulse" />
    </div>
  );
}
