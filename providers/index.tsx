"use client";

import { RouteChangeIndicator } from "@/components/common/route-change-indicator";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { ReactNode } from "react";

/** Single client boundary composing all app-wide providers. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <RouteChangeIndicator />
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  );
}
