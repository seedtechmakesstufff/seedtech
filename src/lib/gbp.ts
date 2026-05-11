/* ── Google Business Profile API ──
 * GBP is split across multiple Google APIs. This file wraps the four we use:
 *   1. Account Management (mybusinessaccountmanagement v1) — list accounts
 *   2. Business Information (mybusinessbusinessinformation v1) — list locations
 *   3. Performance (businessprofileperformance v1) — daily metrics
 *   4. Legacy v4 (mybusiness.googleapis.com/v4) — reviews + local posts
 *
 * Reviews and local posts are still only available on the v4 endpoint as of
 * Apr 2026. We call them with the OAuth2 access token directly.
 */

import { google } from "googleapis";
import { getAuthorizedClient, getStoredOAuthCredential } from "@/lib/google-oauth";

const STAR_RATING_TO_INT: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

async function getClients(siteId: string) {
  const stored = await getStoredOAuthCredential(siteId, "google_business_profile");
  if (!stored) throw new Error("Google Business Profile not connected for this site");
  const auth = getAuthorizedClient(stored.refresh_token);
  return { auth };
}

async function getAccessToken(siteId: string): Promise<string> {
  const { auth } = await getClients(siteId);
  const t = await auth.getAccessToken();
  if (!t.token) throw new Error("Failed to obtain GBP access token");
  return t.token;
}

export interface GbpAccount {
  name: string;          // e.g. "accounts/12345"
  accountName: string;
  type: string;
}

export async function listGbpAccounts(siteId: string): Promise<GbpAccount[]> {
  const { auth } = await getClients(siteId);
  const client = google.mybusinessaccountmanagement({ version: "v1", auth });
  const out: GbpAccount[] = [];
  let pageToken: string | undefined;
  do {
    const res = await client.accounts.list({ pageSize: 100, pageToken });
    for (const a of res.data.accounts ?? []) {
      if (!a.name) continue;
      out.push({
        name: a.name,
        accountName: a.accountName ?? a.name,
        type: a.type ?? "PERSONAL",
      });
    }
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);
  return out;
}

export interface GbpLocationApi {
  name: string;            // "locations/67890"
  title: string;
  primaryCategory?: string;
  storefrontAddress?: unknown;
  phoneNumber?: string;
  websiteUri?: string;
  serviceArea?: unknown;
  labels?: string[];
  raw: unknown;
}

export async function listGbpLocations(
  siteId: string,
  accountName: string
): Promise<GbpLocationApi[]> {
  const { auth } = await getClients(siteId);
  const client = google.mybusinessbusinessinformation({ version: "v1", auth });
  const out: GbpLocationApi[] = [];
  let pageToken: string | undefined;
  do {
    const res = await client.accounts.locations.list({
      parent: accountName,
      pageSize: 100,
      pageToken,
      readMask:
        "name,title,storefrontAddress,phoneNumbers,websiteUri,categories,serviceArea,labels",
    });
    for (const l of res.data.locations ?? []) {
      if (!l.name) continue;
      out.push({
        name: l.name.startsWith("locations/") ? l.name : `locations/${l.name}`,
        title: l.title ?? "(untitled)",
        primaryCategory: l.categories?.primaryCategory?.displayName ?? undefined,
        storefrontAddress: l.storefrontAddress ?? undefined,
        phoneNumber: l.phoneNumbers?.primaryPhone ?? undefined,
        websiteUri: l.websiteUri ?? undefined,
        serviceArea: l.serviceArea ?? undefined,
        labels: l.labels ?? undefined,
        raw: l,
      });
    }
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);
  return out;
}

export interface GbpReviewApi {
  reviewName: string;      // "accounts/x/locations/y/reviews/z"
  reviewerName: string | null;
  rating: number;          // 1-5
  comment: string | null;
  reply: string | null;
  replyAt: Date | null;
  createTime: Date;
  updateTime: Date;
}

export async function listGbpReviews(
  siteId: string,
  accountName: string,
  locationResource: string
): Promise<GbpReviewApi[]> {
  const token = await getAccessToken(siteId);
  const out: GbpReviewApi[] = [];
  let pageToken: string | undefined;
  do {
    const url = new URL(
      `https://mybusiness.googleapis.com/v4/${accountName}/${locationResource}/reviews`
    );
    url.searchParams.set("pageSize", "50");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`GBP reviews list failed: ${res.status} ${await res.text()}`);
    }
    const json = (await res.json()) as {
      reviews?: Array<{
        name?: string;
        reviewer?: { displayName?: string };
        starRating?: string;
        comment?: string;
        createTime?: string;
        updateTime?: string;
        reviewReply?: { comment?: string; updateTime?: string };
      }>;
      nextPageToken?: string;
    };
    for (const r of json.reviews ?? []) {
      if (!r.name) continue;
      out.push({
        reviewName: r.name,
        reviewerName: r.reviewer?.displayName ?? null,
        rating: STAR_RATING_TO_INT[r.starRating ?? ""] ?? 0,
        comment: r.comment ?? null,
        reply: r.reviewReply?.comment ?? null,
        replyAt: r.reviewReply?.updateTime ? new Date(r.reviewReply.updateTime) : null,
        createTime: r.createTime ? new Date(r.createTime) : new Date(),
        updateTime: r.updateTime ? new Date(r.updateTime) : new Date(),
      });
    }
    pageToken = json.nextPageToken;
  } while (pageToken);
  return out;
}

export interface GbpLocalPostApi {
  name: string;
  topicType: string;
  summary: string;
  ctaType: string | null;
  ctaUrl: string | null;
  mediaUrl: string | null;
  state: string;
  searchUrl: string | null;
  createTime: Date;
  updateTime: Date;
}

export async function listGbpLocalPosts(
  siteId: string,
  accountName: string,
  locationResource: string
): Promise<GbpLocalPostApi[]> {
  const token = await getAccessToken(siteId);
  const out: GbpLocalPostApi[] = [];
  let pageToken: string | undefined;
  do {
    const url = new URL(
      `https://mybusiness.googleapis.com/v4/${accountName}/${locationResource}/localPosts`
    );
    url.searchParams.set("pageSize", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`GBP localPosts list failed: ${res.status} ${await res.text()}`);
    }
    const json = (await res.json()) as {
      localPosts?: Array<{
        name?: string;
        topicType?: string;
        summary?: string;
        callToAction?: { actionType?: string; url?: string };
        media?: Array<{ sourceUrl?: string }>;
        state?: string;
        searchUrl?: string;
        createTime?: string;
        updateTime?: string;
      }>;
      nextPageToken?: string;
    };
    for (const p of json.localPosts ?? []) {
      if (!p.name) continue;
      out.push({
        name: p.name,
        topicType: p.topicType ?? "STANDARD",
        summary: p.summary ?? "",
        ctaType: p.callToAction?.actionType ?? null,
        ctaUrl: p.callToAction?.url ?? null,
        mediaUrl: p.media?.[0]?.sourceUrl ?? null,
        state: p.state ?? "UNKNOWN",
        searchUrl: p.searchUrl ?? null,
        createTime: p.createTime ? new Date(p.createTime) : new Date(),
        updateTime: p.updateTime ? new Date(p.updateTime) : new Date(),
      });
    }
    pageToken = json.nextPageToken;
  } while (pageToken);
  return out;
}

const PERFORMANCE_METRICS = [
  "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
  "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
  "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
  "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
  "CALL_CLICKS",
  "WEBSITE_CLICKS",
  "BUSINESS_DIRECTION_REQUESTS",
  "BUSINESS_BOOKINGS",
  "BUSINESS_CONVERSATIONS",
  "BUSINESS_FOOD_ORDERS",
  "BUSINESS_FOOD_MENU_CLICKS",
] as const;

export type GbpMetricKey = (typeof PERFORMANCE_METRICS)[number];

export interface GbpDailyMetricRow {
  date: string;          // YYYY-MM-DD
  metrics: Partial<Record<GbpMetricKey, number>>;
}

export async function fetchGbpDailyMetrics(
  siteId: string,
  locationResource: string,
  options?: { days?: number }
): Promise<GbpDailyMetricRow[]> {
  const token = await getAccessToken(siteId);
  const days = options?.days ?? 7;
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1); // yesterday — performance data is lagged
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const url = new URL(
    `https://businessprofileperformance.googleapis.com/v1/${locationResource}:fetchMultiDailyMetricsTimeSeries`
  );
  for (const m of PERFORMANCE_METRICS) url.searchParams.append("dailyMetrics", m);
  url.searchParams.set("dailyRange.startDate.year", String(start.getUTCFullYear()));
  url.searchParams.set("dailyRange.startDate.month", String(start.getUTCMonth() + 1));
  url.searchParams.set("dailyRange.startDate.day", String(start.getUTCDate()));
  url.searchParams.set("dailyRange.endDate.year", String(end.getUTCFullYear()));
  url.searchParams.set("dailyRange.endDate.month", String(end.getUTCMonth() + 1));
  url.searchParams.set("dailyRange.endDate.day", String(end.getUTCDate()));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`GBP performance fetch failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as {
    multiDailyMetricTimeSeries?: Array<{
      dailyMetricTimeSeries?: Array<{
        dailyMetric?: GbpMetricKey;
        timeSeries?: { datedValues?: Array<{ date?: { year?: number; month?: number; day?: number }; value?: string }> };
      }>;
    }>;
  };

  const byDate = new Map<string, Partial<Record<GbpMetricKey, number>>>();
  for (const series of json.multiDailyMetricTimeSeries ?? []) {
    for (const ds of series.dailyMetricTimeSeries ?? []) {
      const metric = ds.dailyMetric;
      if (!metric) continue;
      for (const dv of ds.timeSeries?.datedValues ?? []) {
        const d = dv.date;
        if (!d?.year || !d.month || !d.day) continue;
        const key = `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
        const cur = byDate.get(key) ?? {};
        cur[metric] = parseInt(dv.value ?? "0", 10) || 0;
        byDate.set(key, cur);
      }
    }
  }
  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, metrics]) => ({ date, metrics }));
}

/**
 * Validate that a CTA URL is safe to publish — must be on the site's own
 * domain, the location's website URI, or a normalized empty value.
 * Throws on invalid input so the publisher refuses to push bad URLs to GBP.
 */
export async function validateGbpCtaUrl(
  siteId: string,
  ctaUrl: string | null | undefined,
  locationWebsite?: string | null
): Promise<void> {
  if (!ctaUrl) return;
  let parsed: URL;
  try {
    parsed = new URL(ctaUrl);
  } catch {
    throw new Error(`Invalid CTA URL: ${ctaUrl}`);
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`CTA URL must be http(s): ${ctaUrl}`);
  }

  // Build the allowlist of acceptable hostnames
  const { prisma } = await import("@/lib/prisma");
  const [site, biz] = await Promise.all([
    prisma.site.findUnique({ where: { id: siteId }, select: { domain: true, siteUrl: true } }),
    prisma.businessProfile.findUnique({ where: { siteId }, select: { domain: true } }),
  ]);
  const allowed = new Set<string>();
  const add = (raw: string | null | undefined) => {
    if (!raw) return;
    try {
      const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
      allowed.add(u.hostname.replace(/^www\./, ""));
    } catch {
      /* ignore malformed entries */
    }
  };
  add(site?.domain);
  add(site?.siteUrl);
  add(biz?.domain);
  add(locationWebsite);

  const host = parsed.hostname.replace(/^www\./, "");
  if (!allowed.has(host)) {
    throw new Error(
      `CTA URL host '${parsed.hostname}' is not on the site's allowlist (${Array.from(allowed).join(", ") || "empty"}). Refusing to publish.`
    );
  }
}

/**
 * Create a Local Post on a GBP location. Used by the gbp_post_draft publisher.
 * Returns the created post resource name and search URL.
 */
export async function createGbpLocalPost(
  siteId: string,
  accountResource: string,
  locationResource: string,
  body: {
    topicType: "STANDARD" | "EVENT" | "OFFER" | "ALERT";
    summary: string;
    ctaType?: string | null;
    ctaUrl?: string | null;
    mediaUrl?: string | null;
  }
): Promise<{ name: string; searchUrl: string | null }> {
  const token = await getAccessToken(siteId);
  const url = `https://mybusiness.googleapis.com/v4/${accountResource}/${locationResource}/localPosts`;
  const payload: Record<string, unknown> = {
    topicType: body.topicType,
    summary: body.summary,
    languageCode: "en",
  };
  if (body.ctaType && body.ctaUrl) {
    payload.callToAction = { actionType: body.ctaType, url: body.ctaUrl };
  }
  // GBP v4 accepts media[] with a sourceUrl pointing to a publicly accessible image
  if (body.mediaUrl) {
    payload.media = [{ mediaFormat: "PHOTO", sourceUrl: body.mediaUrl }];
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`GBP localPost create failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { name?: string; searchUrl?: string };
  if (!json.name) throw new Error("GBP localPost create returned no resource name");
  return { name: json.name, searchUrl: json.searchUrl ?? null };
}

/** Reply to a GBP review. Used by the artifact publish flow. */
export async function replyToGbpReview(
  siteId: string,
  reviewName: string,
  comment: string
): Promise<void> {
  const token = await getAccessToken(siteId);
  const res = await fetch(`https://mybusiness.googleapis.com/v4/${reviewName}/reply`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
  });
  if (!res.ok) {
    throw new Error(`GBP review reply failed: ${res.status} ${await res.text()}`);
  }
}
