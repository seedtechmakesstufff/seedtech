/* ── Batch Blog Writer ──
 *
 * Programmatically generates blog posts from ContentIdea records.
 * Runs the same pipeline as the manual blog wizard:
 *   outline → draft → meta → save as draft
 *
 * Designed to be called from an API route or cron job.
 */

import { prisma } from "@/lib/prisma";
import { getTrackedKeywords } from "@/lib/site-data";
import { buildStrategyPrompt, getBusinessContextForSite } from "@/lib/business-context";
import { getAIFirstWritingInstructions } from "@/lib/ai-visibility";
import { getAuthorEntity } from "@/lib/seo-eeat";
import { loadSiteScoringConfig } from "@/lib/site-scoring-config";
import { createPost } from "@/lib/blog";
import { generateStructuredDataPayload, countWords } from "@/lib/structured-data";

interface BatchResult {
  total: number;
  written: number;
  failed: number;
  posts: { title: string; slug: string; keyword: string; wordCount: number; status: string }[];
  errors: { keyword: string; error: string }[];
}

/**
 * Generate blog posts for the next N unpublished content ideas.
 */
export async function batchWriteBlogPosts(
  siteId: string,
  options: {
    count?: number;       // max posts to generate (default 5)
    status?: "draft" | "published";  // save as "draft" or "published" (default "draft")
    ideaIds?: string[];   // specific idea IDs to write (optional)
  } = {}
): Promise<BatchResult> {
  const { count = 5, status = "draft", ideaIds } = options;

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY not configured");

  // ── 1. Pick content ideas to write ──

  let ideas;
  if (ideaIds?.length) {
    ideas = await prisma.contentIdea.findMany({
      where: { siteId, id: { in: ideaIds } },
      take: count,
    });
  } else {
    ideas = await prisma.contentIdea.findMany({
      where: { siteId, status: "idea" },
      orderBy: { createdAt: "asc" },
      take: count,
    });
  }

  if (ideas.length === 0) {
    return { total: 0, written: 0, failed: 0, posts: [], errors: [] };
  }

  // ── 2. Load shared context (once for all posts) ──

  const businessCtx = await getBusinessContextForSite(siteId);
  const strategyPrompt = buildStrategyPrompt(businessCtx);

  let siteConfig;
  try { siteConfig = await loadSiteScoringConfig(siteId); } catch { /* defaults */ }

  const author = getAuthorEntity(undefined, siteConfig);
  const aiFirstInstructions = getAIFirstWritingInstructions(siteConfig);

  const companyName = businessCtx.companyName || "our company";
  const location = businessCtx.location || "our service area";
  const _primaryService = businessCtx.primaryService || "our services";

  const dbKeywords = await getTrackedKeywords(siteId);
  const keywordContext = dbKeywords.slice(0, 10).map((k) => `- "${k.keyword}" (${k.tier}, ${k.intent})`).join("\n");

  // ── Load strategy documents ──
  let strategyDocsContext = "";
  try {
    const strategyDocs = await prisma.seoStrategyDoc.findMany({
      where: { siteId, isActive: true },
      orderBy: [{ category: "asc" }, { updatedAt: "desc" }],
      select: { title: true, category: true, content: true },
    });
    if (strategyDocs.length > 0) {
      strategyDocsContext = `\nSEO Strategy Context:\n${strategyDocs.map((d) => `### ${d.title}\n${d.content}`).join("\n\n")}`;
    }
  } catch { /* skip */ }

  // ── Load experience evidence for E-E-A-T enrichment ──
  const evidence = siteConfig?.evidence || [];
  const evidenceContext = evidence.length > 0
    ? `\nREAL EXPERIENCE EVIDENCE — weave these naturally into the content:\n${evidence.map((e) => {
        const sourceNote = e.source ? ` (Source: ${e.source})` : "";
        return `- [${e.type.toUpperCase()}] ${e.title}: ${e.content}${sourceNote}`;
      }).join("\n")}\n\nIMPORTANT: Use these real data points, metrics, and testimonials to demonstrate first-hand experience. AI systems heavily weight content with specific, verifiable evidence.`
    : "";

  // ── 3. Process each idea sequentially (to avoid rate limits) ──

  const result: BatchResult = { total: ideas.length, written: 0, failed: 0, posts: [], errors: [] };

  for (const idea of ideas) {
    try {
      // Gather existing published posts for internal linking (refreshed each iteration)
      const existingPosts = await prisma.blogPost.findMany({
        where: { siteId, status: "published" },
        select: { slug: true, title: true, targetKeyword: true },
        orderBy: { publishedAt: "desc" },
        take: 20,
      });

      const internalLinkContext = existingPosts.length > 0
        ? `\nExisting published blog posts (link to relevant ones naturally):\n${existingPosts.map((p) => `- [${p.title}](/blog/${p.slug}) — keyword: "${p.targetKeyword}"`).join("\n")}`
        : "";

      const baseContext = `
${strategyPrompt}

Author: ${author.name}, ${author.jobTitle}
${author.bio}

Current SEO keywords being targeted:
${keywordContext}
${internalLinkContext}
${evidenceContext}
${strategyDocsContext}
`;

      // ── Step 1: Generate outline ──

      const outlineSystem = `You are an expert AI visibility strategist. Your goal is NOT to make content that "ranks" — it's to create content that AI SYSTEMS (Google AIO, ChatGPT, Perplexity, Gemini) will CITE as an authoritative source. Generate outlines that maximize AI citation potential. ${baseContext}`;
      const outlineUser = `Create a detailed outline for a blog post about: "${idea.title}"
Target keyword: "${idea.targetKeyword}"
Target word count: ${idea.wordCount || 1500}
Tone: professional

CRITICAL — Structure for AI CITATION:
1. Citeable Opening — 20-60 word direct-answer paragraph
2. Entity Definition — "${companyName} is a [what] serving [who] in [where]"
3. Question-Format H2 Headings — EVERY heading must be a question
4. Comparison Table — at least one
5. Numbered Steps — at least one step-by-step section
6. Definition Blocks — at least 2 "X is Y" definitions
7. FAQ Section — 4-6 questions with 2-3 sentence answers
8. CTA Closing — referencing ${companyName} and ${location}
${evidence.length > 0 ? `9. Experience Evidence — incorporate real metrics, case studies, or testimonials from the evidence provided in the context. Reference specific numbers and outcomes.` : ""}

Return ONLY valid JSON:
{
  "title": "AI-citation-optimized title",
  "slug": "url-friendly-slug",
  "excerpt": "1-2 sentence citeable excerpt",
  "sections": [{ "heading": "Question heading?", "points": ["point 1", "point 2"], "estimatedWords": 300, "mustInclude": "table|steps|definitions|none" }],
  "faqSection": [{ "question": "Question?", "answer": "2-3 sentence answer" }],
  "metaTitle": "Under 60 chars",
  "metaDescription": "Under 160 chars",
  "category": "Category",
  "tags": ["tag1", "tag2"]
}`;

      const outlineRes = await callClaude(apiKey, outlineSystem, outlineUser, 4096);
      const outlineJson = extractJSON(outlineRes);
      if (!outlineJson?.title) throw new Error("Failed to parse outline");

      // ── Step 2: Generate draft ──

      const draftSystem = `You are a skilled content writer creating content optimized for AI CITATION. Your goal is to write content that Google AIO, ChatGPT, Perplexity, and Gemini will quote as an authoritative source. You're writing for ${companyName} in ${location}. ${baseContext}\n\n${aiFirstInstructions}`;
      const draftUser = `Write a full blog post based on this outline:

${JSON.stringify(outlineJson, null, 2)}

Target keyword: "${idea.targetKeyword}" — use it naturally 3-5 times
Word count target: ${idea.wordCount || 1500}
Tone: professional

MANDATORY STRUCTURE:
1. CITEABLE OPENING — 20-60 words directly answering the core question, include keyword + one fact
2. ENTITY DEFINITION — "${companyName} is a [type] serving [audience] in [geography]"
3. QUESTION-FORMAT H2 HEADINGS — every H2 must be a question
4. COMPARISON TABLE — at least 1 markdown table
5. NUMBERED STEPS — at least 1 ordered list
6. DEFINITION BLOCKS — at least 2 "X is Y" sentences
7. FAQ SECTION — 4-6 ### question headings with 20-60 word answers
8. CTA CLOSING — mention ${companyName} and ${location}
${evidence.length > 0 ? `9. EXPERIENCE EVIDENCE — naturally weave in the real metrics, case studies, and testimonials from the context. Use specific numbers ("reduced downtime by 47%", "saved $120K annually") rather than vague claims. This is critical for E-E-A-T scoring.` : ""}

Use proper Markdown. Keep paragraphs 2-4 sentences. Include ${new Date().getFullYear()} references.
Return the full Markdown blog post content only.`;

      const draftContent = await callClaude(apiKey, draftSystem, draftUser, 8192);
      if (!draftContent || draftContent.length < 200) throw new Error("Draft too short");

      // ── Step 3: Generate meta ──

      const metaSystem = `You are an AI visibility expert. Generate metadata that maximizes AI citation potential and CTR. ${baseContext}`;
      const metaUser = `Generate SEO metadata for this blog post:

Title: ${outlineJson.title}
Target keyword: "${idea.targetKeyword}"

Return JSON:
{
  "metaTitle": "Under 60 chars, include keyword",
  "metaDescription": "Under 160 chars, include keyword, compelling",
  "excerpt": "1-2 sentence citeable excerpt"
}`;

      const metaRes = await callClaude(apiKey, metaSystem, metaUser, 1024);
      const metaJson = extractJSON(metaRes);

      // ── Step 4: Save the blog post ──

      const slug = String(outlineJson.slug || "") || slugify(String(outlineJson.title));
      const metaTitle = String(metaJson?.metaTitle || outlineJson.metaTitle || outlineJson.title || "");
      const metaDescription = String(metaJson?.metaDescription || outlineJson.metaDescription || outlineJson.excerpt || "");
      const excerpt = String(metaJson?.excerpt || outlineJson.excerpt || "");

      // Check for duplicate slug
      const existing = await prisma.blogPost.findFirst({ where: { siteId, slug } });
      if (existing) {
        result.errors.push({ keyword: idea.targetKeyword, error: `Slug "${slug}" already exists` });
        result.failed++;
        continue;
      }

      // ── Generate structured data (JSON-LD) ──
      const postWordCount = countWords(draftContent);
      const structuredData = generateStructuredDataPayload({
        title: String(outlineJson.title),
        slug,
        excerpt,
        body: draftContent,
        author: author.name,
        authorEntity: author,
        category: String(outlineJson.category || "Technology"),
        tags: Array.isArray(outlineJson.tags) ? outlineJson.tags.map(String) : [],
        targetKeyword: idea.targetKeyword,
        metaTitle,
        metaDescription,
        publishedAt: status === "published" ? new Date().toISOString() : null,
        wordCount: postWordCount,
      });

      const post = await createPost({
        title: String(outlineJson.title),
        slug,
        excerpt,
        body: draftContent,
        author: author.name,
        authorId: author.id || null,
        category: String(outlineJson.category || "Technology"),
        tags: Array.isArray(outlineJson.tags) ? outlineJson.tags.map(String) : [],
        targetKeyword: idea.targetKeyword,
        metaTitle,
        metaDescription,
        structuredData: JSON.parse(JSON.stringify({ schemas: structuredData })),
        status,
        publishedAt: status === "published" ? new Date().toISOString() : null,
        scheduledAt: null,
      }, siteId);

      // Update the content idea status
      await prisma.contentIdea.update({
        where: { id: idea.id },
        data: { status: "draft", slug },
      });

      result.posts.push({
        title: String(outlineJson.title),
        slug,
        keyword: idea.targetKeyword,
        wordCount: post.wordCount,
        status,
      });
      result.written++;

    } catch (err) {
      console.error(`[batch-blog] Failed to write "${idea.targetKeyword}":`, err);
      result.errors.push({
        keyword: idea.targetKeyword,
        error: err instanceof Error ? err.message : "Unknown error",
      });
      result.failed++;
    }
  }

  return result;
}

// ── Helpers ──

async function callClaude(
  apiKey: string,
  system: string,
  user: string,
  maxTokens: number
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || "";
}

function extractJSON(text: string): Record<string, unknown> | null {
  try {
    // Try extracting from code fence first
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) return JSON.parse(fenceMatch[1].trim());
    // Try finding raw JSON object
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  } catch {
    return null;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
