"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function RouteChangeIndicator() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prev.current && prev.current !== pathname) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(t);
    }
    prev.current = pathname;
    return;
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-primary/80 transition-all duration-300" />
  );
}
