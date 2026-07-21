import { toDialDigits } from "@/lib/phone";

interface WhatsAppLinkOptions {
  phone: string;
  message?: string;
}

/**
 * Build a wa.me deep link. Returns null when the phone number is invalid so
 * callers can hide the button rather than render a broken link.
 */
export function buildWhatsAppLink({ phone, message }: WhatsAppLinkOptions): string | null {
  const digits = toDialDigits(phone);
  if (!digits) return null;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Build a tel: link for one-tap calling. Returns null for invalid numbers. */
export function buildCallLink(phone: string): string | null {
  const digits = toDialDigits(phone);
  return digits ? `tel:+${digits}` : null;
}

interface RideInquiryParams {
  fromCity: string;
  toCity: string;
  date: string;
  seats: number;
}

/** Prefilled WhatsApp message a passenger sends to a driver. */
export function buildRideInquiryMessage({
  fromCity,
  toCity,
  date,
  seats,
}: RideInquiryParams): string {
  return (
    `Assalam-o-Alaikum! I found your ride on RideConnect.\n\n` +
    `Route: ${fromCity} to ${toCity}\n` +
    `Date: ${date}\n` +
    `Seats needed: ${seats}\n\n` +
    `Is this ride still available?`
  );
}
