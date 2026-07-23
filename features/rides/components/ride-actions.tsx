"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { ReportDialog } from "@/features/rides/components/report-dialog";
import { absoluteUrl, cn, formatRideDate } from "@/lib/utils";
import { getApi, postApi } from "@/lib/api-client";
import { buildCallLink, buildRideInquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import type { RideDTO } from "@/types";
import { Flag, Heart, MessageCircle, Phone, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface RideActionsProps {
  ride: RideDTO;
  /** Compact icon-only layout for cards; full labelled layout for details. */
  variant?: "card" | "detail";
}

export function RideActions({ ride, variant = "card" }: RideActionsProps) {
  const { isRideSaved, toggleRide } = useFavorites();
  const [reportOpen, setReportOpen] = useState(false);
  const saved = isRideSaved(ride.id);

  const message = buildRideInquiryMessage({
    fromCity: ride.route.fromCity,
    toCity: ride.route.toCity,
    date: formatRideDate(ride.departure.date),
    seats: 1,
  });
  const whatsappLink = buildWhatsAppLink({ phone: ride.driver.phone, message });
  const callLink = buildCallLink(ride.driver.phone);
  const shareUrl = absoluteUrl(ROUTES.rideDetails(ride.id));
  const router = useRouter();

  async function handleShare() {
    const shareData = {
      title: `${ride.route.fromCity} → ${ride.route.toCity} ride`,
      text: `Ride from ${ride.route.fromCity} to ${ride.route.toCity} on RideConnect`,
      url: shareUrl,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // User cancelled the share sheet — no-op.
    }
  }

  function handleSave() {
    toggleRide(ride.id);
    toast.success(saved ? "Removed from saved" : "Saved");
  }

  if (variant === "detail") {
    return (
      <>
        <div className="grid grid-cols-2 gap-2">
          {whatsappLink ? (
            <Button asChild variant="success" size="lg">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle /> WhatsApp
              </a>
            </Button>
          ) : null}
          {callLink ? (
            <Button asChild variant="outline" size="lg">
              <a href={callLink}>
                <Phone /> Call
              </a>
            </Button>
          ) : null}
        </div>
        <div>
          <Button
            onClick={async () => {
              try {
                const me = await getApi<{ id?: string }>('/api/auth/me');
                if (!me) {
                  router.push('/auth/login');
                  return;
                }
                await postApi<{ success: boolean; bookingId?: string }>(`/api/rides/${ride.id}/book`, { seats: 1 });
                toast.success('Booking confirmed');
              } catch (err: any) {
                toast.error(err?.message || 'Could not book ride');
              }
            }}
            className="w-full mt-2"
          >
            Book seat
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="ghost" onClick={handleSave}>
            <Heart className={cn("h-4 w-4", saved && "fill-destructive text-destructive")} />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="ghost" onClick={handleShare}>
            <Share2 /> Share
          </Button>
          <Button variant="ghost" onClick={() => setReportOpen(true)}>
            <Flag /> Report
          </Button>
        </div>
        <ReportDialog
          open={reportOpen}
          onOpenChange={setReportOpen}
          targetType="ride"
          targetId={ride.id}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        {whatsappLink ? (
          <Button asChild variant="success" size="sm" className="flex-1">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle /> WhatsApp
            </a>
          </Button>
        ) : null}
        <Button
          variant="success"
          size="sm"
          onClick={async () => {
            try {
              const me = await getApi<{ id?: string }>('/api/auth/me');
              if (!me) {
                router.push('/auth/login');
                return;
              }
              await postApi<{ success: boolean; bookingId?: string }>(`/api/rides/${ride.id}/book`, { seats: 1 });
              toast.success('Booking confirmed');
            } catch (err: any) {
              toast.error(err?.message || 'Could not book ride');
            }
          }}
        >
          Book
        </Button>
        {callLink ? (
          <Button asChild variant="outline" size="icon" aria-label="Call driver">
            <a href={callLink}>
              <Phone />
            </a>
          </Button>
        ) : null}
        <Button
          variant="outline"
          size="icon"
          aria-label={saved ? "Unsave ride" : "Save ride"}
          onClick={handleSave}
        >
          <Heart className={cn("h-4 w-4", saved && "fill-destructive text-destructive")} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Share ride"
          onClick={handleShare}
        >
          <Share2 />
        </Button>
      </div>
      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        targetType="ride"
        targetId={ride.id}
      />
    </>
  );
}
