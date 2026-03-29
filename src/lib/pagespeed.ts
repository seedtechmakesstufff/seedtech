/* ── Google PageSpeed Insights Integration ──
 *
 * Uses the free PageSpeed Insights API (no auth required for public URLs).
 * Optional: Add PAGESPEED_API_KEY to .env.local for higher rate limits.
 *
 * Docs: https://developers.google.com/speed/docs/insights/v5/get-started
 */

const PSI_BASE = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

/* ── Types ── */

export interface CoreWebVitals {
  lcp: number | null;  // Largest Contentful Paint (ms)
  fid: number | null;  // First Input Delay (ms) — lab = TBT
  cls: number | null;  // Cumulative Layout Shift
  fcp: number | null;  // First Contentful Paint (ms)
  si: number | null;   // Speed Index (ms)
  tbt: number | null;  // Total Blocking Time (ms)
  tti: number | null;  // Time to Interactive (ms)
}

export interface PageSpeedResult {
  url: string;
  strategy: "mobile" | "desktop";
  performanceScore: number;     // 0–100
  accessibilityScore: number;   // 0–100
  bestPracticesScore: number;   // 0–100
  seoScore: number;             // 0–100
  coreWebVitals: CoreWebVitals;
  opportunities: Opportunity[];
  fetchedAt: string;
}

export interface Opportunity {
  title: string;
  description: string;
  savingsMs?: number;
}

export interface PageSpeedSummary {
  pages: PageSpeedResult[];
  avgPerformance: number;
  avgSeo: number;
  avgAccessibility: number;
  fetchedAt: string;
}

/* ── API Methods ── */

/**
 * Run PageSpeed Insights for a single URL.
 */
export async function analyzeUrl(
  url: string,
  strategy: "mobile" | "desktop" = "mobile"
): Promise<PageSpeedResult> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  const params = new URLSearchParams({
    url,
    strategy,
    category: "performance",
    // Also fetch accessibility, best-practices, seo
  });
  // Request all categories
  ["accessibility", "best-practices", "seo"].forEach((c) =>
    params.append("category", c)
  );
  if (apiKey) params.set("key", apiKey);

  const res = await fetch(`${PSI_BASE}?${params}`, {
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message || `PageSpeed API error: ${res.status}`
    );
  }

  const data = await res.json();
  const lh = data.lighthouseResult;
  const categories = lh?.categories ?? {};
  const audits = lh?.audits ?? {};

  // Extract Core Web Vitals
  const cwv: CoreWebVitals = {
    lcp: numericValue(audits["largest-contentful-paint"]),
    fid: null, // FID is field-only; use TBT as lab proxy
    cls: numericValue(audits["cumulative-layout-shift"]),
    fcp: numericValue(audits["first-contentful-paint"]),
    si: numericValue(audits["speed-index"]),
    tbt: numericValue(audits["total-blocking-time"]),
    tti: numericValue(audits["interactive"]),
  };

  // Extract opportunities (things to fix)
  const opportunities: Opportunity[] = [];
  for (const key of Object.keys(audits)) {
    const audit = audits[key];
    if (
      audit.details?.type === "opportunity" &&
      audit.details?.overallSavingsMs > 0
    ) {
      opportunities.push({
        title: audit.title,
        description: audit.description,
        savingsMs: Math.round(audit.details.overallSavingsMs),
      });
    }
  }
  opportunities.sort((a, b) => (b.savingsMs ?? 0) - (a.savingsMs ?? 0));

  return {
    url,
    strategy,
    performanceScore: Math.round((categories.performance?.score ?? 0) * 100),
    accessibilityScore: Math.round((categories.accessibility?.score ?? 0) * 100),
    bestPracticesScore: Math.round((categories["best-practices"]?.score ?? 0) * 100),
    seoScore: Math.round((categories.seo?.score ?? 0) * 100),
    coreWebVitals: cwv,
    opportunities: opportunities.slice(0, 10),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Audit multiple pages at once. Returns summary + per-page results.
 * Paths must be provided by the caller (from SitePage or site config).
 */
export async function auditSite(
  baseUrl: string,
  paths: string[] = ["/"],
  strategy: "mobile" | "desktop" = "mobile"
): Promise<PageSpeedSummary> {
  const results = await Promise.allSettled(
    paths.map((p) => analyzeUrl(`${baseUrl}${p}`, strategy))
  );

  const pages: PageSpeedResult[] = results
    .filter((r): r is PromiseFulfilledResult<PageSpeedResult> => r.status === "fulfilled")
    .map((r) => r.value);

  const avgPerformance =
    pages.length > 0
      ? Math.round(pages.reduce((s, p) => s + p.performanceScore, 0) / pages.length)
      : 0;
  const avgSeo =
    pages.length > 0
      ? Math.round(pages.reduce((s, p) => s + p.seoScore, 0) / pages.length)
      : 0;
  const avgAccessibility =
    pages.length > 0
      ? Math.round(pages.reduce((s, p) => s + p.accessibilityScore, 0) / pages.length)
      : 0;

  return {
    pages,
    avgPerformance,
    avgSeo,
    avgAccessibility,
    fetchedAt: new Date().toISOString(),
  };
}

/* ── Helpers ── */

function numericValue(audit: { numericValue?: number | null } | null | undefined): number | null {
  if (!audit || audit.numericValue == null) return null;
  return Math.round(audit.numericValue * 100) / 100;
}
