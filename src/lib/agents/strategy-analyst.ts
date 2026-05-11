/* ── Strategy Analyst Agent ──
 * The first LLM-driven weekly agent. Reads the full site context — business
 * profile, active strategy docs, tracked keywords, GA4 page metrics, recent
 * events, and citation results — and writes a prioritized weekly brief back
 * into the SeoStrategyDoc table. The brief is then visible to every other
 * AI feature on the platform (blog generator, metadata, advisor) because
 * they all already read SeoStrategyDoc rows.
 *
 * Inputs (all reused — no parallel context system):
 *   - getBusinessContextForSite + buildStrategyPrompt   (existing)
 *   - prisma.seoStrategyDoc                              (existing)
 *   - prisma.industryConfig                              (existing)
 *   - prisma.trackedKeyword                              (existing)
 *   - prisma.pageMetrics                                 (new — GA4 sync)
 *   - prisma.event                                       (new — event log)
 *   - prisma.aICitation                                  (existing)
 *
 * Output:
 *   - One SeoStrategyDoc row (category=general, source=ai-strategy-analyst)
 *     with markdown content. Previous analyst-authored docs are deactivated.
 *   - One Event of type agent.run_completed.
 */

import { prisma } from "@/lib/prisma";
import { getBusinessContextForSite, buildStrategyPrompt } from "@/lib/business-context";
import { EVENT_TYPES, logEvent } from "@/lib/events";

const MODEL = "claude-sonnet-4-20250514"; // matches topic-clusters.ts + seo-insights.ts
const ANALYST_SOURCE = "ai-strategy-analyst";

export interface PriorityItem {
  title: string;
  severity: "high" | "medium" | "low";
  why: string;
  action: string;
  targets?: {
    pages?: string[];
    keywords?: string[];
    events?: string[];
  };
}

export interface AnalystOutput {
  weekOf: string;
  narrative: string;
  priorities: PriorityItem[];
}

export interface AnalystResult {
  docId: string;
  priorities: number;
  durationMs: number;
}

export async function runStrategyAnalyst(siteId: string): Promise<AnalystResult> {
  const startedAt = Date.now();
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY not configured");

  const context = await buildAnalystContext(siteId);
  const prompt = buildAnalystPrompt(context);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? "";
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  let parsed: AnalystOutput;
  try {
    parsed = JSON.parse(cleaned) as AnalystOutput;
  } catch {
    throw new Error(`Strategy Analyst returned invalid JSON: ${text.slice(0, 200)}`);
  }
  if (!parsed.narrative || !Array.isArray(parsed.priorities)) {
    throw new Error("Strategy Analyst output missing narrative or priorities");
  }

  // Deactivate any prior analyst-authored doc so only the freshest one feeds prompts
  await prisma.seoStrategyDoc.updateMany({
    where: { siteId, source: ANALYST_SOURCE, isActive: true },
    data: { isActive: false },
  });

  const docContent = renderDocMarkdown(parsed);
  const doc = await prisma.seoStrategyDoc.create({
    data: {
      siteId,
      title: `Weekly Priorities — Week of ${parsed.weekOf}`,
      category: "general",
      content: docContent,
      isActive: true,
      source: ANALYST_SOURCE,
      version: 1,
    },
  });

  await logEvent({
    siteId,
    type: EVENT_TYPES.AGENT_RUN_COMPLETED,
    title: `Strategy Analyst: ${parsed.priorities.length} priorities for week of ${parsed.weekOf}`,
    payload: {
      agent: "strategy-analyst",
      doc_id: doc.id,
      priority_count: parsed.priorities.length,
      severities: parsed.priorities.map((p) => p.severity),
    },
    entityType: "SeoStrategyDoc",
    entityId: doc.id,
  });

  return { docId: doc.id, priorities: parsed.priorities.length, durationMs: Date.now() - startedAt };
}

/* ── Context bundle ── */

interface AnalystContext {
  weekOf: string;
  businessPrompt: string;
  industry?: { industry: string; geographicTerms: string[] };
  strategyDocs: { title: string; category: string; content: string }[];
  keywords: { keyword: string; tier: string; intent: string; targetPage: string; currentPosition: number | null; previousPosition: number | null; clicks28d: number; impressions28d: number }[];
  topPages: { url: string; sessionsRecent: number; sessionsPrior: number; conversionsRecent: number; conversionsPrior: number; engagementRate: number }[];
  events: { type: string; severity: string; title: string; occurredAt: Date }[];
  citationsSummary: { platform: string; mentions: number; total: number }[];
  gbp?: {
    locations: { title: string; primaryCategory: string | null }[];
    recentReviews: { rating: number; reviewer: string | null; comment: string | null; replied: boolean; occurredAt: Date }[];
    avgRating30d: number | null;
    reviewCount30d: number;
    unrepliedCount: number;
    metricsDelta: { metric: string; recent: number; prior: number }[];
  };
}

async function buildAnalystContext(siteId: string): Promise<AnalystContext> {
  const businessCtx = await getBusinessContextForSite(siteId);
  const businessPrompt = buildStrategyPrompt(businessCtx);

  const industryConfig = await prisma.industryConfig.findUnique({ where: { siteId } });

  const strategyDocs = await prisma.seoStrategyDoc.findMany({
    where: { siteId, isActive: true },
    orderBy: [{ category: "asc" }, { updatedAt: "desc" }],
    select: { title: true, category: true, content: true },
    take: 20,
  });

  const keywords = await prisma.trackedKeyword.findMany({
    where: { siteId, isActive: true },
    orderBy: [{ impressions28d: "desc" }],
    take: 30,
    select: {
      keyword: true,
      tier: true,
      intent: true,
      targetPage: true,
      currentPosition: true,
      previousPosition: true,
      clicks28d: true,
      impressions28d: true,
    },
  });

  const now = new Date();
  const recentStart = new Date(now);
  recentStart.setUTCDate(recentStart.getUTCDate() - 7);
  const priorStart = new Date(now);
  priorStart.setUTCDate(priorStart.getUTCDate() - 14);

  const metricsRows = await prisma.pageMetrics.findMany({
    where: { siteId, source: "ga4", date: { gte: priorStart } },
    select: { url: true, date: true, sessions: true, conversions: true, engagementRate: true },
  });
  const byUrl = new Map<string, { sR: number; sP: number; cR: number; cP: number; engSum: number; engCount: number }>();
  for (const r of metricsRows) {
    const isRecent = r.date >= recentStart;
    const cur = byUrl.get(r.url) ?? { sR: 0, sP: 0, cR: 0, cP: 0, engSum: 0, engCount: 0 };
    if (isRecent) {
      cur.sR += r.sessions;
      cur.cR += r.conversions;
      cur.engSum += r.engagementRate;
      cur.engCount += 1;
    } else {
      cur.sP += r.sessions;
      cur.cP += r.conversions;
    }
    byUrl.set(r.url, cur);
  }
  const topPages = Array.from(byUrl.entries())
    .map(([url, v]) => ({
      url,
      sessionsRecent: v.sR,
      sessionsPrior: v.sP,
      conversionsRecent: v.cR,
      conversionsPrior: v.cP,
      engagementRate: v.engCount ? v.engSum / v.engCount : 0,
    }))
    .sort((a, b) => b.sessionsRecent - a.sessionsRecent)
    .slice(0, 20);

  const events = await prisma.event.findMany({
    where: { siteId, occurredAt: { gte: priorStart } },
    orderBy: { occurredAt: "desc" },
    take: 100,
    select: { type: true, severity: true, title: true, occurredAt: true },
  });

  const fourWeeksAgo = new Date(now);
  fourWeeksAgo.setUTCDate(fourWeeksAgo.getUTCDate() - 28);
  const citations = await prisma.aICitation.findMany({
    where: { siteId, checkedAt: { gte: fourWeeksAgo } },
    select: { platform: true, brandMentioned: true },
  });
  const citMap = new Map<string, { mentions: number; total: number }>();
  for (const c of citations) {
    const cur = citMap.get(c.platform) ?? { mentions: 0, total: 0 };
    cur.total += 1;
    if (c.brandMentioned) cur.mentions += 1;
    citMap.set(c.platform, cur);
  }
  const citationsSummary = Array.from(citMap.entries()).map(([platform, v]) => ({ platform, ...v }));

  const gbp = await buildGbpContext(siteId, recentStart, priorStart, fourWeeksAgo);

  return {
    weekOf: now.toISOString().slice(0, 10),
    businessPrompt,
    industry: industryConfig
      ? { industry: industryConfig.industry, geographicTerms: industryConfig.geographicTerms }
      : undefined,
    strategyDocs,
    keywords,
    topPages,
    events,
    citationsSummary,
    gbp,
  };
}

const GBP_PERFORMANCE_FIELDS = [
  "businessImpressionsDesktopMaps",
  "businessImpressionsDesktopSearch",
  "businessImpressionsMobileMaps",
  "businessImpressionsMobileSearch",
  "callClicks",
  "websiteClicks",
  "drivingDirections",
] as const;

async function buildGbpContext(
  siteId: string,
  recentStart: Date,
  priorStart: Date,
  fourWeeksAgo: Date
): Promise<AnalystContext["gbp"]> {
  const locations = await prisma.gbpLocation.findMany({
    where: { siteId },
    select: { id: true, title: true, primaryCategory: true },
  });
  if (locations.length === 0) return undefined;

  const locIds = locations.map((l) => l.id);

  const reviews30 = await prisma.gbpReview.findMany({
    where: { locationId: { in: locIds }, createTime: { gte: fourWeeksAgo } },
    orderBy: { createTime: "desc" },
    select: { rating: true, reviewerName: true, comment: true, reply: true, createTime: true },
    take: 50,
  });
  const avgRating30d = reviews30.length
    ? Number((reviews30.reduce((s, r) => s + r.rating, 0) / reviews30.length).toFixed(2))
    : null;
  const unrepliedCount = reviews30.filter((r) => !r.reply).length;

  const metricsRows = await prisma.gbpMetricsDaily.findMany({
    where: { locationId: { in: locIds }, date: { gte: priorStart } },
  });
  const totals = { recent: {} as Record<string, number>, prior: {} as Record<string, number> };
  for (const r of metricsRows) {
    const bucket = r.date >= recentStart ? "recent" : "prior";
    for (const f of GBP_PERFORMANCE_FIELDS) {
      const val = r[f as keyof typeof r] as number;
      totals[bucket][f] = (totals[bucket][f] ?? 0) + val;
    }
  }
  const metricsDelta = GBP_PERFORMANCE_FIELDS.map((m) => ({
    metric: m,
    recent: totals.recent[m] ?? 0,
    prior: totals.prior[m] ?? 0,
  }));

  return {
    locations: locations.map((l) => ({ title: l.title, primaryCategory: l.primaryCategory })),
    recentReviews: reviews30.slice(0, 10).map((r) => ({
      rating: r.rating,
      reviewer: r.reviewerName,
      comment: r.comment,
      replied: !!r.reply,
      occurredAt: r.createTime,
    })),
    avgRating30d,
    reviewCount30d: reviews30.length,
    unrepliedCount,
    metricsDelta,
  };
}

/* ── Prompt builder ── */

function buildAnalystPrompt(c: AnalystContext): string {
  return `You are the SeedTech Strategy Analyst — a senior SEO strategist briefing the team on the upcoming week. Your output is read by both humans (the agency owner) AND downstream AI agents (blog writer, content calendar, metadata generator) on this same platform. Be specific, concrete, and prioritize ruthlessly.

═══ BUSINESS CONTEXT ═══
${c.businessPrompt}
${c.industry ? `\nIndustry: ${c.industry.industry}\nGeographic terms: ${c.industry.geographicTerms.join(", ") || "(none)"}` : ""}

═══ ACTIVE STRATEGY DOCUMENTS (existing decisions — respect these) ═══
${c.strategyDocs.length === 0 ? "(none yet)" : c.strategyDocs
  .map((d) => `### ${d.title} (${d.category.replace(/_/g, " ")})\n${d.content}`)
  .join("\n\n---\n\n")}

═══ TRACKED KEYWORDS (top 30 by impressions, last 28d) ═══
${c.keywords.length === 0 ? "(no keywords tracked)" : c.keywords
  .map((k) => {
    const delta = k.currentPosition && k.previousPosition ? k.previousPosition - k.currentPosition : null;
    const deltaStr = delta === null ? "" : delta > 0 ? ` ↑${delta}` : delta < 0 ? ` ↓${-delta}` : " —";
    return `• "${k.keyword}" [${k.tier}/${k.intent}] target=${k.targetPage} pos=${k.currentPosition ?? "?"}${deltaStr} clicks=${k.clicks28d} impr=${k.impressions28d}`;
  })
  .join("\n")}

═══ TOP PAGES (GA4, last 7d vs prior 7d) ═══
${c.topPages.length === 0 ? "(no GA4 data yet)" : c.topPages
  .map((p) => {
    const sessDelta = p.sessionsPrior > 0 ? Math.round(((p.sessionsRecent - p.sessionsPrior) / p.sessionsPrior) * 100) : null;
    const sessStr = sessDelta === null ? "" : ` (${sessDelta > 0 ? "+" : ""}${sessDelta}%)`;
    return `• ${p.url} sessions=${p.sessionsRecent}${sessStr} conv=${p.conversionsRecent} (prior ${p.conversionsPrior}) eng=${(p.engagementRate * 100).toFixed(0)}%`;
  })
  .join("\n")}

═══ RECENT EVENTS (last 14d, newest first) ═══
${c.events.length === 0 ? "(no events recorded yet)" : c.events
  .map((e) => `• [${e.severity}] ${e.type} — ${e.title} (${e.occurredAt.toISOString().slice(0, 10)})`)
  .join("\n")}

═══ GOOGLE BUSINESS PROFILE (last 7d vs prior 7d) ═══
${!c.gbp ? "(GBP not connected or no locations synced)" : `Locations: ${c.gbp.locations.map((l) => `${l.title}${l.primaryCategory ? ` (${l.primaryCategory})` : ""}`).join("; ") || "(none)"}
Reviews last 30d: ${c.gbp.reviewCount30d} (avg ${c.gbp.avgRating30d ?? "n/a"}★) — ${c.gbp.unrepliedCount} unreplied
Recent reviews:
${c.gbp.recentReviews.length === 0 ? "  (none)" : c.gbp.recentReviews.map((r) => `  • ${r.rating}★ ${r.reviewer ?? "Anonymous"}${r.replied ? " [replied]" : " [UNREPLIED]"} — ${(r.comment ?? "(no text)").slice(0, 140)}`).join("\n")}
Performance deltas:
${c.gbp.metricsDelta.map((m) => {
  const delta = m.prior > 0 ? Math.round(((m.recent - m.prior) / m.prior) * 100) : null;
  return `  • ${m.metric}: ${m.recent} (prior ${m.prior}${delta === null ? "" : `, ${delta > 0 ? "+" : ""}${delta}%`})`;
}).join("\n")}`}

═══ AI CITATIONS (last 28d, brand mention rate by platform) ═══
${c.citationsSummary.length === 0 ? "(no citation checks run yet)" : c.citationsSummary
  .map((s) => `• ${s.platform}: ${s.mentions}/${s.total} mentions (${s.total ? Math.round((s.mentions / s.total) * 100) : 0}%)`)
  .join("\n")}

═══ TASK ═══
Produce 3–5 priority items for the upcoming week. Each must be:
1. **Specific** — name a real URL, keyword, post, or platform from the data above. No generic advice ("write more content," "improve SEO").
2. **Justified** — cite the specific data point that triggered it (a position drop, a conversion spike, an unanswered review, a citation gap).
3. **Actionable** — describe what someone should DO this week, not just notice. Suggest the agent or human responsible if relevant ("Have the Blog Drafter agent refresh /blog/X" vs "Reply to the 1-star review on GBP").
4. **Prioritized** — severity high/medium/low. At most 2 high.

Also write a 200–400 word **narrative** that summarizes the state of the site, what changed this week, and the through-line of the priorities. This narrative will be read into every future AI prompt on this site, so make it dense with specifics, not boilerplate.

Return ONLY valid JSON, no markdown fences:
{
  "weekOf": "${c.weekOf}",
  "narrative": "markdown summary, 200-400 words",
  "priorities": [
    {
      "title": "short imperative — e.g., 'Refresh /blog/managed-it-cost decaying post'",
      "severity": "high" | "medium" | "low",
      "why": "1-2 sentences citing the specific data",
      "action": "1-3 sentences on what to do this week",
      "targets": { "pages": ["..."], "keywords": ["..."], "events": ["event.type"] }
    }
  ]
}`;
}

/* ── Render markdown ── */

function renderDocMarkdown(out: AnalystOutput): string {
  const sevIcon = (s: string) => (s === "high" ? "🔴" : s === "medium" ? "🟡" : "🟢");
  const lines: string[] = [];
  lines.push(`# Weekly Priorities — Week of ${out.weekOf}`);
  lines.push("");
  lines.push(`> Generated by the Strategy Analyst agent. This brief is read by every other AI feature on the platform.`);
  lines.push("");
  lines.push("## Narrative");
  lines.push("");
  lines.push(out.narrative);
  lines.push("");
  lines.push("## Priorities");
  lines.push("");
  for (const [i, p] of Array.from(out.priorities.entries())) {
    lines.push(`### ${i + 1}. ${sevIcon(p.severity)} ${p.title}`);
    lines.push("");
    lines.push(`**Why:** ${p.why}`);
    lines.push("");
    lines.push(`**Action:** ${p.action}`);
    if (p.targets) {
      const t: string[] = [];
      if (p.targets.pages?.length) t.push(`Pages: ${p.targets.pages.join(", ")}`);
      if (p.targets.keywords?.length) t.push(`Keywords: ${p.targets.keywords.join(", ")}`);
      if (p.targets.events?.length) t.push(`Events: ${p.targets.events.join(", ")}`);
      if (t.length) {
        lines.push("");
        lines.push(`**Targets:** ${t.join(" · ")}`);
      }
    }
    lines.push("");
  }
  return lines.join("\n");
}
