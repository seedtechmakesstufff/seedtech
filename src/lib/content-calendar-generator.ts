/* ── Content Calendar Generator ──
 *
 * Uses Claude + GSC data + tracked keywords + business context
 * to generate a 90-day content plan mapped to tier 2/3 keywords.
 *
 * Output: ContentIdea records ready to save to DB.
 *
 * Data inputs:
 *   1. Business context (company, services, audience, tone)
 *   2. Tracked keywords with GSC performance data
 *   3. Existing published content (to avoid duplication)
 *   4. Existing content ideas (to avoid overlap)
 *   5. Keyword clusters (to align with topic strategy)
 */

import { prisma } from "@/lib/prisma";
import { getBusinessContextForSite, buildStrategyPrompt } from "@/lib/business-context";
import { getTrackedKeywords } from "@/lib/site-data";
import {
  isSearchConsoleConfigured,
  getKeywordPerformance,
} from "./google-search-console";
import { getSearchConsoleIntegration } from "./site-data";
import { loadSiteScoringConfig } from "@/lib/site-scoring-config";

export interface GeneratedIdea {
  title: string;
  targetKeyword: string;
  wordCount: number;
  funnelStage: string; // "Top" | "Middle" | "Bottom"
  clusterId?: string;
  rationale: string;
  suggestedPublishWeek: number; // week 1-12
}

export interface CalendarGenerationResult {
  ideas: GeneratedIdea[];
  saved: number;
  skipped: number;
  prompt: string; // for debugging / transparency
}

/**
 * Generate a 90-day content calendar using AI.
 * Returns the generated ideas and saves them as ContentIdea records.
 */
export async function generateContentCalendar(
  siteId: string,
  options: {
    ideaCount?: number; // default 12 (one per week for 90 days)
    save?: boolean;     // default true — set false for preview-only
  } = {}
): Promise<CalendarGenerationResult> {
  const { ideaCount = 12, save = true } = options;

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error("CLAUDE_API_KEY not configured");
  }

  // ── 1. Gather all inputs ──

  const [businessCtx, trackedKeywords, existingPosts, existingIdeas, clusters] =
    await Promise.all([
      getBusinessContextForSite(siteId),
      getTrackedKeywords(siteId),
      prisma.blogPost.findMany({
        where: { siteId },
        select: { title: true, slug: true, targetKeyword: true, status: true },
      }),
      prisma.contentIdea.findMany({
        where: { siteId },
        select: { title: true, targetKeyword: true, status: true },
      }),
      prisma.keywordCluster.findMany({
        where: { siteId, status: "active" },
        select: { id: true, name: true, pillarPage: true, seedKeyword: true },
      }),
    ]);

  const strategyContext = buildStrategyPrompt(businessCtx);

  // Load brand name
  let brandName = businessCtx.companyName || "Company";
  try {
    const cfg = await loadSiteScoringConfig(siteId);
    brandName = cfg.brandName;
  } catch { /* use default */ }

  // ── 2. Gather GSC data if available ──

  let gscKeywords: { keyword: string; clicks: number; impressions: number; ctr: number; position: number }[] = [];
  try {
    const integration = await getSearchConsoleIntegration(siteId);
    if (isSearchConsoleConfigured(integration)) {
      gscKeywords = await getKeywordPerformance(28, 200, integration);
    }
  } catch { /* GSC not available — continue without */ }

  // ── 3. Build the prompt ──

  // Format tracked keywords with performance data
  const keywordLines = trackedKeywords.map((k) => {
    const gsc = gscKeywords.find((g) => g.keyword.toLowerCase() === k.keyword.toLowerCase());
    const posStr = k.currentPosition ? `pos ${k.currentPosition}` : "unranked";
    const clickStr = gsc ? `${gsc.clicks} clicks, ${gsc.impressions} imp` : "no GSC data";
    return `- "${k.keyword}" | tier: ${k.tier} | intent: ${k.intent} | volume: ${k.volume} | ${posStr} | ${clickStr} | target: ${k.targetPage}`;
  }).join("\n");

  // Format existing content to avoid duplication
  const existingContentLines = [
    ...existingPosts.map((p) => `- [${p.status}] "${p.title}" → keyword: "${p.targetKeyword}"`),
    ...existingIdeas.map((i) => `- [${i.status}] "${i.title}" → keyword: "${i.targetKeyword}"`),
  ].join("\n");

  // Format clusters
  const clusterLines = clusters.map((c) =>
    `- "${c.name}" (pillar: ${c.pillarPage}, seed: "${c.seedKeyword}")`
  ).join("\n");

  // Find content gaps — keywords with no content targeting them
  const coveredKeywords = new Set([
    ...existingPosts.map((p) => p.targetKeyword.toLowerCase()),
    ...existingIdeas.map((i) => i.targetKeyword.toLowerCase()),
  ]);
  const uncoveredKeywords = trackedKeywords.filter(
    (k) => !coveredKeywords.has(k.keyword.toLowerCase())
  );
  const uncoveredLines = uncoveredKeywords.map((k) =>
    `- "${k.keyword}" (${k.tier}, ${k.intent}, vol: ${k.volume})`
  ).join("\n");

  // Find strike-distance keywords (positions 8-20) — high-value targets
  const strikeDistance = trackedKeywords.filter(
    (k) => k.currentPosition && k.currentPosition >= 8 && k.currentPosition <= 20
  );
  const strikeLines = strikeDistance.map((k) =>
    `- "${k.keyword}" at position ${k.currentPosition} (${k.tier}, ${k.intent})`
  ).join("\n");

  // Find high-impression/low-CTR keywords — content opportunity
  const lowCtrHighImp = gscKeywords.filter(
    (k) => k.impressions > 50 && k.ctr < 0.02 && k.position <= 30
  ).slice(0, 15);
  const lowCtrLines = lowCtrHighImp.map((k) =>
    `- "${k.keyword}" — ${k.impressions} impressions, ${(k.ctr * 100).toFixed(1)}% CTR, pos ${k.position.toFixed(1)}`
  ).join("\n");

  const systemPrompt = `You are an expert content strategist specializing in AI visibility and search engine optimization. You generate data-driven content calendars that maximize organic traffic and AI citation potential.

${strategyContext}

Your content plans are always:
1. Mapped to real keyword data (not guesses)
2. Sequenced strategically (foundational → authority → niche)
3. Aligned with the business's actual services and audience
4. Designed for AI citation (not just traditional SEO ranking)`;

  const userPrompt = `Generate a ${ideaCount}-item content calendar for ${brandName} covering the next 90 days (12 weeks).

═══════════════════════════════════════════════════════════
TRACKED KEYWORDS (with live performance data):
═══════════════════════════════════════════════════════════
${keywordLines || "No tracked keywords yet."}

═══════════════════════════════════════════════════════════
CONTENT GAPS — Keywords with NO content targeting them:
═══════════════════════════════════════════════════════════
${uncoveredLines || "All keywords have content."}

═══════════════════════════════════════════════════════════
STRIKE DISTANCE — Keywords at positions 8-20 (close to page 1):
═══════════════════════════════════════════════════════════
${strikeLines || "No strike-distance keywords."}

═══════════════════════════════════════════════════════════
HIGH IMPRESSIONS / LOW CTR — Content improvement opportunities:
═══════════════════════════════════════════════════════════
${lowCtrLines || "No low-CTR opportunities detected."}

═══════════════════════════════════════════════════════════
EXISTING CONTENT (avoid duplication):
═══════════════════════════════════════════════════════════
${existingContentLines || "No existing content."}

═══════════════════════════════════════════════════════════
TOPIC CLUSTERS:
═══════════════════════════════════════════════════════════
${clusterLines || "No clusters defined."}

═══════════════════════════════════════════════════════════
RULES:
═══════════════════════════════════════════════════════════

1. **Prioritize content gaps** — keywords with no content should get articles first
2. **Strike-distance keywords** get dedicated articles to push them to page 1
3. **Low-CTR keywords** should get articles with better titles and click-worthy angles
4. **Mix funnel stages**: ~40% Top (informational), ~35% Middle (commercial), ~25% Bottom (transactional)
5. **Sequence strategically**: foundational/pillar content in weeks 1-4, supporting content in weeks 5-8, niche/long-tail in weeks 9-12
6. **Each article targets exactly ONE primary keyword** from the tracked list (or a closely related long-tail)
7. **Word counts**: 1200-2000 words for informational, 800-1500 for commercial/transactional
8. **No duplicate topics** with existing content
9. **Include rationale** for why each piece was chosen (data-driven reasoning)

Return ONLY valid JSON in this exact format:
{
  "ideas": [
    {
      "title": "Article title optimized for AI citation (question format preferred)",
      "targetKeyword": "exact keyword from tracked list or derived long-tail",
      "wordCount": 1500,
      "funnelStage": "Top|Middle|Bottom",
      "rationale": "Why this article, based on the data: e.g. 'Keyword at position 12, 450 impressions — a dedicated article could push to page 1'",
      "suggestedPublishWeek": 1
    }
  ]
}`;

  // ── 4. Call Claude ──

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";

  // ── 5. Parse response ──

  let ideas: GeneratedIdea[] = [];
  try {
    // Extract JSON from response (Claude sometimes wraps in ```json blocks)
    const jsonMatch = text.match(/\{[\s\S]*"ideas"[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const parsed = JSON.parse(jsonMatch[0]);
    ideas = (parsed.ideas || []).map((idea: GeneratedIdea) => ({
      title: idea.title,
      targetKeyword: idea.targetKeyword,
      wordCount: idea.wordCount || 1500,
      funnelStage: idea.funnelStage || "Top",
      rationale: idea.rationale || "",
      suggestedPublishWeek: idea.suggestedPublishWeek || 1,
    }));
  } catch (parseErr) {
    throw new Error(`Failed to parse Claude response: ${parseErr}`);
  }

  // ── 6. Match to clusters ──

  for (const idea of ideas) {
    const matchingCluster = clusters.find((c) =>
      idea.targetKeyword.toLowerCase().includes(c.seedKeyword.toLowerCase()) ||
      c.seedKeyword.toLowerCase().includes(idea.targetKeyword.toLowerCase())
    );
    if (matchingCluster) {
      idea.clusterId = matchingCluster.id;
    }
  }

  // ── 7. Save to DB ──

  let saved = 0;
  let skipped = 0;

  if (save) {
    for (const idea of ideas) {
      // Skip if a content idea with the same keyword already exists
      const exists = await prisma.contentIdea.findFirst({
        where: {
          siteId,
          targetKeyword: { equals: idea.targetKeyword, mode: "insensitive" },
        },
      });
      if (exists) {
        skipped++;
        continue;
      }

      await prisma.contentIdea.create({
        data: {
          siteId,
          title: idea.title,
          targetKeyword: idea.targetKeyword,
          wordCount: idea.wordCount,
          funnelStage: idea.funnelStage,
          status: "idea",
          clusterId: idea.clusterId || null,
        },
      });
      saved++;
    }
  }

  return {
    ideas,
    saved,
    skipped,
    prompt: userPrompt, // for transparency in the UI
  };
}
