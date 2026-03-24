/* ── Weekly SEO Cron Job ──
 *
 * Endpoint: GET /api/cron/seo
 *
 * Runs a full SEO cycle:
 *   1. Take a health-score snapshot (GSC + PageSpeed)
 *   2. Run the deep on-page crawler (v2: E-E-A-T, AIO, structured data, etc.)
 *   3. Generate AI insights (freshness, cannibalization, E-E-A-T, CTR)
 *   4. Score all published content (E-E-A-T + AIO readiness)
 *   5. Score all published content for AI Visibility (NEW — primary metric)
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

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
  /* ── Auth ── */
  const authHeader = req.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {};
  const errors: string[] = [];

  /* 1. Snapshot */
  try {
    results.snapshot = await takeSnapshot();
  } catch (e) {
    errors.push(`snapshot: ${e instanceof Error ? e.message : String(e)}`);
  }

  /* 2. Crawl */
  try {
    results.crawl = await runCrawl();
  } catch (e) {
    errors.push(`crawl: ${e instanceof Error ? e.message : String(e)}`);
  }

  /* 3. Insights */
  try {
    results.insights = await generateAllInsights();
  } catch (e) {
    errors.push(`insights: ${e instanceof Error ? e.message : String(e)}`);
  }

  /* 4. Score all published blog content */
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { id: true, slug: true, body: true, targetKeyword: true },
    });

    let scored = 0;
    for (const post of posts) {
      const eeat = scoreContentEEAT(post.body, post.targetKeyword || undefined);
      const aio = scoreAIOReadiness(post.body, post.targetKeyword || undefined);
      const overallScore = Math.round((eeat.score + aio.overall) / 2);

      const internalLinks = (post.body.match(/\]\(\//g) || []).length;
      const externalLinks = (post.body.match(/\]\(https?:\/\//g) || []).length;
      const wordCount = post.body.replace(/[#*_\[\]()]/g, "").split(/\s+/).filter(Boolean).length;
      const hasFaq = /^#{2,3}\s.+\?$/m.test(post.body);

      await prisma.contentScore.upsert({
        where: { pageUrl: `/blog/${post.slug}` },
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
    results.contentScoring = { scored, total: posts.length };
  } catch (e) {
    errors.push(`contentScoring: ${e instanceof Error ? e.message : String(e)}`);
  }

  /* 5. AI Visibility Scoring (primary metric) */
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { id: true, slug: true, body: true, targetKeyword: true },
    });

    let scored = 0;
    for (const post of posts) {
      const aiVis = scoreAIVisibility(post.body, post.targetKeyword || undefined);

      await prisma.aIVisibilityScore.create({
        data: {
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
    results.aiVisibility = { scored, total: posts.length };
  } catch (e) {
    errors.push(`aiVisibility: ${e instanceof Error ? e.message : String(e)}`);
  }

  /* 6. Email report */
  try {
    results.report = await sendReport();
  } catch (e) {
    errors.push(`report: ${e instanceof Error ? e.message : String(e)}`);
  }

  return NextResponse.json({
    ok: errors.length === 0,
    timestamp: new Date().toISOString(),
    results,
    errors: errors.length > 0 ? errors : undefined,
  });
}
