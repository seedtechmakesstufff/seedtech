import { google } from "googleapis";
import type { SearchConsoleIntegration } from "@/lib/site-data";

/* ── Google Search Console Integration ──
 *
 * Supports two modes:
 *   1. DB-backed: pass a SearchConsoleIntegration from IntegrationCredential
 *   2. Env-backed: falls back to global env vars (single-tenant compat)
 *
 * Env vars (fallback):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_SERVICE_ACCOUNT_KEY   — full PEM or full JSON service account
 *   GOOGLE_SEARCH_CONSOLE_SITE   — e.g. https://seedtechllc.com or sc-domain:seedtechllc.com
 */

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];

/** Check if Search Console is available (env or integration) */
export function isSearchConsoleConfigured(
  integration?: SearchConsoleIntegration | null
): boolean {
  if (integration) return true;
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY &&
    process.env.GOOGLE_SEARCH_CONSOLE_SITE
  );
}

/** Create an authenticated Search Console client */
function getClient(integration?: SearchConsoleIntegration | null) {
  let email: string;
  let key: string;
  let siteUrl: string;

  if (integration) {
    siteUrl = integration.property;
    try {
      const parsed = JSON.parse(integration.credentials);
      email = parsed.client_email;
      key = parsed.private_key;
    } catch {
      email = "";
      key = integration.credentials.replace(/\\n/g, "\n");
    }
  } else {
    email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
    siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE!;
    key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!;
    try {
      const parsed = JSON.parse(key);
      if (parsed.private_key) key = parsed.private_key;
      if (parsed.client_email) email = parsed.client_email;
    } catch {
      key = key.replace(/\\n/g, "\n");
    }
  }

  const auth = new google.auth.JWT({ email, key, scopes: SCOPES });
  const searchconsole = google.searchconsole({ version: "v1", auth });

  return { searchconsole, siteUrl };
}

/* ── Data Types ── */

export interface SearchConsoleRow {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PagePerformance {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleSummary {
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
  topKeywords: SearchConsoleRow[];
  topPages: PagePerformance[];
  dateRange: { start: string; end: string };
}

/* ── API Methods ── */

/**
 * Fetch top keywords for the last N days.
 */
export async function getKeywordPerformance(
  days = 28,
  rowLimit = 100,
  integration?: SearchConsoleIntegration | null
): Promise<SearchConsoleRow[]> {
  const { searchconsole, siteUrl } = getClient(integration);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: fmt(startDate),
      endDate: fmt(endDate),
      dimensions: ["query"],
      rowLimit,
      type: "web",
    },
  });

  return (res.data.rows ?? []).map((r) => ({
    keyword: r.keys![0],
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: Math.round((r.position ?? 0) * 10) / 10,
  }));
}

/**
 * Fetch performance by page (URL).
 */
export async function getPagePerformance(
  days = 28,
  rowLimit = 50,
  integration?: SearchConsoleIntegration | null
): Promise<PagePerformance[]> {
  const { searchconsole, siteUrl } = getClient(integration);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: fmt(startDate),
      endDate: fmt(endDate),
      dimensions: ["page"],
      rowLimit,
      type: "web",
    },
  });

  return (res.data.rows ?? []).map((r) => ({
    page: r.keys![0],
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: Math.round((r.position ?? 0) * 10) / 10,
  }));
}

/**
 * Get the position for specific tracked keywords.
 * Returns a map: keyword → position (or null if not found).
 */
export async function getTrackedKeywordPositions(
  keywords: string[],
  days = 28,
  integration?: SearchConsoleIntegration | null
): Promise<Record<string, number | null>> {
  const allKeywords = await getKeywordPerformance(days, 500, integration);
  const map: Record<string, number | null> = {};

  for (const kw of keywords) {
    const lower = kw.toLowerCase();
    const found = allKeywords.find(
      (r) => r.keyword.toLowerCase() === lower
    );
    map[kw] = found ? found.position : null;
  }

  return map;
}

/**
 * Full summary — overview stats, top keywords, top pages.
 */
export async function getSearchConsoleSummary(
  days = 28,
  integration?: SearchConsoleIntegration | null
): Promise<SearchConsoleSummary> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const [keywords, pages] = await Promise.all([
    getKeywordPerformance(days, 25, integration),
    getPagePerformance(days, 15, integration),
  ]);

  const totalClicks = keywords.reduce((s, r) => s + r.clicks, 0);
  const totalImpressions = keywords.reduce((s, r) => s + r.impressions, 0);
  const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const avgPosition =
    keywords.length > 0
      ? keywords.reduce((s, r) => s + r.position, 0) / keywords.length
      : 0;

  return {
    totalClicks,
    totalImpressions,
    avgCtr: Math.round(avgCtr * 1000) / 1000,
    avgPosition: Math.round(avgPosition * 10) / 10,
    topKeywords: keywords,
    topPages: pages,
    dateRange: { start: fmt(startDate), end: fmt(endDate) },
  };
}

/**
 * Quick test — verifies the service account can access the property.
 */
export async function testConnection(
  integration?: SearchConsoleIntegration | null
): Promise<{
  connected: boolean;
  siteUrl: string;
  message: string;
}> {
  try {
    const { searchconsole, siteUrl } = getClient(integration);
    const res = await searchconsole.sites.get({ siteUrl });
    return {
      connected: true,
      siteUrl,
      message: `Connected. Permission level: ${res.data.permissionLevel}`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Connection failed";
    return {
      connected: false,
      siteUrl: integration?.property || process.env.GOOGLE_SEARCH_CONSOLE_SITE || "",
      message,
    };
  }
}

/**
 * List all sites the service account has access to.
 * Useful for debugging — shows the exact siteUrl format needed.
 */
export async function listSites(
  integration?: SearchConsoleIntegration | null
): Promise<string[]> {
  try {
    const { searchconsole } = getClient(integration);
    const res = await searchconsole.sites.list();
    const entries = (res.data.siteEntry || []) as Array<{ siteUrl?: string }>;
    return entries.map((s) => s.siteUrl || "");
  } catch {
    return [];
  }
}

/* ── Helpers ── */

function fmt(d: Date): string {
  return d.toISOString().split("T")[0];
}
