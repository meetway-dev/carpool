"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { cn } from "@/lib/utils";

export function SaveDriverButton({ driverId }: { driverId: string }) {
  const { isDriverSaved, toggleDriver } = useFavorites();
  const saved = isDriverSaved(driverId);

  function handleClick() {
    toggleDriver(driverId);
    toast.success(saved ? "Removed from saved" : "Driver saved");
  }

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={saved ? "Unsave driver" : "Save driver"}
      onClick={handleClick}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-destructive text-destructive")} />
    </Button>
  );
}
