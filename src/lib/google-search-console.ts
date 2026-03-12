import { google } from "googleapis";

/* ── Google Search Console Integration ──
 *
 * Uses a service account to pull real ranking data.
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL  — e.g. seedtech-seo@your-project.iam.gserviceaccount.com
 *   GOOGLE_SERVICE_ACCOUNT_KEY    — The full private key (PEM), with \n line breaks
 *   GOOGLE_SEARCH_CONSOLE_SITE    — Your verified property, e.g. https://seedtechllc.com or sc-domain:seedtechllc.com
 */

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];

/** Check if Search Console credentials are configured */
export function isSearchConsoleConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY &&
    process.env.GOOGLE_SEARCH_CONSOLE_SITE
  );
}

/** Create an authenticated Search Console client */
function getClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE!;

  // GOOGLE_SERVICE_ACCOUNT_KEY can be either:
  //   1. The full service account JSON object (paste the whole .json file)
  //   2. Just the private_key PEM string with literal \n sequences
  let key: string = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!;
  try {
    // Try parsing as full JSON service account file
    const parsed = JSON.parse(key);
    if (parsed.private_key) key = parsed.private_key;
  } catch {
    // Not JSON — treat as raw PEM string, replace literal \n with real newlines
    key = key.replace(/\\n/g, "\n");
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: SCOPES,
  });
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
  rowLimit = 100
): Promise<SearchConsoleRow[]> {
  const { searchconsole, siteUrl } = getClient();

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
  rowLimit = 50
): Promise<PagePerformance[]> {
  const { searchconsole, siteUrl } = getClient();

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
  days = 28
): Promise<Record<string, number | null>> {
  const allKeywords = await getKeywordPerformance(days, 500);
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
  days = 28
): Promise<SearchConsoleSummary> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const [keywords, pages] = await Promise.all([
    getKeywordPerformance(days, 25),
    getPagePerformance(days, 15),
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
export async function testConnection(): Promise<{
  connected: boolean;
  siteUrl: string;
  message: string;
}> {
  try {
    const { searchconsole, siteUrl } = getClient();
    const res = await searchconsole.sites.get({ siteUrl });
    return {
      connected: true,
      siteUrl,
      message: `Connected. Permission level: ${res.data.permissionLevel}`,
    };
  } catch (err: any) {
    return {
      connected: false,
      siteUrl: process.env.GOOGLE_SEARCH_CONSOLE_SITE || "",
      message: err.message || "Connection failed",
    };
  }
}

/* ── Helpers ── */

function fmt(d: Date): string {
  return d.toISOString().split("T")[0];
}
