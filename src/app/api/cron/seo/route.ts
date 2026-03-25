/* ── Weekly SEO Cron Job ──
 *
 * Endpoint: GET /api/cron/seo
 *
 * Runs a full SEO cycle for one site (?siteId=xxx) or ALL active sites:
 *   1. Take a health-score snapshot (GSC + PageSpeed)
 *   2. Run the deep on-page crawler (v2: E-E-A-T, AIO, structured data, etc.)
 *   3. Generate AI insights (freshness, cannibalization, E-E-A-T, CTR)
 *   4. Score all published content (E-E-A-T + AIO readiness)
 *   5. Score all published content for AI Visibility (primary metric)
 *   6. Build & send the weekly email report
 *
 * Auth: Requires CRON_SECRET header (set as env var).
 *       Vercel Cron automatically sends this header.
 *
 * Vercel cron config (vercel.json):
 *   { "crons": [{ "path": "/api/cron/seo", "schedule": "0 6 * * 1" }] }
 *   → Every Monday at 6 AM UTC
 */

import { NextRequest, NextResponse } from "next/server";
import { takeSnapshot } from "@/lib/seo-snapshot";
import { runCrawl } from "@/lib/seo-crawler";
import { generateAllInsights } from "@/lib/seo-insights";
import { sendReport } from "@/lib/seo-reports";
import { prisma } from "@/lib/prisma";
import { scoreContentEEAT } from "@/lib/seo-eeat";
import { scoreAIOReadiness } from "@/lib/seo-aio";
import { scoreAIVisibility } from "@/lib/ai-visibility";
import { getBusinessContextForSite } from "@/lib/business-context";
import { authenticateCron, getCronSiteId, getAllActiveSiteIds, runTrackedJob } from "@/lib/cron-runner";
import { loadSiteScoringConfig, type SiteScoringConfig } from "@/lib/site-scoring-config";

export async function GET(req: NextRequest) {
  /* ── Auth ── */
  const authErr = authenticateCron(req);
  if (authErr) return authErr;

  // Determine target sites
  const requestedSiteId = getCronSiteId(req);
  const siteIds = requestedSiteId
    ? [requestedSiteId]
    : await getAllActiveSiteIds();

  const allResults: Record<string, unknown> = {};

  for (const siteId of siteIds) {
    allResults[siteId] = await runSiteSeoCron(siteId);
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    sites: allResults,
  });
}

async function runSiteSeoCron(siteId: string) {
  const results: Record<string, unknown> = {};
  const errors: string[] = [];

  // Load site-specific config for scoring
  let siteConfig: SiteScoringConfig | undefined;
  let brandName = "Company";
  try {
    siteConfig = await loadSiteScoringConfig(siteId);
    brandName = siteConfig.brandName;
  } catch {
    try {
      const ctx = await getBusinessContextForSite(siteId);
      brandName = ctx.companyName;
    } catch { /* use default */ }
  }

  /* 1. Snapshot */
  const snapResult = await runTrackedJob(siteId, "snapshot", () => takeSnapshot(siteId));
  results.snapshot = snapResult.success ? snapResult.result : { error: snapResult.error };
  if (!snapResult.success) errors.push(`snapshot: ${snapResult.error}`);

  /* 2. Crawl */
  const crawlResult = await runTrackedJob(siteId, "crawl", () => runCrawl(siteId));
  results.crawl = crawlResult.success ? crawlResult.result : { error: crawlResult.error };
  if (!crawlResult.success) errors.push(`crawl: ${crawlResult.error}`);

  /* 3. Insights */
  const insightsResult = await runTrackedJob(siteId, "insights", () => generateAllInsights(siteId));
  results.insights = insightsResult.success ? insightsResult.result : { error: insightsResult.error };
  if (!insightsResult.success) errors.push(`insights: ${insightsResult.error}`);

  /* 4. Score all published blog content */
  const scoreResult = await runTrackedJob(siteId, "content_scoring", async () => {
    const posts = await prisma.blogPost.findMany({
      where: { siteId, status: "published" },
      select: { id: true, slug: true, body: true, targetKeyword: true },
    });

    let scored = 0;
    for (const post of posts) {
      const eeat = scoreContentEEAT(post.body, post.targetKeyword || undefined, siteConfig);
      const aio = scoreAIOReadiness(post.body, post.targetKeyword || undefined);
      const overallScore = Math.round((eeat.score + aio.overall) / 2);

      const internalLinks = (post.body.match(/\]\(\//g) || []).length;
      const externalLinks = (post.body.match(/\]\(https?:\/\//g) || []).length;
      const wordCount = post.body.replace(/[#*_\[\]()]/g, "").split(/\s+/).filter(Boolean).length;
      const hasFaq = /^#{2,3}\s.+\?$/m.test(post.body);

      await prisma.contentScore.upsert({
        where: { siteId_pageUrl: { siteId, pageUrl: `/blog/${post.slug}` } },
        update: {
          eeatScore: eeat.score,
          aioScore: aio.overall,
          overallScore,
          wordCount,
          internalLinks,
          externalLinks,
          hasFaq,
          blogPostId: post.id,
          issues: JSON.parse(JSON.stringify([
            ...eeat.issues.map((i) => ({ type: "eeat", message: i, severity: "warning" })),
            ...aio.issues.filter((i) => !i.passed).map((i) => ({ type: "aio", message: i.message, severity: "warning" })),
          ])),
          scoredAt: new Date(),
        },
        create: {
          siteId,
          pageUrl: `/blog/${post.slug}`,
          eeatScore: eeat.score,
          aioScore: aio.overall,
          overallScore,
          wordCount,
          internalLinks,
          externalLinks,
          hasFaq,
          blogPostId: post.id,
          issues: JSON.parse(JSON.stringify([
            ...eeat.issues.map((i) => ({ type: "eeat", message: i, severity: "warning" })),
            ...aio.issues.filter((i) => !i.passed).map((i) => ({ type: "aio", message: i.message, severity: "warning" })),
          ])),
        },
      });
      scored++;
    }
    return { scored, total: posts.length };
  });
  results.contentScoring = scoreResult.success ? scoreResult.result : { error: scoreResult.error };
  if (!scoreResult.success) errors.push(`contentScoring: ${scoreResult.error}`);

  /* 5. AI Visibility Scoring (primary metric) */
  const aiVisResult = await runTrackedJob(siteId, "ai_visibility", async () => {
    const posts = await prisma.blogPost.findMany({
      where: { siteId, status: "published" },
      select: { id: true, slug: true, body: true, targetKeyword: true },
    });

    let scored = 0;
    for (const post of posts) {
      const aiVis = scoreAIVisibility(post.body, post.targetKeyword || undefined, brandName, siteConfig);

      await prisma.aIVisibilityScore.create({
        data: {
          siteId,
          pageUrl: `/blog/${post.slug}`,
          overallScore: aiVis.overall,
          citationReadiness: aiVis.citationReadiness,
          entityAuthority: aiVis.entityAuthority,
          structuredClarity: aiVis.structuredClarity,
          conversationalFit: aiVis.conversationalFit,
          multiEngineCoverage: aiVis.multiEngineCoverage,
          grade: aiVis.grade,
          failedChecks: aiVis.checks
            .filter((c) => !c.passed)
            .map((c) => ({ check: c.check, category: c.category, fix: c.fix })),
        },
      });
      scored++;
    }
    return { scored, total: posts.length };
  });
  results.aiVisibility = aiVisResult.success ? aiVisResult.result : { error: aiVisResult.error };
  if (!aiVisResult.success) errors.push(`aiVisibility: ${aiVisResult.error}`);

  /* 6. Email report */
  const reportResult = await runTrackedJob(siteId, "report", () => sendReport(siteId));
  results.report = reportResult.success ? reportResult.result : { error: reportResult.error };
  if (!reportResult.success) errors.push(`report: ${reportResult.error}`);

  return { ok: errors.length === 0, results, errors: errors.length > 0 ? errors : undefined };
}
