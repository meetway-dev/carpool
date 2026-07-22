"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { useDeviceKey } from "@/hooks/use-device-key";

async function fetchUnreadCount(ownerKey: string): Promise<number> {
  const res = await fetch(`/api/notifications?ownerKey=${encodeURIComponent(ownerKey)}`);
  if (!res.ok) return 0;
  const data = (await res.json()) as Array<{ read: boolean }>;
  return data.filter((n) => !n.read).length;
}

/** Bell icon button showing unread notification count. */
export function NotificationBell() {
  const deviceKey = useDeviceKey();

  const { data: count = 0 } = useQuery({
    queryKey: ["notif-count", deviceKey],
    queryFn: () => fetchUnreadCount(deviceKey!),
    enabled: Boolean(deviceKey),
    refetchInterval: 60_000,
  });

  return (
    <Button asChild variant="ghost" size="icon" className="relative" aria-label="Notifications">
      <Link href={ROUTES.notifications}>
        <Bell className="h-5 w-5" />
        {count > 0 ? (
          <Badge
            variant="destructive"
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
          >
            {count > 9 ? "9+" : count}
          </Badge>
        ) : null}
      </Link>
    </Button>
  );
}
