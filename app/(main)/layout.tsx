import { BottomNav } from "@/components/layout/bottom-nav";
import { ROUTES } from "@/constants/routes";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

/** Shared shell for the main browsing experience with sticky bottom nav. */
export default async function MainLayout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(ROUTES.auth.login);
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
