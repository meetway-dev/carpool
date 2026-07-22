"use client";

import { Bell, BellRing } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { cn } from "@/lib/utils";

/** Toggle to follow/unfollow a route for new-ride notifications. */
export function SaveRouteButton({
  fromCity,
  toCity,
}: {
  fromCity: string;
  toCity: string;
}) {
  const { isRouteSaved, toggleRoute } = useFavorites();
  const saved = isRouteSaved(fromCity, toCity);

  function handleClick() {
    toggleRoute(fromCity, toCity);
    toast.success(
      saved ? "Route alerts turned off" : "You'll be notified of new rides on this route",
    );
  }

  return (
    <Button
      variant={saved ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      className="gap-1.5"
    >
      {saved ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
      {saved ? "Following" : "Alert me"}
    </Button>
  );
}
