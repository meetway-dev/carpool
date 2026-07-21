import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";

/** Shared shell for the main browsing experience with sticky bottom nav. */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
