/* ── Agent Configs ──────────────────────────────────────────────────────────
 * Static metadata for each agent: display info, config details, and the
 * tuning context Claude uses when suggesting prompt/config changes.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface AgentConfig {
  key: string;
  label: string;
  cadence: string;
  cronPath: string;
  manualEndpoint: string;
  /** What this agent does, in plain English */
  what: string;
  /** What it reads */
  reads: string[];
  /** What it writes */
  writes: string[];
  /** Configurable knobs displayed in the modal */
  settings: Array<{ label: string; value: string; note?: string }>;
  /** Full context passed to Claude for AI tuning suggestions */
  tuningContext: string;
}

export const AGENT_CONFIGS: Record<string, AgentConfig> = {
  "industry-researcher": {
    key: "industry-researcher",
    label: "Industry Researcher",
    cadence: "Monday 8:00 AM UTC",
    cronPath: "/api/cron/industry-researcher",
    manualEndpoint: "/api/admin/agents/industry-researcher/run",
    what: "Fetches primary/authoritative RSS sources across your client verticals, sends batches to Claude for novelty evaluation, and stores actionable research signals the Brief Generator consumes first.",
    reads: [
      "14 RSS/Atom feeds across 4 verticals (trucking, law, restaurant, general)",
      "Existing ResearchSignal rows (for deduplication — skips domains/URLs seen last 7 days)",
      "Business profile (company name, services, location)",
    ],
    writes: [
      "ResearchSignal rows (status: fresh) — up to 12 per run",
    ],
    settings: [
      { label: "Max signals per run", value: "12", note: "Capped to control Claude API spend" },
      { label: "Source dedup window", value: "7 days", note: "Domains seen within this window are skipped" },
      { label: "Max item age", value: "14 days", note: "Feed items older than this are ignored" },
      { label: "Min share score to save", value: "40 / 100", note: "Claude scores each item; below 40 is dropped" },
      { label: "Items per source feed", value: "5 max", note: "Top 5 fresh items per feed passed to Claude" },
      { label: "Claude model", value: "claude-sonnet-4-20250514" },
    ],
    tuningContext: `File: src/lib/agents/industry-researcher.ts

Key constants:
- MAX_SIGNALS_PER_RUN = 12
- SOURCE_DEDUP_DAYS = 7
- MAX_ITEM_AGE_DAYS = 14
- MIN_SHARE_SCORE (implicit) = 40  — signals with shareScore < 40 are skipped
- Items per source: top 5 fresh items per feed

Source registry (14 feeds):
Trucking: fmcsa.dot.gov, trucking.org (ATA), overdriveonline.com, ttnews.com
Law: abajournal.com, law360.com, courtlistener.com, justia.com
Restaurant: fda.gov (food safety), restaurant.org, fsrmagazine.com, qsrmagazine.com
General: hbr.org, sba.gov

Claude extraction prompt instructs Claude to:
- Select only items with genuine novelty (regulatory changes, court rulings, recalls, market shifts)
- Score shareScore (0-100: how likely a professional shares this) and recencyScore (0-100: how fresh)
- Produce: headline (≤15 words), insight (2-4 sentences), contentAngle (specific article thesis), keywords (3-5 queries)
- Return JSON { signals: [ { sourceIndex, headline, insight, contentAngle, keywords, shareScore, recencyScore } ] }`,
  },

  "strategy-analyst": {
    key: "strategy-analyst",
    label: "Strategy Analyst",
    cadence: "Monday 10:00 AM UTC",
    cronPath: "/api/cron/strategy-analyst",
    manualEndpoint: "/api/admin/agents/strategy-analyst/run",
    what: "Reads all available data and writes a weekly strategy brief explaining what keywords to prioritise, what content gaps exist, and what actions to take. This brief feeds into the Brief Generator.",
    reads: [
      "TrackedKeyword rows (positions, clicks, impressions, trends)",
      "GscDailyKeyword data (last 28 days)",
      "BlogPost rows (published, draft)",
      "SeoInsight rows (active)",
      "Business profile",
      "Past SeoStrategyDoc rows",
    ],
    writes: [
      "SeoStrategyDoc row (source: ai-strategy-analyst) — upserted weekly",
    ],
    settings: [
      { label: "Claude model", value: "claude-sonnet-4-20250514" },
      { label: "Max tokens", value: "4096" },
      { label: "Strategy doc source tag", value: "ai-strategy-analyst" },
    ],
    tuningContext: `File: src/lib/agents/strategy-analyst.ts

The analyst prompt instructs Claude to produce a structured SeoStrategyDoc with:
- Executive summary (what changed this week)
- Keyword priorities (tier 1/2/3 breakdown, position changes)
- Content gaps (missing subtopics, decayed posts)
- Recommended actions (3-5 specific tasks for the Brief Generator to act on)
- Competitive context (if competitor data exists)

The output is stored as Markdown in SeoStrategyDoc.content with source="ai-strategy-analyst".
The Brief Generator reads this doc and uses it as its primary strategic context.`,
  },

  "brief-generator": {
    key: "brief-generator",
    label: "Brief Generator",
    cadence: "Monday 10:30 AM UTC",
    cronPath: "/api/cron/brief-generator",
    manualEndpoint: "/api/admin/agents/brief-generator/run",
    what: "Produces 2–3 structured content briefs per week. Prioritises fresh research signals over pure keyword analysis. Each brief is a detailed plan for one blog post (refresh or new).",
    reads: [
      "ResearchSignal rows (status: fresh, sorted by shareScore desc) — up to 6",
      "Latest SeoStrategyDoc (source: ai-strategy-analyst)",
      "Top 40 TrackedKeyword by impressions28d",
      "Last 30 published BlogPost rows",
      "5 most recent KeywordCluster rows + subtopics",
      "60 active SitePage rows (for internal-link suggestions)",
    ],
    writes: [
      "content_brief AgentArtifact rows (2–3 per run, max 5)",
      "Marks consumed ResearchSignal rows as status: consumed",
    ],
    settings: [
      { label: "Briefs per run", value: "2–3 (capped at 5)" },
      { label: "Keywords fetched", value: "Top 40 by impressions28d" },
      { label: "Recent posts lookback", value: "Last 30 published posts" },
      { label: "Research signals consumed", value: "Up to 6 per run" },
      { label: "Claude model", value: "claude-sonnet-4-20250514" },
      { label: "Max tokens", value: "4096" },
    ],
    tuningContext: `File: src/lib/agents/brief-generator.ts

The brief generator prompt explicitly tells Claude:
"PRIORITY: If fresh research signals exist, use them FIRST."

Each brief payload (ContentBriefPayload) contains:
- type: "refresh" | "new"
- targetKeyword, targetSlug, title, intent, funnelStage, wordCountTarget
- sections: [{h2, bullets}] — 5-8 H2s with 2-4 sub-bullets each
- mustInclude: SeedTech blog standards (citeable opening, entity definition, FAQ, CTA, etc.)
- internalLinks: 3-6 existing site paths
- sourcesToCite: 2-4 authority domains
- reasoning: 2-3 sentences citing the specific data trigger
- researchSignalId: set when brief is derived from a ResearchSignal

The prompt rules include:
- Mix refresh + new content
- Prefer high-impression/low-CTR keywords for refresh
- Sections must be CONCRETE ("Pricing factors that matter for NJ MSPs", not "Pricing")
- For signal-based briefs, always include sourceDomain in sourcesToCite`,
  },

  "blog-drafter": {
    key: "blog-drafter",
    label: "Blog Drafter",
    cadence: "Daily 12:00 PM UTC",
    cronPath: "/api/cron/blog-drafter",
    manualEndpoint: "/api/admin/agents/blog-drafter/run",
    what: "Picks up approved content_brief artifacts and writes full blog posts in Markdown. Queues them as blog_draft artifacts for human review before publishing.",
    reads: [
      "Approved content_brief AgentArtifact rows",
      "Business profile + tone of voice",
      "SeoStrategyDoc (for strategic framing)",
      "InternalLinkSuggestion rows (to wire in real links)",
    ],
    writes: [
      "blog_draft AgentArtifact rows (one per approved brief)",
    ],
    settings: [
      { label: "Claude model", value: "claude-sonnet-4-20250514" },
      { label: "Max tokens", value: "8192" },
      { label: "Cadence", value: "Daily — picks up any new approved briefs" },
    ],
    tuningContext: `File: src/lib/agents/blog-drafter.ts

The blog drafter prompt instructs Claude to write a complete, publish-ready blog post:
- Must follow the exact brief structure (H2s, mustInclude items)
- E-E-A-T signals: cite real sources, include author expertise framing
- FAQ section with 4-6 questions and direct answers
- Structured data hints (FAQ schema, Article schema)
- Internal links wired to real site paths from the brief
- CTA closing paragraph matching business tone
- Word count target from brief (typically 1200–2000 words)
- Markdown output with front matter (title, metaTitle, metaDescription, targetKeyword)`,
  },

  "gbp-post-drafter": {
    key: "gbp-post-drafter",
    label: "GBP Post Drafter",
    cadence: "Monday 11:30 AM UTC",
    cronPath: "/api/cron/gbp-post-drafter",
    manualEndpoint: "/api/admin/agents/gbp-post-drafter/run",
    what: "Drafts 1–2 Google Business Profile post ideas per location. Human must upload an image and edit the copy before the Approve button is enabled. On approval, publishes to the GBP API.",
    reads: [
      "GbpLocation rows (or creates a stub if none synced yet)",
      "Past GbpPost rows with viewCount/clickCount (90-day lookback)",
      "GbpMetricsDaily rows (60-day lookback)",
      "Recent BlogPost rows (last 28 days, for cross-promotion ideas)",
      "Business profile",
    ],
    writes: [
      "gbp_post_draft AgentArtifact rows (1–2 per location)",
    ],
    settings: [
      { label: "Ideas per location", value: "1–2" },
      { label: "Performance lookback", value: "90 days (CTR by topic type)" },
      { label: "Recent posts lookback", value: "60 days (avoid repeating topics)" },
      { label: "Blog cross-promotion", value: "Last 28 days of published posts" },
      { label: "Image required", value: "Yes — Approve is blocked without an uploaded image" },
      { label: "Claude model", value: "claude-sonnet-4-20250514" },
    ],
    tuningContext: `File: src/lib/agents/gbp-post-drafter.ts

The GBP drafter prompt produces post *ideas* (not finished posts):
- summary: 100–300 characters. Hook → value → implied CTA.
- topicType: STANDARD | OFFER | EVENT | ALERT
- ctaType + ctaUrl: real URLs only (blog posts, service pages)
- imagePrompt: 1-2 sentences describing the ideal photo/graphic
- reasoning: 1 sentence citing a metric, blog post, or performance insight

Performance analysis (analysePostPerformance):
- Groups past posts by topicType, computes CTR (clickCount/viewCount)
- Identifies top-performing type, high-CTR posts (inspiration), low-CTR posts (avoid)
- This analysis is injected into the prompt as structured blocks

Similarity dedup: checks new ideas against recent GbpPost rows using vector similarity.
If score > threshold: converts to a different angle or flags a warning.`,
  },

  "keyword-scout": {
    key: "keyword-scout",
    label: "Keyword Scout",
    cadence: "Monday 9:00 AM UTC",
    cronPath: "/api/cron/keyword-scout",
    manualEndpoint: "/api/admin/agents/keyword-scout/run",
    what: "Mines GSC query data to surface queries that get impressions but aren't tracked yet. Adds them as TrackedKeyword rows for the Strategy Analyst to prioritise.",
    reads: [
      "GscDailyKeyword rows (last 28 days)",
      "Existing TrackedKeyword rows (for deduplication)",
    ],
    writes: [
      "New TrackedKeyword rows for untracked queries above impression threshold",
    ],
    settings: [
      { label: "Min impressions to qualify", value: "10 (28-day total)" },
      { label: "GSC lookback", value: "28 days" },
    ],
    tuningContext: `File: src/lib/agents/keyword-scout.ts

The scout finds queries in GscDailyKeyword that:
- Have >= 10 impressions in last 28 days
- Don't already exist in TrackedKeyword for this site
- Optionally: have CTR < 5% (indicating ranking but not clicking = optimisation opportunity)

New keywords are upserted with tier=tier2, intent inferred from query pattern
(transactional if contains "cost/price/hire", commercial if contains "best/top",
navigational if contains brand name, else informational).`,
  },

  "content-decay-watcher": {
    key: "content-decay-watcher",
    label: "Content Decay Watcher",
    cadence: "Daily 5:30 AM UTC",
    cronPath: "/api/cron/content-decay-watcher",
    manualEndpoint: "/api/admin/agents/content-decay-watcher/run",
    what: "Detects published blog posts that are losing traffic or positions over time and creates SeoInsight rows flagging them for refresh.",
    reads: [
      "Published BlogPost rows",
      "GscDailyKeyword rows (position trend, last 28 vs prior 28 days)",
    ],
    writes: [
      "SeoInsight rows (type: content_freshness) for decaying posts",
    ],
    settings: [
      { label: "Position drop threshold", value: "> 5 positions lost" },
      { label: "Click drop threshold", value: "> 30% drop vs prior period" },
      { label: "Comparison window", value: "Last 28 days vs prior 28 days" },
    ],
    tuningContext: `File: src/lib/agents/content-decay-watcher.ts

Decay detection logic:
- Compares avg position last 28d vs prior 28d per keyword/page
- Flags if position dropped > 5 places OR clicks dropped > 30%
- Creates a SeoInsight with type=content_freshness, linking to the affected page
- The Strategy Analyst reads active SeoInsight rows and incorporates them into its brief`,
  },

  "internal-link-agent": {
    key: "internal-link-agent",
    label: "Internal Link Agent",
    cadence: "Daily 7:00 AM UTC",
    cronPath: "/api/cron/internal-link-agent",
    manualEndpoint: "/api/admin/agents/internal-link-agent/run",
    what: "Suggests internal links between pages and posts that share topic clusters but don't currently cross-link. Surfaces them as InternalLinkSuggestion rows.",
    reads: [
      "Published BlogPost rows",
      "SitePage rows",
      "KeywordCluster + ClusterSubtopic rows",
      "Existing InternalLinkSuggestion rows (for deduplication)",
    ],
    writes: [
      "InternalLinkSuggestion rows (status: pending)",
    ],
    settings: [
      { label: "Mode", value: "daily (incremental)" },
    ],
    tuningContext: `File: src/lib/agents/internal-link-agent.ts

The agent runs in two modes:
- daily: scans recent posts (last 7 days) for new linking opportunities
- full: scans all active pages

For each page pair, it checks:
- Shared keyword cluster membership
- Semantic similarity of target keywords
- Whether a link already exists or has been suggested

Suggestions include: sourcePageUrl, targetPageUrl, anchorText, context (surrounding sentence), reason.`,
  },

  "page-opportunity-scout": {
    key: "page-opportunity-scout",
    label: "Page Opportunity Scout",
    cadence: "Monday 8:00 AM UTC",
    cronPath: "/api/cron/page-opportunity-scout",
    manualEndpoint: "/api/admin/agents/page-opportunity-scout/run",
    what: "Scans SitePage rows against GSC data to identify underperforming service, location, and landing pages. Flags low-CTR pages, invisible pages with impressions, and pages with missing metadata as SeoInsight rows.",
    reads: [
      "SitePage rows (all pages for site)",
      "GscDailyPage rows (impressions, clicks, position, last 28 days)",
      "PageMetadata rows (existing title/description)",
      "Existing active SeoInsight rows (for deduplication)",
    ],
    writes: [
      "SeoInsight rows (type: page_opportunity)",
    ],
    settings: [
      { label: "Low-CTR threshold", value: "Rank 5–20, ≥50 impressions, CTR < 3%" },
      { label: "No-metadata threshold", value: "Rank 5–20 with no PageMetadata row" },
      { label: "Zero-impressions threshold", value: "Page age > 60 days, 0 impressions" },
      { label: "Max insights per run", value: "8" },
    ],
    tuningContext: `File: src/lib/agents/page-opportunity-scout.ts

Pure heuristic agent (no Claude call). Checks four rule types:
1. low_ctr: rank 5-20, ≥50 impressions, CTR < 3% → likely fixable with better title/meta
2. no_metadata: rank 5-20 but no PageMetadata row exists yet
3. zero_impressions: page older than 60 days with 0 GSC impressions
4. missing_og: page has PageMetadata but no OG fields

Skips pages already flagged with an active page_opportunity insight.
Priority: 80 for low_ctr/no_metadata, 50 for others.
Results sorted by impressions desc, capped at 8 per run.`,
  },

  "page-drafter": {
    key: "page-drafter",
    label: "Page Drafter",
    cadence: "Monday 11:30 AM UTC",
    cronPath: "/api/cron/page-drafter",
    manualEndpoint: "/api/admin/agents/page-drafter/run",
    what: "Reads active page_opportunity SeoInsight rows and calls Claude to draft optimised page copy — title, meta description, H1, body sections, FAQs, and internal link suggestions. Creates page_draft AgentArtifact rows for approval.",
    reads: [
      "SeoInsight rows (type: page_opportunity, status: active)",
      "PageMetadata rows (current title/description for context)",
      "SitePage rows (page kind, path)",
      "Existing page_draft AgentArtifact rows (for deduplication)",
    ],
    writes: [
      "AgentArtifact rows (type: page_draft, status: pending)",
    ],
    settings: [
      { label: "Max drafts per run", value: "4" },
      { label: "Claude model", value: "claude-3-5-haiku-20241022" },
      { label: "Max tokens", value: "2000" },
    ],
    tuningContext: `File: src/lib/agents/page-drafter.ts

Reads page_opportunity insights, calls Claude once per page to generate:
- draftTitle (≤60 chars): SEO-optimised page title
- draftDescription (≤160 chars): compelling meta description with CTA
- draftH1: the primary on-page heading
- sections[]: 2-4 content sections with heading + 2-3 sentences each
- faqItems[]: 2-3 Q&A pairs targeting featured snippets
- internalLinksToAdd[]: anchor text + target URL suggestions
- reasoning: why this approach

On approval in the Inbox: upserts PageMetadata (title, description, ogTitle, ogDescription) and resolves the triggering SeoInsight. Does NOT auto-edit .tsx page files — copy is surfaced for manual application.`,
  },

  "weekly-digest": {
    key: "weekly-digest",
    label: "Weekly Digest Email",
    cadence: "Monday 1:00 PM UTC (9 AM EDT)",
    cronPath: "/api/cron/weekly-digest",
    manualEndpoint: "/api/admin/agents/weekly-digest/run",
    what: "Assembles a Monday-morning summary email covering pending inbox items, GBP ideas, keyword movements, decay alerts, and the strategy brief. Sends via Resend to configured recipients.",
    reads: [
      "Pending AgentArtifact rows (all types)",
      "Latest SeoStrategyDoc",
      "SeoInsight rows (active)",
      "GbpPost ideas (pending gbp_post_draft artifacts)",
      "EmailConfig (recipients)",
    ],
    writes: [
      "CronJobRun row (weekly_digest or weekly_digest_manual)",
      "Sends email via Resend",
    ],
    settings: [
      { label: "Send day", value: "Monday (cron) or manual" },
      { label: "Recipients", value: "Configured in Digest tab → Recipients section" },
      { label: "Email provider", value: "Resend" },
      { label: "GBP ideas included", value: "Up to 10 pending gbp_post_draft artifacts" },
    ],
    tuningContext: `File: src/lib/weekly-digest.ts

The digest email is assembled as an HTML email with sections:
1. Pending inbox items count + link to /admin/inbox
2. GBP ideas table (idea, type badge, image suggestion, approve link)
3. Strategy brief excerpt (from latest SeoStrategyDoc)
4. Active SEO insights (decay, opportunities)
5. Keyword movement highlights

The email template is inline-styled HTML (Resend compatible).
Recipients are pulled from EmailConfig.notifyRecipients (comma-separated).
Falls back to DIGEST_RECIPIENTS env var if no DB config exists.`,
  },
};
