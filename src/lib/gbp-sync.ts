/* ── GBP Sync ──
 * Pulls locations, reviews, posts, and daily metrics from Google Business
 * Profile and writes to local tables. For new reviews (not previously seen
 * AND not already replied to), drafts an on-brand reply with Claude and
 * queues it as an AgentArtifact for human review.
 */

import { prisma } from "@/lib/prisma";
import {
  fetchGbpDailyMetrics,
  listGbpAccounts,
  listGbpLocalPosts,
  listGbpLocations,
  listGbpReviews,
  type GbpReviewApi,
} from "@/lib/gbp";
import { EVENT_TYPES, logEvent } from "@/lib/events";
import { createArtifact } from "@/lib/agent-artifacts";
import { getBusinessContextForSite, buildStrategyPrompt } from "@/lib/business-context";

const DRAFT_REPLY_MODEL = "claude-sonnet-4-20250514";

export interface GbpSyncResult {
  accounts: number;
  locations: number;
  reviewsUpserted: number;
  newReviewsDrafted: number;
  postsUpserted: number;
  metricsDays: number;
  errors: string[];
}

export async function syncGbpForSite(siteId: string): Promise<GbpSyncResult> {
  const result: GbpSyncResult = {
    accounts: 0,
    locations: 0,
    reviewsUpserted: 0,
    newReviewsDrafted: 0,
    postsUpserted: 0,
    metricsDays: 0,
    errors: [],
  };

  const accounts = await listGbpAccounts(siteId);
  result.accounts = accounts.length;

  for (const account of accounts) {
    let locations;
    try {
      locations = await listGbpLocations(siteId, account.name);
    } catch (e) {
      result.errors.push(`locations(${account.name}): ${(e as Error).message}`);
      continue;
    }

    for (const loc of locations) {
      // Upsert location
      const dbLoc = await prisma.gbpLocation.upsert({
        where: { siteId_locationId: { siteId, locationId: loc.name } },
        update: {
          accountId: account.name,
          title: loc.title,
          primaryCategory: loc.primaryCategory,
          storefrontAddress: loc.storefrontAddress ? JSON.stringify(loc.storefrontAddress) : null,
          primaryPhone: loc.phoneNumber,
          websiteUri: loc.websiteUri,
          serviceArea: loc.serviceArea ? JSON.stringify(loc.serviceArea) : null,
          labels: loc.labels ? JSON.stringify(loc.labels) : null,
          metadata: JSON.stringify(loc.raw),
          lastSyncedAt: new Date(),
        },
        create: {
          siteId,
          accountId: account.name,
          locationId: loc.name,
          title: loc.title,
          primaryCategory: loc.primaryCategory,
          storefrontAddress: loc.storefrontAddress ? JSON.stringify(loc.storefrontAddress) : null,
          primaryPhone: loc.phoneNumber,
          websiteUri: loc.websiteUri,
          serviceArea: loc.serviceArea ? JSON.stringify(loc.serviceArea) : null,
          labels: loc.labels ? JSON.stringify(loc.labels) : null,
          metadata: JSON.stringify(loc.raw),
          isPrimary: false,
          lastSyncedAt: new Date(),
        },
      });
      result.locations++;

      // Reviews
      try {
        const reviews = await listGbpReviews(siteId, account.name, loc.name);
        for (const r of reviews) {
          const existing = await prisma.gbpReview.findUnique({
            where: { locationId_reviewName: { locationId: dbLoc.id, reviewName: r.reviewName } },
          });
          await prisma.gbpReview.upsert({
            where: { locationId_reviewName: { locationId: dbLoc.id, reviewName: r.reviewName } },
            update: {
              reviewerName: r.reviewerName,
              rating: r.rating,
              comment: r.comment,
              reply: r.reply,
              replyAt: r.replyAt,
              updateTime: r.updateTime,
            },
            create: {
              locationId: dbLoc.id,
              reviewName: r.reviewName,
              reviewerName: r.reviewerName,
              rating: r.rating,
              comment: r.comment,
              reply: r.reply,
              replyAt: r.replyAt,
              createTime: r.createTime,
              updateTime: r.updateTime,
            },
          });
          result.reviewsUpserted++;

          // New review (not in DB before) AND not already replied → draft a reply
          if (!existing) {
            await logEvent({
              siteId,
              type: EVENT_TYPES.GBP_REVIEW_RECEIVED,
              severity: r.rating <= 3 ? "warn" : "info",
              title: `${r.rating}★ review${r.reviewerName ? ` from ${r.reviewerName}` : ""}`,
              body: r.comment ?? undefined,
              payload: { reviewName: r.reviewName, rating: r.rating, reviewer: r.reviewerName },
              entityType: "GbpReview",
              entityId: (await prisma.gbpReview.findUnique({
                where: { locationId_reviewName: { locationId: dbLoc.id, reviewName: r.reviewName } },
                select: { id: true },
              }))?.id,
            });
            if (!r.reply) {
              try {
                await draftReviewReply(siteId, dbLoc.id, dbLoc.title, r);
                result.newReviewsDrafted++;
              } catch (e) {
                result.errors.push(`draft_reply(${r.reviewName}): ${(e as Error).message}`);
              }
            }
          }
        }
      } catch (e) {
        result.errors.push(`reviews(${loc.name}): ${(e as Error).message}`);
      }

      // Local posts (no unique key on postName — use findFirst + update/create)
      try {
        const posts = await listGbpLocalPosts(siteId, account.name, loc.name);
        for (const p of posts) {
          const data = {
            topicType: p.topicType,
            summary: p.summary,
            ctaType: p.ctaType,
            ctaUrl: p.ctaUrl,
            mediaUrl: p.mediaUrl,
            state: p.state === "LIVE" ? "published" : p.state.toLowerCase(),
            searchUrl: p.searchUrl,
            publishedAt: p.state === "LIVE" ? p.createTime : null,
          };
          const existing = await prisma.gbpPost.findFirst({
            where: { locationId: dbLoc.id, postName: p.name },
            select: { id: true },
          });
          if (existing) {
            await prisma.gbpPost.update({ where: { id: existing.id }, data });
          } else {
            await prisma.gbpPost.create({
              data: { locationId: dbLoc.id, postName: p.name, ...data },
            });
          }
          result.postsUpserted++;
        }
      } catch (e) {
        result.errors.push(`posts(${loc.name}): ${(e as Error).message}`);
      }

      // Metrics
      try {
        const days = await fetchGbpDailyMetrics(siteId, loc.name, { days: 7 });
        for (const d of days) {
          await prisma.gbpMetricsDaily.upsert({
            where: { locationId_date: { locationId: dbLoc.id, date: new Date(d.date) } },
            update: mapMetrics(d.metrics),
            create: { locationId: dbLoc.id, date: new Date(d.date), ...mapMetrics(d.metrics) },
          });
          result.metricsDays++;
        }
      } catch (e) {
        result.errors.push(`metrics(${loc.name}): ${(e as Error).message}`);
      }
    }
  }

  return result;
}

function mapMetrics(m: Record<string, number | undefined>) {
  return {
    businessImpressionsDesktopMaps: m.BUSINESS_IMPRESSIONS_DESKTOP_MAPS ?? 0,
    businessImpressionsDesktopSearch: m.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH ?? 0,
    businessImpressionsMobileMaps: m.BUSINESS_IMPRESSIONS_MOBILE_MAPS ?? 0,
    businessImpressionsMobileSearch: m.BUSINESS_IMPRESSIONS_MOBILE_SEARCH ?? 0,
    callClicks: m.CALL_CLICKS ?? 0,
    websiteClicks: m.WEBSITE_CLICKS ?? 0,
    drivingDirections: m.BUSINESS_DIRECTION_REQUESTS ?? 0,
    businessBookings: m.BUSINESS_BOOKINGS ?? 0,
    businessConversations: m.BUSINESS_CONVERSATIONS ?? 0,
    businessFoodOrders: m.BUSINESS_FOOD_ORDERS ?? 0,
    businessFoodMenuClicks: m.BUSINESS_FOOD_MENU_CLICKS ?? 0,
  };
}

async function draftReviewReply(
  siteId: string,
  dbLocationId: string,
  locationTitle: string,
  review: GbpReviewApi
): Promise<void> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY not configured");

  const businessCtx = await getBusinessContextForSite(siteId);
  const businessPrompt = buildStrategyPrompt(businessCtx);

  const prompt = `You are drafting a reply to a Google Business Profile review on behalf of the business below. The reply will be reviewed by a human before it is posted.

═══ BUSINESS CONTEXT ═══
${businessPrompt}

═══ THE REVIEW ═══
Location: ${locationTitle}
Reviewer: ${review.reviewerName ?? "Anonymous"}
Rating: ${review.rating}★
Comment: ${review.comment ?? "(no text)"}

═══ TASK ═══
Write a single reply, 40–90 words. Rules:
- Match the brand voice in the business context
- Address the reviewer by first name if provided
- For 4–5 star reviews: warm thanks, reference something specific in their comment, and a soft invitation back
- For 1–3 star reviews: acknowledge the concern empathetically, take ownership without making excuses, offer a concrete next step (call, email, or DM) using the business contact info if present in context
- Never argue with the reviewer or dispute facts
- Never include URLs unless the business context explicitly provides one to share
- Sign off with the business name from context

Return ONLY the reply text. No preamble, no markdown, no quotes around it.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: DRAFT_REPLY_MODEL,
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const draft = (data.content?.[0]?.text ?? "").trim();
  if (!draft) throw new Error("Empty draft");

  const dbReview = await prisma.gbpReview.findUnique({
    where: { locationId_reviewName: { locationId: dbLocationId, reviewName: review.reviewName } },
    select: { id: true },
  });

  await createArtifact({
    siteId,
    agent: "gbp-review-reply",
    type: "review_reply_draft",
    title: `Reply to ${review.rating}★ review${review.reviewerName ? ` from ${review.reviewerName}` : ""}`,
    summary: review.comment ?? undefined,
    payload: {
      reviewName: review.reviewName,
      reply: draft,
      rating: review.rating,
      reviewerName: review.reviewerName,
      locationTitle,
    },
    entityType: "GbpReview",
    entityId: dbReview?.id,
  });
}
