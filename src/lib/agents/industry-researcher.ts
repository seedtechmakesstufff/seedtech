/* ── Industry Researcher Agent ──────────────────────────────────────────────
 * Weekly: fetches primary/credible sources for each industry vertical the
 * client serves (law, restaurant, trucking/logistics, general), extracts
 * novel insights via Claude, and stores them as ResearchSignal rows.
 *
 * The Brief Generator consumes fresh signals first — so content is grounded
 * in real-world events (regulatory changes, court decisions, seasonal trends,
 * industry data) rather than recycled keyword loops.
 *
 * Source strategy:
 *   - Trucking/logistics : FMCSA (RSS), FreightWaves, DAT, OOIDA
 *   - Law firms          : CourtListener (RSS), ABA Journal, Justia
 *   - Restaurants        : FDA food safety, NRA SmartBrief, FSR Magazine
 *   - General            : Harvard Business Review, industry-agnostic signals
 *
 * Each source is fetched as RSS/Atom XML, parsed without external deps
 * (lightweight regex-based extraction), then batched into Claude which
 * evaluates novelty/relevance and extracts structured insight objects.
 * ─────────────────────────────────────────────────────────────────────────── */

import { prisma } from "@/lib/prisma";
import { getBusinessContextForSite } from "@/lib/business-context";
import { callClaude, stripJsonFences, addUsage, ZERO_USAGE, type ClaudeUsage } from "@/lib/claude";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const MODEL = "claude-sonnet-4-6";

// How far back we consider a source item "fresh" (skip older items)
const MAX_ITEM_AGE_DAYS = 14;
// Max signals to produce per agent run
const MAX_SIGNALS_PER_RUN = 12;
// Skip sources whose domain already produced a signal in the last N days (dedup)
const SOURCE_DEDUP_DAYS = 7;

export interface IndustryResearcherResult {
  signalsCreated: number;
  signalIds: string[];
  sourcesChecked: number;
  errors: string[];
  model: string;
  usage: ClaudeUsage;
}

// ── Source registry ───────────────────────────────────────────────────────────

interface RssSource {
  industry: "trucking" | "law" | "restaurant" | "general";
  domain: string;
  label: string;
  feedUrl: string;
}

const SOURCES: RssSource[] = [
  // ── Trucking / Logistics ──
  {
    industry: "trucking",
    domain: "fmcsa.dot.gov",
    label: "FMCSA News",
    feedUrl: "https://www.fmcsa.dot.gov/newsroom/news/rss.xml",
  },
  {
    industry: "trucking",
    domain: "trucking.org",
    label: "ATA News",
    feedUrl: "https://www.trucking.org/rss/news",
  },
  {
    industry: "trucking",
    domain: "overdriveonline.com",
    label: "Overdrive Magazine",
    feedUrl: "https://www.overdriveonline.com/feed/",
  },
  {
    industry: "trucking",
    domain: "ttnews.com",
    label: "Transport Topics",
    feedUrl: "https://www.ttnews.com/rss/news",
  },
  // ── Law Firms ──
  {
    industry: "law",
    domain: "abajournal.com",
    label: "ABA Journal",
    feedUrl: "https://www.abajournal.com/feed/",
  },
  {
    industry: "law",
    domain: "law360.com",
    label: "Law360 Breaking News",
    feedUrl: "https://www.law360.com/rss/articles",
  },
  {
    industry: "law",
    domain: "courtlistener.com",
    label: "CourtListener Opinions",
    feedUrl: "https://www.courtlistener.com/feed/search/?q=&type=o&order_by=score+desc&stat_Precedential=on",
  },
  {
    industry: "law",
    domain: "justia.com",
    label: "Justia Legal News",
    feedUrl: "https://news.justia.com/feed",
  },
  // ── Restaurants ──
  {
    industry: "restaurant",
    domain: "fda.gov",
    label: "FDA Food Safety Alerts",
    feedUrl: "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/food-safety-recalls-market-withdrawals-safety-alerts/rss.xml",
  },
  {
    industry: "restaurant",
    domain: "restaurant.org",
    label: "National Restaurant Association",
    feedUrl: "https://restaurant.org/research-and-media/media/press-releases/feed/",
  },
  {
    industry: "restaurant",
    domain: "fsrmagazine.com",
    label: "FSR Magazine",
    feedUrl: "https://www.fsrmagazine.com/rss.xml",
  },
  {
    industry: "restaurant",
    domain: "qsrmagazine.com",
    label: "QSR Magazine",
    feedUrl: "https://www.qsrmagazine.com/rss.xml",
  },
  // ── General / Business ──
  {
    industry: "general",
    domain: "hbr.org",
    label: "Harvard Business Review",
    feedUrl: "https://hbr.org/feeds/topics/small-business",
  },
  {
    industry: "general",
    domain: "sba.gov",
    label: "SBA News",
    feedUrl: "https://www.sba.gov/rss/news-and-views",
  },
];

// ── RSS parser (no external deps) ────────────────────────────────────────────

interface FeedItem {
  title: string;
  url: string;
  description: string;
  publishedAt: Date | null;
}

function parseRssFeed(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  // Match both <item> (RSS) and <entry> (Atom)
  const itemPattern = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemPattern.exec(xml)) !== null) {
    const block = match[1];

    const title = extractTag(block, "title") ?? "";
    // Prefer <link href="..."> (Atom) then <link>text</link> (RSS)
    const linkHref = extractAttr(block, "link", "href");
    const linkText = extractTag(block, "link");
    const url = linkHref ?? linkText ?? "";
    const description =
      extractTag(block, "description") ??
      extractTag(block, "content:encoded") ??
      extractTag(block, "summary") ??
      "";
    const pubDate =
      extractTag(block, "pubDate") ??
      extractTag(block, "published") ??
      extractTag(block, "updated") ??
      null;

    if (!title || !url) continue;

    let publishedAt: Date | null = null;
    if (pubDate) {
      const d = new Date(pubDate);
      if (!isNaN(d.getTime())) publishedAt = d;
    }

    items.push({
      title: stripHtml(title).trim(),
      url: url.trim(),
      description: stripHtml(description).slice(0, 600).trim(),
      publishedAt,
    });
  }

  return items;
}

function extractTag(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}(?:[^>]*)><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}(?:[^>]*)>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = re.exec(xml);
  if (!m) return null;
  return (m[1] ?? m[2] ?? "").trim() || null;
}

function extractAttr(xml: string, tag: string, attr: string): string | null {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, "i");
  const m = re.exec(xml);
  return m ? m[1].trim() : null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// ── Fetch a single feed (with timeout) ───────────────────────────────────────

async function fetchFeed(source: RssSource): Promise<FeedItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(source.feedUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "SeedTechSEO/1.0 (research-bot)" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRssFeed(xml);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

// ── Claude extraction prompt ──────────────────────────────────────────────────

function buildExtractionPrompt(
  businessContext: string,
  industry: string,
  items: Array<{ source: RssSource; item: FeedItem }>
): string {
  const itemBlock = items
    .map(
      ({ source, item }, i) =>
        `[${i + 1}] SOURCE: ${source.label} (${source.domain})
TITLE: ${item.title}
URL: ${item.url}
DATE: ${item.publishedAt?.toISOString().slice(0, 10) ?? "unknown"}
DESCRIPTION: ${item.description || "(none)"}`
    )
    .join("\n\n---\n\n");

  return `You are a research analyst helping a digital marketing agency (SeedTech) identify industry insights that their clients should be writing about. The client vertical is: ${industry.toUpperCase()}.

Your job is NOT to write the article. You are extracting insights from real primary sources so the content team can write original, authoritative pieces grounded in actual events — not generic AI slop.

═══ BUSINESS CONTEXT ═══
${businessContext}

═══ RAW SOURCE ITEMS (${items.length} items) ═══
${itemBlock}

═══ TASK ═══
Review each item above. Select ONLY items that:
1. Contain something genuinely novel — a regulatory change, new data, court ruling, recall, market shift, or trend
2. Are relevant to businesses in the ${industry} industry or their clients/customers
3. Would make for a piece of content that people would actually share or find useful — NOT something covered to death already
4. Are recent (last 2 weeks preferred)

For each selected item (pick 1–4 max, quality over quantity), produce a structured insight:

- headline: One punchy sentence (≤15 words) summarising the insight. Plain English, no jargon.
- insight: 2–4 sentences explaining WHY this matters to a ${industry} business or their clients. Be specific.
- contentAngle: A concrete article angle/thesis — e.g. "What the new FMCSA sleep apnea rule means for owner-operators and how to prepare". Should be different enough from the source headline that it adds value.
- keywords: 3–5 search queries a ${industry} business's customer might type related to this insight (lowercase, no quotes)
- shareScore: 0–100 — how likely is a ${industry} professional to share this article? (80+ = genuinely new/important; 40–79 = useful but not urgent; <40 = skip it)
- recencyScore: 0–100 — how fresh is the source? (90+ = last 3 days; 70–89 = last week; 50–69 = last 2 weeks; <50 = older)

Return ONLY valid JSON, no markdown fences:
{
  "signals": [
    {
      "sourceIndex": 1,
      "headline": "...",
      "insight": "...",
      "contentAngle": "...",
      "keywords": ["...", "..."],
      "shareScore": 75,
      "recencyScore": 85
    }
  ]
}

If NONE of the items meet the quality bar, return: { "signals": [] }`;
}

// ── Main agent ────────────────────────────────────────────────────────────────

export async function runIndustryResearcher(siteId: string): Promise<IndustryResearcherResult> {
  const result: IndustryResearcherResult = {
    signalsCreated: 0,
    signalIds: [],
    sourcesChecked: 0,
    errors: [],
    model: MODEL,
    usage: { ...ZERO_USAGE },
  };

  const businessCtx = await getBusinessContextForSite(siteId);
  const businessSummary = [
    `Company: ${businessCtx.companyName}`,
    `Domain: ${businessCtx.domain}`,
    businessCtx.primaryService ? `Primary service: ${businessCtx.primaryService}` : "",
    businessCtx.secondaryServices?.length ? `Services: ${businessCtx.secondaryServices.join(", ")}` : "",
    businessCtx.location ? `Location: ${businessCtx.location}` : "",
    businessCtx.targetAudience ? `Target audience: ${businessCtx.targetAudience}` : "",
  ].filter(Boolean).join("\n");

  // Find domains that already produced a signal recently (dedup)
  const dedupCutoff = new Date();
  dedupCutoff.setUTCDate(dedupCutoff.getUTCDate() - SOURCE_DEDUP_DAYS);
  const recentSignals = await db.researchSignal.findMany({
    where: { siteId, createdAt: { gte: dedupCutoff } },
    select: { sourceDomain: true, sourceUrl: true },
  });
  const recentDomains = new Set((recentSignals as Array<{ sourceDomain: string; sourceUrl: string }>).map((s) => s.sourceDomain));
  const recentUrls = new Set((recentSignals as Array<{ sourceDomain: string; sourceUrl: string }>).map((s) => s.sourceUrl));

  const ageCutoff = new Date();
  ageCutoff.setUTCDate(ageCutoff.getUTCDate() - MAX_ITEM_AGE_DAYS);

  // Group sources by industry for batched Claude calls
  const byIndustry = new Map<string, Array<{ source: RssSource; item: FeedItem }>>();

  for (const source of SOURCES) {
    if (result.signalsCreated >= MAX_SIGNALS_PER_RUN) break;
    // Skip domains that already produced a signal this dedup window
    if (recentDomains.has(source.domain)) continue;
    result.sourcesChecked++;

    let items: FeedItem[];
    try {
      items = await fetchFeed(source);
    } catch (e) {
      result.errors.push(`Fetch error for ${source.domain}: ${e instanceof Error ? e.message : String(e)}`);
      continue;
    }

    // Filter to fresh, unseen items
    const freshItems = items.filter((item) => {
      if (recentUrls.has(item.url)) return false;
      if (item.publishedAt && item.publishedAt < ageCutoff) return false;
      return true;
    });

    if (freshItems.length === 0) continue;

    const existing = byIndustry.get(source.industry) ?? [];
    // Take top 5 items per source to keep prompt manageable
    for (const item of freshItems.slice(0, 5)) {
      existing.push({ source, item });
    }
    byIndustry.set(source.industry, existing);
  }

  // Process each industry batch with Claude
  for (const [industry, batch] of Array.from(byIndustry.entries())) {
    if (result.signalsCreated >= MAX_SIGNALS_PER_RUN) break;
    if (batch.length === 0) continue;

    const prompt = buildExtractionPrompt(businessSummary, industry, batch);

    let claudeText = "";
    try {
      const r = await callClaude({ model: MODEL, maxTokens: 3000, prompt });
      claudeText = r.text;
      result.usage = addUsage(result.usage, r.usage);
    } catch (e) {
      result.errors.push(`Claude fetch error for ${industry}: ${e instanceof Error ? e.message : String(e)}`);
      continue;
    }

    const cleaned = stripJsonFences(claudeText);
    let parsed: { signals: Array<{
      sourceIndex: number;
      headline: string;
      insight: string;
      contentAngle: string;
      keywords: string[];
      shareScore: number;
      recencyScore: number;
    }> };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      result.errors.push(`Invalid JSON from Claude for ${industry}: ${claudeText.slice(0, 200)}`);
      continue;
    }

    for (const sig of parsed.signals ?? []) {
      // Skip low-quality signals
      if (sig.shareScore < 40) continue;

      const sourceEntry = batch[sig.sourceIndex - 1];
      if (!sourceEntry) continue;
      const { source, item } = sourceEntry;

      // Skip if we already have a signal from this exact URL
      if (recentUrls.has(item.url)) continue;

      try {
        const created = await db.researchSignal.create({
          data: {
            siteId,
            sourceUrl: item.url,
            sourceDomain: source.domain,
            sourceTitle: item.title,
            publishedAt: item.publishedAt,
            industry,
            headline: sig.headline,
            insight: sig.insight,
            contentAngle: sig.contentAngle,
            keywords: sig.keywords,
            shareScore: Math.min(100, Math.max(0, sig.shareScore)),
            recencyScore: Math.min(100, Math.max(0, sig.recencyScore)),
            status: "fresh",
          },
        });
        result.signalIds.push(created.id);
        result.signalsCreated++;
        recentDomains.add(source.domain);
        recentUrls.add(item.url);
      } catch (e) {
        result.errors.push(`DB write error: ${e instanceof Error ? e.message : String(e)}`);
      }

      if (result.signalsCreated >= MAX_SIGNALS_PER_RUN) break;
    }
  }

  return result;
}
