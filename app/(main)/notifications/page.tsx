"use client";

import { EmptyState } from "@/components/feedback/empty-state";
import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { markNotificationsRead } from "@/features/notifications/actions/mark-read";
import { useDeviceKey } from "@/hooks/use-device-key";
import { getApi } from "@/lib/api-client";
import { cn, timeAgo } from "@/lib/utils";
import type { NotificationDTO } from "@/services/notification.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, Check } from "lucide-react";
import { useEffect } from "react";

export const dynamic = "force-dynamic";

async function fetchNotifications(ownerKey: string): Promise<NotificationDTO[]> {
  return getApi<NotificationDTO[]>(`/api/notifications?ownerKey=${encodeURIComponent(ownerKey)}`);
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

  useEffect(() => {
    if (deviceKey && data?.some((n) => !n.read)) {
      markRead.mutate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceKey, data]);

  const unread = data?.filter((n) => !n.read).length ?? 0;

  return (
    <main className="animate-fade-in">
      <AppHeader title="Notifications" right={
        unread > 0 ? (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="tabular-nums">
              {unread} new
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markRead.mutate()}
              disabled={markRead.isPending}
            >
              <Check className="h-4 w-4" /> Mark read
            </Button>
          </div>
        ) : null
      } />

      <div className="px-4 py-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : !data?.length ? (
          <EmptyState
            icon={BellOff}
            title="No notifications"
            description="Save a route and we'll notify you when a new ride is posted."
          />
        ) : (
          <div className="space-y-1">
            {data.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl p-3 transition-all",
                  !n.read && "bg-accent/50",
                )}
              >
                <span className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  n.read ? "bg-muted" : "bg-primary/10",
                )}>
                  <Bell className={cn("h-4 w-4", n.read ? "text-muted-foreground" : "text-primary")} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm", !n.read ? "font-semibold" : "font-medium")}>{n.title}</p>
                    {!n.read ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
