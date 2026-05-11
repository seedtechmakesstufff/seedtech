/**
 * /api/admin/seo/metadata/generate
 *
 * POST — Uses Claude to auto-generate metadata for a given page path.
 * Uses the centralized SEO context builder for comprehensive AI context.
 *
 * Body: { path: string, currentTitle?: string, currentDescription?: string, pageKind?: string }
 *
 * Returns: {
 *   title, description, ogTitle, ogDescription, canonical, jsonLdType,
 *   reasoning: string  // short explanation of choices
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { buildSeoContext } from "@/lib/seo-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Claude API key not configured. Add CLAUDE_API_KEY to .env.local" },
      { status: 500 },
    );
  }

  const body = await req.json();
  const { path: pagePath, currentTitle, currentDescription, pageKind } = body;

  if (!pagePath) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }

  // ── Build context using centralized builder ────────────────
  const existingMeta = await prisma.pageMetadata.findMany({
    where: { siteId, NOT: { path: pagePath } },
    select: { title: true },
  });
  const existingTitles = existingMeta
    .map((m) => m.title)
    .filter(Boolean) as string[];

  const seoContext = await buildSeoContext({
    siteId,
    path: pagePath,
    pageKind,
    currentTitle,
    currentDescription,
    existingTitles,
  });

  // ── Call Claude ────────────────────────────────────
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [{ role: "user", content: seoContext.fullPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Claude API error: ${err.error?.message || response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    const content = data.content?.[0]?.text ?? "";

    // Extract JSON from response (handle markdown fences if present)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI returned invalid format", raw: content }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      title: parsed.title ?? "",
      description: parsed.description ?? "",
      ogTitle: parsed.ogTitle ?? "",
      ogDescription: parsed.ogDescription ?? "",
      canonical: parsed.canonical ?? pagePath,
      jsonLdType: parsed.jsonLdType ?? "",
      reasoning: parsed.reasoning ?? "",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
