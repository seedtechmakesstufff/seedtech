/**
 * /api/admin/seo/page-contexts/generate-single
 *
 * POST — AI-generates page context for a single page.
 * Used when: a new page is created, or user clicks "generate" on an individual unconfigured page.
 *
 * Body: { path: string, kind?: string, save?: boolean }
 *   save=true (default) persists to DB; save=false returns the result without saving.
 *
 * Returns: { description, keywords, pageType }
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

export const dynamic = "force-dynamic";

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

  const body = await req.json();
  const { path, kind, save } = body;
  const shouldSave = save !== false; // default true

  if (!path) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }

  // ── Build context ──
  const businessCtx = await getBusinessContextForSite(siteId);
  const businessPrompt = buildStrategyPrompt(businessCtx);

  // Extra signals from existing metadata
  const extraSignals: string[] = [];
  try {
    const meta = await prisma.pageMetadata.findUnique({
      where: { siteId_path: { siteId, path } },
      select: { title: true, description: true },
    });
    if (meta?.title) extraSignals.push(`Existing SEO title: "${meta.title}"`);
    if (meta?.description) extraSignals.push(`Existing meta description: "${meta.description}"`);
  } catch { /* skip */ }

  // Blog post extra context
  if (path.startsWith("/blog/")) {
    const slug = path.replace("/blog/", "");
    try {
      const post = await prisma.blogPost.findFirst({
        where: { siteId, slug },
        select: { title: true, excerpt: true, metaTitle: true, metaDescription: true },
      });
      if (post) {
        extraSignals.push(`Blog post title: "${post.title}"`);
        if (post.excerpt) extraSignals.push(`Excerpt: "${post.excerpt}"`);
        if (post.metaTitle) extraSignals.push(`Existing SEO title: "${post.metaTitle}"`);
        if (post.metaDescription) extraSignals.push(`Existing meta desc: "${post.metaDescription}"`);
      }
    } catch { /* skip */ }
  }

  const pageKind = kind || "page";

  // ── Fetch actual page content ──
  const pageContent = await fetchPageText(path);

  const prompt = `You are analyzing a REAL page on a business website to write a clear, accurate page context description. This description will be used as the #1 signal for all future AI-generated content (metadata, blog posts, keywords) for this specific page.

CRITICAL: You have the ACTUAL page content below. Base your description on what the page ACTUALLY says — not assumptions from the URL or business context.

BUSINESS CONTEXT (for brand awareness only — do NOT let this override what the page actually contains):
${businessPrompt}

PAGE TO ANALYZE:
- URL Path: ${path}
- Page Type: ${pageKind}

═══ ACTUAL PAGE CONTENT (THIS IS YOUR PRIMARY SOURCE — read it carefully) ═══
${pageContent.source !== "none" ? pageContent.summary : `[Page could not be fetched or read. Fall back to URL inference and additional signals only.]\nURL path: ${path}`}

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

  // ── Call Claude ──
  const MAX_RETRIES = 3;
  let lastError = "";

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 512,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        if ((res.status === 429 || res.status === 529) && attempt < MAX_RETRIES) {
          const retryAfter = res.headers.get("retry-after");
          const waitSec = retryAfter
            ? Math.min(parseFloat(retryAfter), 30)
            : Math.min(2 ** attempt * 2, 15);
          await new Promise((r) => setTimeout(r, waitSec * 1000));
          continue;
        }
        throw new Error(`Claude ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const content = data.content?.[0]?.text ?? "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid AI response format");

      const parsed = JSON.parse(jsonMatch[0]);

      // Optionally persist to DB
      if (shouldSave) {
        await prisma.pageContext.upsert({
          where: { siteId_path: { siteId, path } },
          create: {
            siteId,
            path,
            description: parsed.description ?? "",
            keywords: parsed.keywords ?? [],
            pageType: parsed.pageType ?? pageKind,
          },
          update: {
            description: parsed.description ?? "",
            keywords: parsed.keywords ?? [],
            pageType: parsed.pageType ?? pageKind,
          },
        });
      }

      return NextResponse.json({
        description: parsed.description ?? "",
        keywords: parsed.keywords ?? [],
        pageType: parsed.pageType ?? pageKind,
        saved: shouldSave,
      });
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
      if (attempt === MAX_RETRIES) break;
    }
  }

  return NextResponse.json(
    { error: `Failed to generate context: ${lastError}` },
    { status: 500 },
  );
}
