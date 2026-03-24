/* ── SEO Lead Tracking ──
 * Client-side hook for tracking SEO lead events.
 * Tracks page views, CTA clicks, and form submissions
 * to measure SEO → conversion pipeline.
 */

"use client";

import { useEffect, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("seo_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("seo_session_id", id);
  }
  return id;
}

function trackEvent(data: {
  sessionId?: string;
  landingPage: string;
  conversionPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  keyword?: string;
  eventType: string;
}) {
  // Fire and forget — don't block the UI
  fetch("/api/seo/lead-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch(() => {
    // Silently fail — tracking should never break UX
  });
}

/**
 * Hook to track page views automatically.
 * Add to your root layout or a provider component.
 */
export function useSeoLeadTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedRef = useRef<string>("");

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    // Don't double-track same page
    if (trackedRef.current === pathname) return;
    trackedRef.current = pathname;

    const sessionId = getSessionId();
    const utmSource = searchParams.get("utm_source") || undefined;
    const utmMedium = searchParams.get("utm_medium") || undefined;
    const utmCampaign = searchParams.get("utm_campaign") || undefined;
    const referrer = typeof document !== "undefined" ? document.referrer : undefined;

    trackEvent({
      sessionId,
      landingPage: pathname,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer: referrer || undefined,
      eventType: "page_view",
    });
  }, [pathname, searchParams]);
}

/**
 * Returns a callback to track CTA clicks.
 * Usage: const trackCTA = useSeoCtaTracking(); <button onClick={() => trackCTA("contact")}>
 */
export function useSeoCtaTracking() {
  const pathname = usePathname();

  return useCallback(
    (ctaTarget: string) => {
      const sessionId = getSessionId();
      trackEvent({
        sessionId,
        landingPage: pathname,
        conversionPage: ctaTarget,
        eventType: "cta_click",
      });
    },
    [pathname]
  );
}

/**
 * Track a form submission conversion.
 * Call this when a contact/quote form is successfully submitted.
 */
export function trackFormSubmission(
  landingPage: string,
  conversionPage: string
) {
  const sessionId = getSessionId();
  trackEvent({
    sessionId,
    landingPage,
    conversionPage,
    eventType: "form_submit",
  });
}
