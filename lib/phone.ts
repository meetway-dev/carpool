/**
 * Pakistani phone number helpers. Accepts common local formats and
 * normalizes to E.164 (+92XXXXXXXXXX) for storage and deep links.
 *
 * Accepted inputs:
 *   03001234567
 *   0300 1234567
 *   +923001234567
 *   923001234567
 *   00923001234567
 */

const PK_MOBILE_E164 = /^\+92(3\d{9})$/;

/** Strip everything except digits and a leading plus. */
function stripFormatting(raw: string): string {
  return raw.replace(/[^\d+]/g, "");
}

/**
 * Normalize any accepted Pakistani mobile format to +923XXXXXXXXX.
 * Returns null when the number cannot be interpreted as a PK mobile.
 */
export function normalizePakistaniPhone(raw: string): string | null {
  let value = stripFormatting(raw);

  if (value.startsWith("00")) {
    value = `+${value.slice(2)}`;
  }

  if (value.startsWith("+92")) {
    // already E.164-ish
  } else if (value.startsWith("92")) {
    value = `+${value}`;
  } else if (value.startsWith("0")) {
    value = `+92${value.slice(1)}`;
  } else if (value.startsWith("3")) {
    value = `+92${value}`;
  } else {
    return null;
  }

  return PK_MOBILE_E164.test(value) ? value : null;
}

/** True when the input is a valid Pakistani mobile number. */
export function isValidPakistaniPhone(raw: string): boolean {
  return normalizePakistaniPhone(raw) !== null;
}

/** Human-friendly display format: "0300 1234567". */
export function formatPakistaniPhone(raw: string): string {
  const normalized = normalizePakistaniPhone(raw);
  if (!normalized) return raw;
  const local = `0${normalized.slice(3)}`; // drop +92, restore leading 0
  return `${local.slice(0, 4)} ${local.slice(4)}`;
}

/** Digits-only form used by tel: and wa.me links (92XXXXXXXXXX). */
export function toDialDigits(raw: string): string | null {
  const normalized = normalizePakistaniPhone(raw);
  return normalized ? normalized.replace("+", "") : null;
}
