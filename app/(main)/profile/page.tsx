import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { ProfileForm } from "@/features/profile/profile-form";
import { Heart, LogOut, Plus, ShieldCheck, User } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Profile" };

const LINKS = [
  { href: ROUTES.createRide, label: "Post a ride", icon: Plus },
  { href: ROUTES.favorites, label: "Saved rides", icon: Heart },
  { href: ROUTES.requests, label: "Passenger requests", icon: User },
];

/** Lightweight profile hub. Accounts and history arrive in later phases. */
export default function ProfilePage() {
  return (
    <main>
      <AppHeader title="Profile" />
      <div className="space-y-4 px-4 py-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <User className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold">Guest</p>
              <p className="text-xs text-muted-foreground">
                Browsing without an account
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>

        <div className="space-y-2">
          {LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.href}
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href={link.href}>
                  <Icon /> {link.label}
                </Link>
              </Button>
            );
          })}

          <Button asChild variant="destructive" className="w-full justify-start">
            <Link href={ROUTES.auth.login}>
              <LogOut /> Logout
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-accent/40 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
          OTP &amp; Google login, ride history and driver verification are coming soon.
        </div>
      </div>
    </main>
  );
}
