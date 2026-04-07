/* ── Streaming Competitor Analysis ──
 * POST /api/admin/seo/competitors/analysis/stream
 * Streams progress as each competitor page is analyzed.
 * Returns SSE events: { type, data }
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { NextResponse } from "next/server";

export const maxDuration = 120; // 2 min max for analysis

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { competitorId } = body;

  if (!competitorId) {
    return NextResponse.json({ error: "competitorId is required" }, { status: 400 });
  }

  const competitor = await prisma.competitorDomain.findFirst({
    where: { id: competitorId, siteId },
  });

  if (!competitor) {
    return NextResponse.json({ error: "Competitor not found" }, { status: 404 });
  }

  // Dynamically import heavy modules
  const { analyzeCompetitorPage, discoverCompetitorPages } = await import("@/lib/competitive-intel");
  const { loadSiteScoringConfig } = await import("@/lib/site-scoring-config");

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        // Phase 1: Discover pages
        send({ type: "phase", phase: "discovering", message: `Discovering pages on ${competitor.domain}…` });

        const urls = await discoverCompetitorPages(competitor.domain, 15);
        send({ type: "discovered", count: urls.length, urls: urls.slice(0, 5) });

        if (urls.length === 0) {
          send({ type: "error", message: "Could not discover any pages on this domain." });
          send({ type: "done", pagesAnalyzed: 0, avgScore: 0 });
          controller.close();
          return;
        }

        // Load site config
        let siteConfig;
        try {
          siteConfig = await loadSiteScoringConfig(siteId);
        } catch { /* defaults */ }

        // Phase 2: Analyze each page
        send({ type: "phase", phase: "analyzing", message: `Analyzing ${urls.length} pages…`, total: urls.length });

        let analyzed = 0;
        let totalScore = 0;
        let errors = 0;

        for (let i = 0; i < urls.length; i++) {
          const url = urls[i];
          send({ type: "page_start", index: i, url, total: urls.length });

          try {
            const result = await analyzeCompetitorPage(url, siteConfig);

            if (result) {
              // Store in DB
              await prisma.competitorAnalysis.create({
                data: {
                  siteId,
                  competitorId,
                  pageUrl: result.pageUrl,
                  pageTitle: result.pageTitle,
                  wordCount: result.wordCount,
                  aiVisScore: result.aiVisScore,
                  eeatScore: result.eeatScore,
                  topicsDetected: result.topicsDetected,
                  hasSchema: result.hasSchema,
                  hasFaq: result.hasFaq,
                },
              });

              analyzed++;
              totalScore += result.aiVisScore;

              send({
                type: "page_done",
                index: i,
                url,
                title: result.pageTitle || url,
                aiVisScore: result.aiVisScore,
                eeatScore: result.eeatScore,
                wordCount: result.wordCount,
                topics: result.topicsDetected.slice(0, 3),
              });
            } else {
              errors++;
              send({ type: "page_error", index: i, url, error: "Failed to fetch or parse page" });
            }
          } catch (err) {
            errors++;
            send({ type: "page_error", index: i, url, error: err instanceof Error ? err.message : "Unknown error" });
          }

          // Rate limit between pages
          if (i < urls.length - 1) {
            await new Promise((r) => setTimeout(r, 1500));
          }
        }

        // Update competitor domain stats
        const avgScore = analyzed > 0 ? Math.round(totalScore / analyzed) : 0;
        await prisma.competitorDomain.update({
          where: { id: competitorId },
          data: { lastAnalyzed: new Date() },
        });

        send({ type: "done", pagesAnalyzed: analyzed, avgScore, errors });
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : "Analysis failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
