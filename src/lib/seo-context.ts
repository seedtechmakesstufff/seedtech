/**
 * Centralized SEO Context Builder
 *
 * Assembles the full AI context from 3 layers:
 *   1. Business Context — company profile, tone, USPs
 *   2. SEO Strategy — tracked keywords with intent/volume/position, content pillars
 *   3. Page Context — human-written descriptions of what each page covers (from DB)
 *
 * Used by:
 *   - /api/admin/seo/metadata/generate (single page)
 *   - /api/admin/seo/metadata/generate-all (bulk)
 *   - Blog generation, AI advisor, and any future AI features
 */

import { prisma } from "@/lib/prisma";
import {
  getBusinessContextForSite,
  buildStrategyPrompt,
} from "@/lib/business-context";

/* ── Types ── */
export interface SeoContextOptions {
  siteId: string;
  path: string;
  pageKind?: string | null;
  currentTitle?: string | null;
  currentDescription?: string | null;
  /** Titles already used on other pages (for differentiation) */
  existingTitles?: string[];
}

export interface SeoContextResult {
  businessContext: string;
  keywordsContext: string;
  pageContext: string;
  serviceContext: string;
  strategyContext: string;
  existingTitlesContext: string;
  /** The full prompt ready to send to Claude */
  fullPrompt: string;
}

/* ── Main builder ── */
export async function buildSeoContext(
  opts: SeoContextOptions,
): Promise<SeoContextResult> {
  const {
    siteId,
    path,
    pageKind,
    currentTitle,
    currentDescription,
    existingTitles = [],
  } = opts;

  // ── 1. Business Context ──
  const businessCtx = await getBusinessContextForSite(siteId);
  const businessContext = buildStrategyPrompt(businessCtx);

  // ── 2. Keywords Context (with full data, split by relevance) ──
  let keywordsContext = "";
  try {
    const keywords = await prisma.trackedKeyword.findMany({
      where: { siteId, isActive: true },
      select: {
        keyword: true,
        tier: true,
        intent: true,
        targetPage: true,
        volume: true,
        competition: true,
        currentPosition: true,
      },
      orderBy: [{ tier: "asc" }, { keyword: "asc" }],
    });

    if (keywords.length > 0) {
      const formatKw = (k: (typeof keywords)[0]) => {
        const parts = [`"${k.keyword}" (${k.tier})`];
        if (k.intent) parts.push(`intent: ${k.intent}`);
        if (k.volume && k.volume !== "unknown") parts.push(`vol: ${k.volume}`);
        if (k.currentPosition) parts.push(`pos: ${k.currentPosition}`);
        if (k.targetPage) parts.push(`target: ${k.targetPage}`);
        return `• ${parts.join(" | ")}`;
      };

      // Keywords explicitly targeting THIS page
      const pageKeywords = keywords.filter(
        (k) => k.targetPage === path,
      );
      // Keywords targeting other pages (for awareness / differentiation)
      const otherKeywords = keywords.filter(
        (k) => k.targetPage && k.targetPage !== path,
      );
      // Unassigned keywords
      const unassigned = keywords.filter(
        (k) => !k.targetPage || k.targetPage === "/",
      );

      const sections: string[] = [];
      if (pageKeywords.length > 0) {
        sections.push(
          `KEYWORDS TARGETING THIS PAGE (HIGH PRIORITY — weave these in naturally):\n${pageKeywords.map(formatKw).join("\n")}`,
        );
      }
      if (unassigned.length > 0) {
        sections.push(
          `GENERAL KEYWORDS (use if relevant to this page):\n${unassigned.map(formatKw).join("\n")}`,
        );
      }
      if (otherKeywords.length > 0) {
        sections.push(
          `KEYWORDS FOR OTHER PAGES (do NOT use — listed for differentiation only):\n${otherKeywords.map(formatKw).join("\n")}`,
        );
      }
      keywordsContext = sections.join("\n\n");
    }
  } catch {
    /* no keywords */
  }

  // ── 3. Page Context (DB-stored, or blog post data) ──
  let pageContext = "";

  // Try DB-stored page context first
  try {
    const dbContext = await prisma.pageContext.findUnique({
      where: { siteId_path: { siteId, path } },
    });
    if (dbContext?.description) {
      pageContext = dbContext.description;
      if (dbContext.keywords.length > 0) {
        pageContext += `\nPage-specific keywords: ${dbContext.keywords.join(", ")}`;
      }
    }
  } catch {
    /* skip */
  }

  // For blog posts, supplement with actual post data
  if (path.startsWith("/blog/")) {
    const slug = path.replace("/blog/", "");
    try {
      const post = await prisma.blogPost.findFirst({
        where: { siteId, slug },
        select: { title: true, excerpt: true, metaTitle: true, metaDescription: true },
      });
      if (post) {
        const parts: string[] = [];
        parts.push(`Blog post: "${post.title}"`);
        if (post.excerpt) parts.push(`Excerpt: "${post.excerpt}"`);
        if (post.metaTitle) parts.push(`Existing SEO title: "${post.metaTitle}"`);
        if (post.metaDescription) parts.push(`Existing meta desc: "${post.metaDescription}"`);
        pageContext = pageContext
          ? `${pageContext}\n\n${parts.join("\n")}`
          : parts.join("\n");
      }
    } catch {
      /* skip */
    }
  }

  if (!pageContext) {
    pageContext = `No page context available. Infer purpose from URL path: ${path}`;
  }

  // ── 4. Service Context (linked context nodes with relevance levels) ──
  let serviceContext = "";
  try {
    // Find the PageContext for this path, then resolve linked nodes
    const pageCtxWithNodes = await prisma.pageContext.findUnique({
      where: { siteId_path: { siteId, path } },
      include: {
        linkedNodes: {
          include: {
            contextNode: true,
          },
          orderBy: { relevance: "asc" }, // primary first
        },
      },
    });

    const linkedNodes = pageCtxWithNodes?.linkedNodes || [];

    // Fallback: slug-based matching if no explicit links
    if (linkedNodes.length === 0) {
      const pathSlug = path.split("/").filter(Boolean).pop() || "";
      if (pathSlug) {
        const matchedNode = await prisma.contextNode.findFirst({
          where: {
            siteId,
            slug: { contains: pathSlug },
          },
        });
        if (matchedNode) {
          linkedNodes.push({
            id: "auto",
            pageContextId: "",
            contextNodeId: matchedNode.id,
            relevance: "primary",
            contextNode: matchedNode,
            createdAt: new Date(),
          } as typeof linkedNodes[0]);
        }
      }
    }

    if (linkedNodes.length > 0) {
      const sections: string[] = [];

      for (const link of linkedNodes) {
        const node = link.contextNode;

        if (link.relevance === "primary") {
          // Full context — this is the main service for this page
          const parts: string[] = [];
          parts.push(`SERVICE: ${node.name} (${node.nodeType})`);
          parts.push(`Summary: ${node.summary}`);
          if (node.audience) parts.push(`Target Audience: ${node.audience}`);
          if (node.pricing) parts.push(`Pricing: ${node.pricing}`);
          if (node.usps.length > 0) parts.push(`USPs:\n${node.usps.map((u: string) => `  • ${u}`).join("\n")}`);
          if (node.messaging) parts.push(`Messaging Guidelines: ${node.messaging}`);
          if (node.doSay.length > 0) parts.push(`DO use these terms: ${node.doSay.join(", ")}`);
          if (node.dontSay.length > 0) parts.push(`DO NOT use these terms: ${node.dontSay.join(", ")}`);
          if (node.competitors.length > 0) parts.push(`Differentiate from: ${node.competitors.join(", ")}`);
          if (node.detailedContext) parts.push(`Additional Context:\n${node.detailedContext}`);
          sections.push(parts.join("\n"));
        } else if (link.relevance === "secondary") {
          // Summary only — related service mentioned on this page
          sections.push(`RELATED SERVICE: ${node.name} — ${node.summary}`);
        } else {
          // Mention only — just the name
          sections.push(`ALSO MENTIONED: ${node.name}`);
        }
      }

      serviceContext = sections.join("\n\n---\n\n");
    }
  } catch {
    /* skip service context on error */
  }

  // ── 5. Strategy Documents (persistent strategy context) ──
  let strategyContext = "";
  try {
    const strategyDocs = await prisma.seoStrategyDoc.findMany({
      where: { siteId, isActive: true },
      orderBy: [{ category: "asc" }, { updatedAt: "desc" }],
      select: { title: true, category: true, content: true },
    });

    if (strategyDocs.length > 0) {
      strategyContext = strategyDocs
        .map((doc) => `### ${doc.title} (${doc.category.replace(/_/g, " ")})\n${doc.content}`)
        .join("\n\n---\n\n");
    }
  } catch {
    /* skip strategy context on error */
  }

  // ── 6. Existing titles for differentiation ──
  const existingTitlesContext =
    existingTitles.length > 0
      ? existingTitles.map((t) => `• ${t}`).join("\n")
      : "";

  // ── 6. Build the full prompt ──
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { domain: true, siteUrl: true },
  });
  const domain = site?.domain || businessCtx.domain || "example.com";
  const siteUrl = site?.siteUrl || `https://${domain}`;

  const fullPrompt = `You are a senior SEO strategist generating metadata for ONE specific page on a business website.

YOUR APPROACH (in order of priority):
1. SERVICE CONTEXT — if a service/offering node is linked to this page, it defines exactly what this page sells. This is the most specific context available.
2. PAGE CONTEXT — this tells you exactly what this specific page is about. This is your #1 signal when no service node is linked.
3. KEYWORDS — if keywords are explicitly targeted at this page, weave the primary one into the title naturally.
4. BUSINESS CONTEXT — use for brand name, tone of voice, and positioning ONLY. Do NOT let the overall business description override the page's actual content.
5. DIFFERENTIATION — make this page's metadata distinct from every other page on the site.

QUALITY RULES:
- Title: 50-60 chars. Front-load the most important concept. Include brand only if space allows.
- Description: 140-155 chars. Clear value proposition + soft CTA intent. Write for click-through from Google SERPs.
- Be SPECIFIC to THIS page. A service page about web development should NOT mention IT support.
- Do NOT use generic marketing language: "top-notch", "cutting-edge", "premier", "best-in-class", "elevate".
- Write like a human SEO strategist, not a marketing bot.
- If keywords are assigned to this page, the title MUST contain the primary keyword naturally.
- OG title/description should be slightly different from the main title/description — optimized for social clicks.

PAGE: ${path}
TYPE: ${pageKind || "inferred from context"}
SITE: ${siteUrl} (${domain})

═══ PAGE CONTEXT (PRIMARY — what this page actually covers) ═══
${pageContext}

${serviceContext ? `═══ SERVICE CONTEXT (specific service/offering for this page) ═══
${serviceContext}

` : ""}═══ KEYWORDS ═══
${keywordsContext || "No keywords tracked yet. Use general SEO best practices."}

${strategyContext ? `═══ SEO STRATEGY CONTEXT (overarching strategy decisions — inform your approach) ═══
${strategyContext}

` : ""}═══ BUSINESS CONTEXT (brand voice & positioning — secondary) ═══
${businessContext}

═══ DIFFERENTIATION — titles already used on other pages ═══
${existingTitlesContext || "No other titles generated yet."}

${currentTitle ? `Current title (may need improvement): "${currentTitle}"` : ""}
${currentDescription ? `Current description (may need improvement): "${currentDescription}"` : ""}

Return ONLY valid JSON, no markdown fences:
{
  "title": "SEO title ≤60 chars, NO brand suffix (it gets appended as ' — ${businessCtx.companyName}')",
  "description": "meta description ≤155 chars with clear value prop",
  "ogTitle": "OG title ≤70 chars, slightly different from title",
  "ogDescription": "social description ≤200 chars, more conversational",
  "canonical": "${path}",
  "jsonLdType": "WebPage|Service|Article|LocalBusiness|FAQPage|Organization",
  "reasoning": "2-3 sentences: which keywords you targeted, why this angle, how it's differentiated"
}`;

  return {
    businessContext,
    keywordsContext,
    pageContext,
    serviceContext,
    strategyContext,
    existingTitlesContext,
    fullPrompt,
  };
}
