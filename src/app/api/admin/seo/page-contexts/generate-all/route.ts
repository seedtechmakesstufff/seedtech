/**
 * /api/admin/seo/page-contexts/generate-all
 *
 * POST — Bulk-generates page context descriptions for unconfigured pages using Claude.
 * Streams progress via SSE so the UI can show a live log.
 *
 * Body: { skipConfigured?: boolean }  — if true (default), skip pages that already have context
 *
 * SSE events:
 *   { type: "start", total: number, skipped: number }
 *   { type: "progress", index: number, path: string, status: "generating" | "saved" | "error", description?: string, error?: string }
 *   { type: "done", generated: number, saved: number, skipped: number, errors: number }
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import {
  getBusinessContextForSite,
  buildStrategyPrompt,
} from "@/lib/business-context";
import { fetchPageText } from "@/lib/fetch-page-text";
import { prisma } from "@/lib/prisma";
import { STATIC_ROUTES } from "@/lib/static-routes";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min max for Vercel

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Claude API key not configured" },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const skipConfigured = body.skipConfigured !== false; // default true

  // ── Gather all known pages ──
  const pageMap = new Map<string, { path: string; kind: string }>();
  for (const r of STATIC_ROUTES) pageMap.set(r.path, r);

  // Blog posts
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published", siteId },
      select: { slug: true, title: true, excerpt: true },
    });
    for (const p of posts) {
      const blogPath = `/blog/${p.slug}`;
      if (!pageMap.has(blogPath)) pageMap.set(blogPath, { path: blogPath, kind: "blog" });
    }
  } catch { /* skip */ }

  // Crawled pages
  try {
    const sitePages = await prisma.sitePage.findMany({
      where: { siteId, status: "active" },
      select: { path: true, kind: true },
    });
    for (const sp of sitePages) {
      if (!pageMap.has(sp.path)) pageMap.set(sp.path, { path: sp.path, kind: sp.kind });
    }
  } catch { /* skip */ }

  // Get existing DB page contexts to know which are already configured
  const existingContexts = await prisma.pageContext.findMany({
    where: { siteId },
    select: { path: true, description: true },
  });
  const configuredPaths = new Set(
    existingContexts.filter((c) => c.description?.trim()).map((c) => c.path),
  );

  // Get existing metadata (titles/descriptions) to give Claude extra signal
  const existingMeta = await prisma.pageMetadata.findMany({
    where: { siteId },
    select: { path: true, title: true, description: true },
  });
  const metaByPath = new Map(existingMeta.map((m) => [m.path, m]));

  // Get blog posts for extra context
  let blogPosts: { slug: string; title: string; excerpt: string | null }[] = [];
  try {
    blogPosts = await prisma.blogPost.findMany({
      where: { status: "published", siteId },
      select: { slug: true, title: true, excerpt: true },
    });
  } catch { /* skip */ }
  const blogBySlug = new Map(blogPosts.map((p) => [p.slug, p]));

  // Build page list, optionally skipping configured
  let allPages = Array.from(pageMap.values()).sort((a, b) => a.path.localeCompare(b.path));
  let skipped = 0;
  if (skipConfigured) {
    const filtered = allPages.filter((p) => {
      if (configuredPaths.has(p.path)) {
        skipped++;
        return false;
      }
      return true;
    });
    allPages = filtered;
  }

  // ── Fetch business context once (shared for all pages) ──
  const businessCtx = await getBusinessContextForSite(siteId);
  const businessPrompt = buildStrategyPrompt(businessCtx);

  // ── SSE stream ──
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      const total = allPages.length;
      send({ type: "start", total, skipped });

      let generated = 0;
      let saved = 0;
      let errors = 0;

      // ── Helper: call Claude with retry on 429 / 529 ──
      const MAX_RETRIES = 5;
      async function callClaudeWithRetry(
        prompt: string,
      ): Promise<{ content: { text: string }[] }> {
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey!,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 512,
              messages: [{ role: "user", content: prompt }],
            }),
          });

          if (res.ok) return res.json();

          if ((res.status === 429 || res.status === 529) && attempt < MAX_RETRIES) {
            const retryAfter = res.headers.get("retry-after");
            const waitSec = retryAfter
              ? Math.min(parseFloat(retryAfter), 60)
              : Math.min(2 ** attempt * 2, 30);
            send({
              type: "progress",
              index: -1,
              path: `⏳ Rate-limited — retrying in ${waitSec.toFixed(0)}s (attempt ${attempt + 1}/${MAX_RETRIES})`,
              status: "generating",
            });
            await new Promise((r) => setTimeout(r, waitSec * 1000));
            continue;
          }

          throw new Error(`Claude ${res.status}: ${res.statusText}`);
        }
        throw new Error("Max retries exceeded");
      }

      for (let i = 0; i < total; i++) {
        const page = allPages[i];
        send({ type: "progress", index: i, path: page.path, status: "generating" });

        try {
          // Build extra context for this page
          const meta = metaByPath.get(page.path);
          const extraSignals: string[] = [];

          if (meta?.title) extraSignals.push(`Existing SEO title: "${meta.title}"`);
          if (meta?.description) extraSignals.push(`Existing meta description: "${meta.description}"`);

          // Blog-specific context
          if (page.path.startsWith("/blog/")) {
            const slug = page.path.replace("/blog/", "");
            const post = blogBySlug.get(slug);
            if (post) {
              extraSignals.push(`Blog post title: "${post.title}"`);
              if (post.excerpt) extraSignals.push(`Excerpt: "${post.excerpt}"`);
            }
          }

          // ── Fetch actual page content ──
          const pageContent = await fetchPageText(page.path);

          const prompt = `You are analyzing a REAL page on a business website to write a clear, accurate page context description. This description will be used as the #1 signal for all future AI-generated content (metadata, blog posts, keywords) for this specific page.

CRITICAL: You have the ACTUAL page content below. Base your description on what the page ACTUALLY says — not assumptions from the URL or business context.

BUSINESS CONTEXT (for brand awareness only — do NOT let this override what the page actually contains):
${businessPrompt}

PAGE TO ANALYZE:
- URL Path: ${page.path}
- Page Type: ${page.kind}

═══ ACTUAL PAGE CONTENT (THIS IS YOUR PRIMARY SOURCE — read it carefully) ═══
${pageContent.source !== "none" ? pageContent.summary : `[Page could not be fetched or read. Fall back to URL inference and additional signals only.]\nURL path: ${page.path}`}

${extraSignals.length > 0 ? `\nADDITIONAL SIGNALS:\n${extraSignals.join("\n")}` : ""}

YOUR TASK:
Write a 2-4 sentence description of what this page covers based on the ACTUAL CONTENT above. Be specific and factual. Include:
- What the page is about (the specific services, features, or information presented ON THIS PAGE)
- Who the target audience is
- What action visitors should take on this page

Also suggest 3-5 relevant keywords and the most appropriate page type.

RULES:
- Base your description on the ACTUAL PAGE CONTENT, not just the URL or business description
- If the page is about web development, do NOT mention IT support (and vice versa)
- Be SPECIFIC to what this page actually covers
- Do NOT use marketing fluff — write factual, descriptive context
- Keep the description concise but informative

Return ONLY valid JSON, no markdown fences:
{
  "description": "2-4 sentence page context description",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "pageType": "page|service|industry|blog|landing"
}`;

          const data = await callClaudeWithRetry(prompt);
          const content = data.content?.[0]?.text ?? "";
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error("Invalid AI response format");

          const parsed = JSON.parse(jsonMatch[0]);
          generated++;

          // Save to DB
          await prisma.pageContext.upsert({
            where: { siteId_path: { siteId, path: page.path } },
            create: {
              siteId,
              path: page.path,
              description: parsed.description ?? "",
              keywords: parsed.keywords ?? [],
              pageType: parsed.pageType ?? page.kind,
            },
            update: {
              description: parsed.description ?? "",
              keywords: parsed.keywords ?? [],
              pageType: parsed.pageType ?? page.kind,
            },
          });
          saved++;

          send({
            type: "progress",
            index: i,
            path: page.path,
            status: "saved",
            description: (parsed.description ?? "").slice(0, 80) + "…",
          });
        } catch (err) {
          errors++;
          send({
            type: "progress",
            index: i,
            path: page.path,
            status: "error",
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }

        // Delay between calls to stay under rate limits (1s base)
        if (i < total - 1) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }

      send({ type: "done", generated, saved, skipped, errors });
      controller.close();
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
