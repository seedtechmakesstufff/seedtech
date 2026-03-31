/**
 * /api/admin/seo/metadata/generate-all
 *
 * POST — Bulk-generates metadata for ALL pages using Claude.
 * Streams progress via SSE (Server-Sent Events) so the UI can show a live log.
 *
 * Body: { skipComplete?: boolean }  — if true, skip pages that already have title+desc+canonical
 *
 * SSE events:
 *   { type: "start", total: number }
 *   { type: "progress", index: number, path: string, status: "generating" | "saved" | "error", title?: string, error?: string }
 *   { type: "done", generated: number, saved: number, skipped: number, errors: number }
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { buildSeoContext } from "@/lib/seo-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min max for Vercel

/* ── Known static routes (mirrors metadata/route.ts) ── */
const STATIC_ROUTES: { path: string; kind: string }[] = [
  { path: "/", kind: "page" },
  { path: "/about", kind: "page" },
  { path: "/contact", kind: "page" },
  { path: "/free-audit", kind: "page" },
  { path: "/services", kind: "page" },
  { path: "/services/managed-it", kind: "service" },
  { path: "/services/managed-it/plans", kind: "service" },
  { path: "/services/managed-it/assessment", kind: "service" },
  { path: "/services/managed-it/onboarding", kind: "service" },
  { path: "/services/managed-it/why-seedtech", kind: "service" },
  { path: "/services/managed-it/mobile-device-management", kind: "service" },
  { path: "/services/web-development", kind: "service" },
  { path: "/services/seedtech-platform", kind: "service" },
  { path: "/services/ecommerce-development", kind: "service" },
  { path: "/services/custom-development", kind: "service" },
  { path: "/services/seo-autopilot", kind: "service" },
  { path: "/pricing/it-support", kind: "page" },
  { path: "/pricing/web-development", kind: "page" },
  { path: "/industries", kind: "page" },
  { path: "/industries/trucking", kind: "industry" },
  { path: "/industries/construction", kind: "industry" },
  { path: "/industries/law-firms", kind: "industry" },
  { path: "/industries/medical", kind: "industry" },
  { path: "/blog", kind: "page" },
  { path: "/our-work", kind: "page" },
  { path: "/reviews", kind: "page" },
  { path: "/terms-conditions", kind: "page" },
];

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId, userId } = ctx as SiteContext;

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Claude API key not configured" },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const skipComplete = body.skipComplete !== false; // default true

  // ── Gather all pages ──
  const pageMap = new Map<string, { path: string; kind: string }>();
  for (const r of STATIC_ROUTES) pageMap.set(r.path, r);

  // Add blog posts
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published", siteId },
      select: { slug: true },
    });
    for (const p of posts) {
      const blogPath = `/blog/${p.slug}`;
      if (!pageMap.has(blogPath)) pageMap.set(blogPath, { path: blogPath, kind: "blog" });
    }
  } catch { /* skip */ }

  // Add crawled pages
  try {
    const sitePages = await prisma.sitePage.findMany({
      where: { siteId, status: "active" },
      select: { path: true, kind: true },
    });
    for (const sp of sitePages) {
      if (!pageMap.has(sp.path)) pageMap.set(sp.path, { path: sp.path, kind: sp.kind });
    }
  } catch { /* skip */ }

  // Get existing metadata to check completeness
  const existingMeta = await prisma.pageMetadata.findMany({
    where: { siteId },
    select: { path: true, title: true, description: true, canonical: true },
  });
  const metaByPath = new Map(existingMeta.map((m) => [m.path, m]));

  // Build page list, optionally skipping complete
  let allPages = Array.from(pageMap.values()).sort((a, b) => a.path.localeCompare(b.path));
  let skipped = 0;
  if (skipComplete) {
    const filtered = allPages.filter((p) => {
      const m = metaByPath.get(p.path);
      const isComplete = m && m.title && m.description && m.canonical;
      if (isComplete) skipped++;
      return !isComplete;
    });
    allPages = filtered;
  }

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

      // Track titles we've generated so far for differentiation context
      const generatedTitles: { path: string; title: string }[] = [];

      // ── Helper: call Claude with retry on 429 / 529 (rate-limit / overloaded) ──
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

          // Retryable: 429 Too Many Requests or 529 Overloaded
          if ((res.status === 429 || res.status === 529) && attempt < MAX_RETRIES) {
            // Use Retry-After header if provided, otherwise exponential backoff
            const retryAfter = res.headers.get("retry-after");
            const waitSec = retryAfter
              ? Math.min(parseFloat(retryAfter), 60)
              : Math.min(2 ** attempt * 2, 30); // 2s, 4s, 8s, 16s, 30s
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
          // Build per-page context using centralized builder with existing + generated titles for differentiation
          const allExistingTitles = [
            ...existingMeta
              .filter((m) => m.path !== page.path && m.title)
              .map((m) => m.title!),
            ...generatedTitles
              .filter((g) => g.path !== page.path)
              .map((g) => g.title),
          ];

          const seoContext = await buildSeoContext({
            siteId,
            path: page.path,
            pageKind: page.kind,
            existingTitles: allExistingTitles,
          });

          const data = await callClaudeWithRetry(seoContext.fullPrompt);
          const content = data.content?.[0]?.text ?? "";
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error("Invalid AI response format");

          const parsed = JSON.parse(jsonMatch[0]);
          generated++;

          // Save to DB
          await prisma.pageMetadata.upsert({
            where: { siteId_path: { siteId, path: page.path } },
            create: {
              siteId,
              path: page.path,
              title: parsed.title ?? null,
              description: parsed.description ?? null,
              ogTitle: parsed.ogTitle ?? null,
              ogDescription: parsed.ogDescription ?? null,
              canonical: parsed.canonical ?? page.path,
              jsonLdType: parsed.jsonLdType ?? null,
              lastEditedBy: userId,
            },
            update: {
              title: parsed.title ?? null,
              description: parsed.description ?? null,
              ogTitle: parsed.ogTitle ?? null,
              ogDescription: parsed.ogDescription ?? null,
              canonical: parsed.canonical ?? page.path,
              jsonLdType: parsed.jsonLdType ?? null,
              lastEditedBy: userId,
            },
          });
          saved++;

          // Bust static cache so page regenerates with new metadata
          revalidatePath(page.path);

          // Track for differentiation
          if (parsed.title) {
            generatedTitles.push({ path: page.path, title: parsed.title });
          }

          send({
            type: "progress",
            index: i,
            path: page.path,
            status: "saved",
            title: parsed.title ?? "",
            description: (parsed.description ?? "").slice(0, 60) + "…",
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
