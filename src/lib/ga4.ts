/* ── Google Analytics 4 ──
 * Wraps two GA4 APIs:
 *   - Analytics Admin (analyticsadmin v1beta): list properties the user can see
 *   - Analytics Data (analyticsdata v1beta): run reports
 *
 * All calls go through an OAuth2 client primed with a refresh token from
 * IntegrationCredential. Property selection is stored in `IntegrationCredential.property`
 * as the GA4 property resource name (e.g. "properties/123456789").
 */

import { google } from "googleapis";
import { getAuthorizedClient, getStoredOAuthCredential } from "@/lib/google-oauth";

export interface Ga4PropertyOption {
  property: string;        // e.g. "properties/123456789"
  displayName: string;     // user-friendly property name
  accountName: string;     // e.g. "accounts/789"
  accountDisplayName: string;
}

/**
 * List all GA4 properties the connected Google user has access to,
 * flattened across accounts.
 */
export async function listGa4Properties(siteId: string): Promise<Ga4PropertyOption[]> {
  const stored = await getStoredOAuthCredential(siteId, "google_analytics");
  if (!stored) {
    throw new Error("GA4 not connected for this site");
  }

  const auth = getAuthorizedClient(stored.refresh_token);
  const admin = google.analyticsadmin({ version: "v1beta", auth });

  const out: Ga4PropertyOption[] = [];
  let pageToken: string | undefined;

  do {
    const res = await admin.accountSummaries.list({ pageSize: 200, pageToken });
    for (const account of res.data.accountSummaries ?? []) {
      for (const prop of account.propertySummaries ?? []) {
        if (!prop.property) continue;
        out.push({
          property: prop.property,
          displayName: prop.displayName ?? prop.property,
          accountName: account.account ?? "",
          accountDisplayName: account.displayName ?? "",
        });
      }
    }
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  return out;
}

export interface Ga4DailyPageRow {
  date: string;            // YYYY-MM-DD
  pagePath: string;
  sessions: number;
  users: number;
  engagedSessions: number;
  engagementRate: number;
  averageEngagementTime: number;  // seconds
  bounceRate: number;
  conversions: number;
  revenue: number;
}

/**
 * Pull daily page-level metrics for the given date range.
 * Defaults to last 7 days, ending yesterday (GA4 data is lagged ~24-48h).
 */
export async function fetchGa4DailyPageMetrics(
  siteId: string,
  property: string,
  options?: { startDate?: string; endDate?: string; limit?: number }
): Promise<Ga4DailyPageRow[]> {
  const stored = await getStoredOAuthCredential(siteId, "google_analytics");
  if (!stored) {
    throw new Error("GA4 not connected for this site");
  }

  const auth = getAuthorizedClient(stored.refresh_token);
  const data = google.analyticsdata({ version: "v1beta", auth });

  const startDate = options?.startDate ?? "7daysAgo";
  const endDate = options?.endDate ?? "yesterday";
  const limit = options?.limit ?? 10000;

  const res = await data.properties.runReport({
    property,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }, { name: "pagePath" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "engagedSessions" },
        { name: "engagementRate" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
        { name: "conversions" },
        { name: "totalRevenue" },
      ],
      limit: String(limit),
    },
  });

  const rows = res.data.rows ?? [];
  const out: Ga4DailyPageRow[] = [];

  for (const r of rows) {
    const dims = r.dimensionValues ?? [];
    const mets = r.metricValues ?? [];
    if (dims.length < 2 || mets.length < 8) continue;

    const dateStr = dims[0]?.value ?? "";
    const pagePath = dims[1]?.value ?? "";
    if (dateStr.length !== 8 || !pagePath) continue;

    out.push({
      date: `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`,
      pagePath,
      sessions: parseInt(mets[0]?.value ?? "0", 10) || 0,
      users: parseInt(mets[1]?.value ?? "0", 10) || 0,
      engagedSessions: parseInt(mets[2]?.value ?? "0", 10) || 0,
      engagementRate: parseFloat(mets[3]?.value ?? "0") || 0,
      averageEngagementTime: parseFloat(mets[4]?.value ?? "0") || 0,
      bounceRate: parseFloat(mets[5]?.value ?? "0") || 0,
      conversions: parseInt(mets[6]?.value ?? "0", 10) || 0,
      revenue: parseFloat(mets[7]?.value ?? "0") || 0,
    });
  }

  return out;
}

/** The configured GA4 property resource name for a site, or null if not yet selected. */
export async function getGa4PropertyForSite(siteId: string): Promise<string | null> {
  const { prisma } = await import("@/lib/prisma");
  const row = await prisma.integrationCredential.findUnique({
    where: { siteId_type: { siteId, type: "google_analytics" } },
    select: { property: true, isActive: true, authType: true },
  });
  if (!row?.isActive || row.authType !== "oauth" || !row.property) return null;
  return row.property;
}
