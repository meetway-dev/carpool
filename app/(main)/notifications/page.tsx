"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, Check } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { markNotificationsRead } from "@/features/notifications/actions/mark-read";
import { useDeviceKey } from "@/hooks/use-device-key";
import { timeAgo, cn } from "@/lib/utils";
import type { NotificationDTO } from "@/services/notification.service";

async function fetchNotifications(ownerKey: string): Promise<NotificationDTO[]> {
  const res = await fetch(`/api/notifications?ownerKey=${encodeURIComponent(ownerKey)}`);
  if (!res.ok) throw new Error("Failed to load notifications");
  return res.json() as Promise<NotificationDTO[]>;
}

export default function NotificationsPage() {
  const deviceKey = useDeviceKey();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", deviceKey],
    queryFn: () => fetchNotifications(deviceKey!),
    enabled: Boolean(deviceKey),
  });

  const markRead = useMutation({
    mutationFn: () => markNotificationsRead(deviceKey ?? ""),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", deviceKey] }),
  });

  // Auto-mark all read when page opens.
  useEffect(() => {
    if (deviceKey && data?.some((n) => !n.read)) {
      markRead.mutate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceKey, data]);

  const unread = data?.filter((n) => !n.read).length ?? 0;

  return (
    <main>
      <AppHeader title="Notifications">
        {unread > 0 ? (
          <div className="flex items-center justify-between border-t px-4 py-2">
            <span className="text-xs text-muted-foreground">{unread} unread</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markRead.mutate()}
              disabled={markRead.isPending}
            >
              <Check className="h-4 w-4" /> Mark all read
            </Button>
          </div>
        ) : null}
      </AppHeader>

      <div className="space-y-1 px-4 py-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))
        ) : !data?.length ? (
          <EmptyState
            icon={BellOff}
            title="No notifications"
            description="Save a route and we'll notify you when a new ride is posted."
          />
        ) : (
          data.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 rounded-xl p-3 transition-colors",
                !n.read && "bg-primary/5",
              )}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  {!n.read ? (
                    <Badge variant="default" className="shrink-0 px-1.5 py-0 text-[10px]">
                      New
                    </Badge>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{timeAgo(n.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
