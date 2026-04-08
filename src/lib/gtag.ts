/* ── Google Tag (gtag.js) helpers ──────────────────────────────
 *
 * Fires events for both GA4 (G-K97XQMZ1E2) and Google Ads (AW-628431508).
 *
 * Usage:
 *   import { trackLead } from "@/lib/gtag";
 *   trackLead("quote_web", { tier: "Growth", email: "j@co.com" });
 *
 * Google Ads conversion label:
 *   Set NEXT_PUBLIC_GADS_CONVERSION_LABEL in .env.local once you create
 *   the conversion action in Google Ads. Until then, only the base
 *   config event fires (still useful for Smart Bidding audiences).
 * ──────────────────────────────────────────────────────────── */

// Extend Window for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const ADS_ID = "AW-628431508";
const ADS_LABEL = (process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL ?? "").trim();

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

/**
 * Fire a lead/conversion event.
 *
 * @param source  — form identifier: "quote_web" | "quote_it" | "contact" | "audit"
 * @param meta    — optional key/value pairs (tier, email, service, etc.)
 */
export function trackLead(
  source: "quote_web" | "quote_it" | "contact" | "audit",
  meta?: Record<string, string | number | boolean | undefined>
) {
  // 1️⃣  GA4 — generate_lead event (shows up in GA4 → Events → generate_lead)
  gtag("event", "generate_lead", {
    event_category: "form",
    event_label: source,
    value: source.startsWith("quote") ? 1 : 0.5, // weight quotes higher
    ...meta,
  });

  // 2️⃣  Google Ads — conversion event
  //     Without a label it still sends a config ping (useful for audiences).
  //     With a label it counts as an actual conversion for bidding.
  if (ADS_LABEL) {
    gtag("event", "conversion", {
      send_to: `${ADS_ID}/${ADS_LABEL}`,
      event_category: "form",
      event_label: source,
    });
  }
}
