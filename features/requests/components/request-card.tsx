"use client";

import { ArrowRight, Calendar, Users, Wallet, User, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatRideDate, timeAgo } from "@/lib/utils";
import { buildWhatsAppLink, buildCallLink } from "@/lib/whatsapp";
import type { RideRequestDTO } from "@/types";

/** Card for a passenger ride request; drivers reach out via WhatsApp/call. */
export function RequestCard({ request }: { request: RideRequestDTO }) {
  const message =
    `Assalam-o-Alaikum ${request.passenger.name}! I saw your ride request on RideConnect ` +
    `(${request.fromCity} to ${request.toCity}, ${formatRideDate(request.date)}). ` +
    `I can offer a ride. Are you still looking?`;

  const whatsappLink = buildWhatsAppLink({ phone: request.passenger.phone, message });
  const callLink = buildCallLink(request.passenger.phone);

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <User className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{request.passenger.name}</p>
              <p className="text-[11px] text-muted-foreground">
                Looking for a ride • {timeAgo(request.createdAt)}
              </p>
            </div>
          </div>
          <Badge variant="secondary">Passenger</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="truncate">{request.fromCity}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{request.toCity}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {formatRideDate(request.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> {request.seats} {request.seats === 1 ? "seat" : "seats"}
          </span>
          {request.budget !== undefined ? (
            <span className="flex items-center gap-1.5">
              <Wallet className="h-4 w-4" /> {formatPrice(request.budget)}
            </span>
          ) : null}
        </div>

        {request.notes ? (
          <p className="rounded-lg bg-muted p-2.5 text-xs text-muted-foreground">
            {request.notes}
          </p>
        ) : null}

        <Separator />

        <div className="flex items-center gap-1.5">
          {whatsappLink ? (
            <Button asChild variant="success" size="sm" className="flex-1">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle /> Offer ride
              </a>
            </Button>
          ) : null}
          {callLink ? (
            <Button asChild variant="outline" size="icon" aria-label="Call passenger">
              <a href={callLink}>
                <Phone />
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
