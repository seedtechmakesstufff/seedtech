# SEO Autopilot — Agent Reference

Comprehensive reference for the agentic layer of SeedTech SEO Autopilot. Built on top of the existing scoring/sync stack (Phases 1–7); this is what we're calling Phase 8 (core agents) + Phase 9 (Industry Researcher).

The shape of the system: **data flows in → Industry Researcher fetches primary sources → events fire → analyst writes a brief → drafters produce artifacts → human approves in Inbox → publishers ship the change.** You are the approval bottleneck, not the work bottleneck.

---

## 1. Architecture at a glance

```
                                ┌─────────────────────────┐
                                │  External data sources  │
                                │  GSC · GA4 · GBP        │
                                └────────────┬────────────┘
                                             │ daily sync
                                             ▼
┌────────────────┐    ┌──────────────────────────────────────────┐
│ Existing       │    │  Persisted state                         │
│ scoring        │◀───┤  GscDailyKeyword · PageMetrics ·         │
│ (Phases 1–7)   │    │  GbpLocation/Post/Review/MetricsDaily ·  │
│ E-E-A-T, AIO,  │    │  TrackedKeyword · KeywordCluster ·       │
│ AI Visibility, │    │  BlogPost · ContentScore · AICitation    │
│ Citations      │    └─────────────────┬────────────────────────┘
└────────────────┘                      │
                                        │ events emitted on changes
                                        ▼
                              ┌─────────────────────┐
                              │  Event log          │  ← memory layer
                              │  content.*          │
                              │  metrics.*          │
                              │  keyword.*          │
                              │  gbp.*              │
                              │  audit.*            │
                              │  citation.*         │
                              │  agent.*            │
                              └──────────┬──────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │  Agents             │
                              │  (this document)    │
                              └──────────┬──────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              ▼                          ▼                          ▼
     ┌────────────────┐         ┌────────────────┐         ┌────────────────┐
     │ SeoStrategyDoc │         │ AgentArtifact  │         │ TrackedKeyword │
     │ (advisory)     │         │ (review queue) │         │ InternalLink-  │
     │ → all AI       │         │ → Inbox        │         │ Suggestion     │
     │   features     │         │ → publisher    │         │ → direct       │
     │   read these   │         │ → live change  │         │   write        │
     └────────────────┘         └────────────────┘         └────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │  Weekly Digest      │
                              │  email → recipient  │
                              └─────────────────────┘
```

### Core primitives

- **`Event`** ([prisma/schema.prisma](../../prisma/schema.prisma)) — append-only log of meaningful changes. Type is dotted (`content.published`, `metrics.conversion_drop`, etc.). Severity = `info | warn | critical`. Agents read this as "what changed since last run."
- **`AgentArtifact`** ([prisma/schema.prisma](../../prisma/schema.prisma)) — review-queue items. State machine: `pending_review → approved → published | failed`, or `pending_review → rejected`. Each type registers a publisher that runs on approval.
- **Publishers** ([src/lib/agent-artifact-publishers.ts](../../src/lib/agent-artifact-publishers.ts)) — concrete actions wired to artifact types: post a GBP reply, publish a blog post, edit post body, etc.
- **`runTrackedJob()`** ([src/lib/cron-runner.ts](../../src/lib/cron-runner.ts)) — wraps every agent invocation in a `CronJobRun` row for observability.
- **`SiteContext` + `requireSiteContext()`** — every artifact and event is per-site (multi-tenant).

---

## 2. Schema additions (Phase 8)

All in [prisma/schema.prisma](../../prisma/schema.prisma); migrations live in `prisma/migrations/manual/phase8-*.sql`.

### Integration credentials
- `IntegrationType.google_business_profile` (new enum value)
- `IntegrationCredential` — extended for OAuth (encryptedCredentials, authType="oauth")

### Google Business Profile
- `GbpLocation` — per-site, one row per location, with metadata + lastSyncedAt
- `GbpPost` — local posts (STANDARD/OFFER/EVENT/ALERT) we've published or seen on the location
- `GbpReview` — reviews we've synced (reviewName is the unique key per location)
- `GbpMetricsDaily` — Performance API daily metrics: impressions × {desktop/mobile} × {maps/search}, calls, website clicks, directions, bookings, conversations, food orders, food menu clicks

### Google Analytics 4
- `PageMetrics` — daily per-URL: sessions, users, engagedSessions, engagementRate, averageEngagementTime, bounceRate, conversions, revenue. `source` field distinguishes ga4 vs manual.

### Agent core
- `Event` — append-only, indexed by `(siteId, occurredAt)`, `(siteId, type, occurredAt)`, `(siteId, severity, occurredAt)`, `(entityType, entityId)`
- `AgentArtifact` — indexed by `(siteId, state)`, `(siteId, agent)`, `(siteId, type)`, `(entityType, entityId)`

---

## 3. The agents

Each section: what it reads, what it writes, when it runs, what the artifact (if any) looks like, what approval does, and known edge cases.

---

### 3.0 Industry Researcher *(Phase 9)*

**Purpose:** Prevents the content loop from becoming a closed, repetitive echo chamber. Fetches primary/authoritative sources across the client's industry verticals and extracts novel insights via Claude. These `ResearchSignal` rows are the first thing the Brief Generator reads — so briefs are grounded in real-world events, not recycled keyword loops.

**Cron:** Monday 5:00 UTC — runs *before* all other agents so signals are available for the Brief Generator at 8:30 UTC (`/api/cron/industry-researcher`)

**Manual trigger:** `POST /api/admin/agents/industry-researcher/run`

**Reads:**
- Business profile (companyName, primaryService, location, targetAudience)
- Existing `ResearchSignal` rows (for deduplication — skips domains/URLs seen in last 7 days)

**Source registry (14 feeds, 4 verticals):**

| Vertical | Sources |
|---|---|
| **Trucking / Logistics** | FMCSA.dot.gov, trucking.org (ATA), overdriveonline.com, ttnews.com |
| **Law firms** | abajournal.com, law360.com, courtlistener.com, justia.com |
| **Restaurants** | fda.gov (food safety recalls), restaurant.org (NRA), fsrmagazine.com, qsrmagazine.com |
| **General / Business** | hbr.org (small business), sba.gov |

**What Claude does per industry batch:**
- Reads up to 5 fresh items per source feed
- Evaluates novelty — regulatory changes, court rulings, recalls, market shifts, new data
- Rejects generic/evergreen content and items already widely covered
- Scores each item: `shareScore` (0–100, how likely a professional would share this) and `recencyScore`
- Skips anything scoring below 40

**Writes:** `ResearchSignal` rows (up to 12 per run) with:
- `headline` — one punchy sentence
- `insight` — 2–4 sentences on *why this matters* to the client's clients
- `contentAngle` — a specific, original article thesis derived from the source
- `keywords` — 3–5 search queries the angle maps to
- `status: fresh` → changes to `consumed` when a brief is created from it

**Output (DB only, no inbox artifact):**
```
ResearchSignal {
  industry: "trucking"
  headline: "FMCSA proposes mandatory sleep apnea screening for CDL holders"
  insight: "New proposed rule would require drivers flagged by medical examiners to undergo sleep apnea testing before license renewal. Owner-operators and small carriers face the highest compliance burden..."
  contentAngle: "What the FMCSA sleep apnea rule means for owner-operators: timeline, costs, and how to prepare"
  keywords: ["fmcsa sleep apnea rule", "cdl sleep apnea requirements", "dot medical examination trucking"]
  shareScore: 87
  sourceDomain: "fmcsa.dot.gov"
}
```

**Signal lifecycle:**
1. `fresh` — available for Brief Generator to consume
2. `consumed` — a brief was created; `consumedBy` points to the artifact ID
3. `dismissed` — manually dismissed in future UI (low quality / not relevant)

---

### 3.1 Strategy Analyst

**File:** [src/lib/agents/strategy-analyst.ts](../../src/lib/agents/strategy-analyst.ts)
**Model:** `claude-sonnet-4-20250514`
**Cron:** Monday 8:00 UTC (`/api/cron/strategy-analyst`)
**Manual trigger:** `POST /api/admin/agents/strategy-analyst/run`

**Inputs (reuses existing context loaders, no parallel system):**
- `getBusinessContextForSite()` + `buildStrategyPrompt()` from [src/lib/business-context.ts](../../src/lib/business-context.ts)
- `IndustryConfig` for vertical + geographic terms
- All active `SeoStrategyDoc`s in every category (keyword_strategy, audit_findings, content_roadmap, competitive_analysis, general)
- Top 30 `TrackedKeyword` by impressions28d with current/previous positions
- Top 20 `PageMetrics` from last 14d vs prior 14d (sessions, conversions, engagement)
- `Event` rows from last 14d
- `AICitation` last 28d aggregated by platform
- GBP locations + last 30d reviews + 7d performance deltas (impressions split by Maps/Search × Desktop/Mobile, calls, clicks, directions)

**Output:**
- New `SeoStrategyDoc` (category=`general`, source=`ai-strategy-analyst`, title=`Weekly Priorities — Week of YYYY-MM-DD`)
- Previous analyst-authored doc is deactivated (only the freshest one feeds prompts)
- One `agent.run_completed` event with priority count

**Artifact:** None. The brief is advisory — humans don't approve/reject it. It's a `SeoStrategyDoc` because every existing AI feature (metadata generator, blog writer, AI advisor, [src/lib/seo-context.ts](../../src/lib/seo-context.ts)) already reads active strategy docs. The analyst writes once; everything downstream picks it up automatically.

**Output structure:**
```json
{
  "weekOf": "2026-05-10",
  "narrative": "200-400 word markdown summary woven into future prompts",
  "priorities": [
    {
      "title": "Refresh /blog/foo decaying post",
      "severity": "high" | "medium" | "low",
      "why": "1-2 sentences citing data",
      "action": "1-3 sentences on what to do",
      "targets": { "pages": [...], "keywords": [...], "events": [...] }
    }
  ]
}
```

At most 2 `high` per week (rule in the prompt).

---

### 3.2 Brief Generator *(upgraded — signal-first in Phase 9)*

**File:** [src/lib/agents/brief-generator.ts](../../src/lib/agents/brief-generator.ts)
**Model:** `claude-sonnet-4-20250514`
**Cron:** Monday 8:30 UTC (after Strategy Analyst, `/api/cron/brief-generator`)
**Manual trigger:** `POST /api/admin/agents/brief-generator/run`

**Inputs (priority order):**
1. **Fresh `ResearchSignal` rows** (Phase 9) — up to 6, sorted by shareScore desc. These are consumed first.
2. Latest analyst `SeoStrategyDoc` (source = `ai-strategy-analyst`)
3. Top 40 `TrackedKeyword` by impressions28d
4. Last 30 published `BlogPost` rows (slug + title + targetKeyword + updatedAt)
5. 5 most recent `KeywordCluster`s with subtopics (filtered to `contentStatus !== "published"`)
6. 60 active `SitePage` rows (for internal-link suggestions)

**Signal-first logic:** Claude is explicitly instructed to derive briefs from research signals before falling back to keyword/cluster analysis. If a brief uses a signal, `researchSignalId` is stored in the payload and the signal is marked `consumed` in the DB. `sourcesToCite` always includes the signal's `sourceDomain` for proper attribution.

**Output:** 2–3 `content_brief` artifacts (capped at 5).

**Artifact payload (`ContentBriefPayload`):**
```ts
{
  type: "refresh" | "new",
  targetKeyword: string,
  targetSlug: string,                  // existing slug for refresh; proposed for new
  title: string,
  intent: "informational" | "commercial" | "transactional" | "navigational",
  funnelStage: "TOFU" | "MOFU" | "BOFU",
  wordCountTarget: number,
  sections: [{ h2: string, bullets: string[] }],   // 5-8 sections, 2-4 bullets each
  mustInclude: string[],               // "citeable opening", "FAQ section", etc.
  internalLinks: string[],             // 3-6 existing site paths
  sourcesToCite: string[],             // 2-4 authority domains
  reasoning: string,                   // cites the specific data trigger
  similarityWarning?: SimilarityWarning // see §5 Duplicate guard
}
```

**Duplicate guard:** Each `type: "new"` brief is run through `findSimilarPublishedPosts()` ([src/lib/dedup.ts](../../src/lib/dedup.ts)). TF-IDF cosine similarity against all published `BlogPost` bodies:
- Score ≥ 0.55 → **auto-converted to `type: "refresh"`** with `targetSlug` set to the matched post + blue "Auto-converted to refresh" badge in Inbox
- 0.35 ≤ score < 0.55 → kept as new + yellow "Potential duplicate" warning in Inbox
- < 0.35 → kept silently

**Approval flow:** Approving sets the artifact to `state=approved` (no immediate publisher action). The Blog Drafter cron picks it up next, OR the human clicks "Draft now" in the Inbox to skip the wait.

---

### 3.3 Blog Drafter

**File:** [src/lib/agents/blog-drafter.ts](../../src/lib/agents/blog-drafter.ts)
**Models:** `claude-sonnet-4-20250514` (default) or `claude-haiku-4-5-20251001` (fast mode)
**Cron:** Daily 10:00 UTC (`/api/cron/blog-drafter`)
**Manual trigger:** `POST /api/admin/agents/blog-drafter/run` with optional `{ briefId, fast, max }`

**Behavior:**
- Picks up `content_brief` artifacts in `state=approved` that haven't been drafted yet (capped at 3 per run by default)
- Runs in parallel with concurrency 2 — cuts a 3-brief run from ~90s sequential to ~45s
- `fast: true` uses Haiku — 3–5× faster, slightly less polish. Can also set `BLOG_DRAFTER_MODEL=fast` env var.

**For each brief:**
- Builds full markdown post following the brief's sections + mustInclude rules
- For `type: "refresh"`: updates the existing `BlogPost` (status stays `draft`)
- For `type: "new"`: creates a new `BlogPost` (slug uniqueness enforced with `-2`, `-3` suffixes)
- Marks the consumed brief artifact as `state=published`
- Creates a `blog_draft` artifact in `state=pending_review`

**Artifact payload (`BlogDraftPayload`):**
```ts
{
  briefArtifactId: string,
  blogPostId: string,
  title: string,
  slug: string,
  excerpt: string,
  metaTitle: string,
  metaDescription: string,
  bodyPreview: string,          // first 400 chars
  wordCount: number,
  targetKeyword: string,
  type: "refresh" | "new"
}
```

**Approval flow:** Publisher flips `BlogPost.status` to `published` + sets `publishedAt` + emits `content.published` event. Post-publish hook fires the Internal Link Agent for that post (fire-and-forget).

**Inbox UI:** Card shows title/slug/word count + excerpt + 400-char body preview + "Open in editor" link to `/admin/blog/[id]` for full inline editing before approval.

---

### 3.4 GBP Post Drafter

**File:** [src/lib/agents/gbp-post-drafter.ts](../../src/lib/agents/gbp-post-drafter.ts)
**Model:** `claude-sonnet-4-20250514`
**Cron:** Monday 9:30 UTC (`/api/cron/gbp-post-drafter`)
**Manual trigger:** `POST /api/admin/agents/gbp-post-drafter/run`

**Inputs:**
- All `GbpLocation`s for the site (title + primary category + websiteUri)
- Last 90d `GbpPost`s per location with `viewCount` + `clickCount` (per-post performance data from GBP Insights API)
- Last 60d `GbpMetricsDaily` aggregated per location (calls, website clicks, directions)
- Last 8 published `BlogPost`s (optional amplification material)

**Performance analysis (new in Phase 8.1):**
Before calling Claude, `analysePostPerformance()` runs per location:
- Groups past posts by `topicType`, computes avg CTR (`clickCount / viewCount`)
- Identifies the best-performing type (e.g. "OFFER (avg CTR 8.3%)")
- Flags the top 3 high-CTR posts as inspiration references
- Flags the bottom posts with CTR < 2% as topics to avoid
- Posts without performance data yet are still listed to prevent topic repetition
- The formatted insights block feeds directly into the Claude prompt

**Output:** 1–2 GBP post *ideas* per location (not finished posts — see below).

**Framing shift:** The agent produces **content ideas**, not publish-ready copy. The summary is intentionally shorter (100–300 chars vs the old 100–500) to leave room for the human to personalise it. An `imagePrompt` field describes the ideal photo/graphic to guide the upload.

**Artifact payload (`GbpPostDraftPayload`):**
```ts
{
  locationDbId: string,
  locationResource: string,       // "locations/12345"
  accountResource: string,        // "accounts/67890"
  topicType: "STANDARD" | "EVENT" | "OFFER" | "ALERT",
  summary: string,                // 100–300 chars — editable in Inbox
  ctaType: GbpCtaType | null,
  ctaUrl: string | null,
  imagePrompt: string,            // e.g. "Before-and-after of a recent project"
  uploadedImageUrl: string | null, // null at creation; set by human before approving
  reasoning: string,              // cites performance data / metric trigger
  performanceContext: {
    topPerformingType: string,    // e.g. "OFFER (avg CTR 8.3%)"
    avoidedTopics: string[],      // low-CTR topic angles
    highPerformers: string[]      // high-CTR reference posts
  },
  similarityWarning?: SimilarityWarning
}
```

**Duplicate guard:** Same as before — TF-IDF against last 90d `GbpPost.summary`. ≥ 0.55 → dropped; 0.35–0.55 → yellow warning.

**CTA URL validation:** Unchanged — validated against the site/location domain allowlist.

**Approval flow:**
1. Human opens the Inbox card
2. Uploads an image (drag-drop or file picker → `POST /api/admin/integrations/gbp/artifacts/[id]/upload-image` → Vercel Blob → URL stored back on payload)
3. Edits the summary inline if needed
4. Clicks **Approve & Publish** — button is disabled until `uploadedImageUrl` is set
5. Publisher validates image is present (hard block even for bulk-approve), calls `createGbpLocalPost()` with `media: [{ mediaFormat: "PHOTO", sourceUrl }]`, persists into `gbp_posts`, emits `gbp.post_published`

**Inbox UI:** Redesigned card shows: image upload zone (drag-drop or click) with preview once uploaded + italicised image suggestion hint, editable summary textarea, topic type + CTA chip, live CTA URL validation, performance context panel (top type, high-CTR references, avoided topics). Approve button is disabled with an explanatory message until an image is uploaded.

---

### 3.5 GBP Review Reply Drafter

**Embedded in:** [src/lib/gbp-sync.ts](../../src/lib/gbp-sync.ts) (no standalone agent file)
**Model:** `claude-sonnet-4-20250514`
**Cron:** Daily 7:30 UTC as part of GBP sync (`/api/cron/gbp-sync`)
**Manual trigger:** `POST /api/admin/integrations/gbp/sync`

**Trigger:** Every time GBP sync sees a review that's new to our DB AND doesn't already have a reply, it drafts one with Claude.

**Inputs (per draft):**
- Business context from `getBusinessContextForSite()`
- Location title
- Review rating, reviewer name, comment

**Prompt rules:**
- 40–90 words
- Address reviewer by first name if provided
- 4–5 stars: warm thanks, reference something specific in their comment, soft invite back
- 1–3 stars: acknowledge empathetically, take ownership without excuses, offer concrete next step
- Never argue or dispute facts
- Never include URLs unless business context provides one
- Sign off with the business name

**Artifact payload:**
```ts
{
  reviewName: string,                  // GBP resource ID
  reply: string,                       // editable in Inbox
  rating: number,
  reviewerName: string | null,
  locationTitle: string
}
```

**Approval flow:** Publisher calls `replyToGbpReview()` (PUT to v4 API), updates the local `GbpReview.reply` so future syncs don't re-detect it as needs-reply, emits `gbp.post_published` event.

**Inbox UI:** Reply text is inline-editable via a `<textarea>`. On Approve, the edited text replaces the draft before publishing.

---

### 3.6 Keyword Scout

**File:** [src/lib/agents/keyword-scout.ts](../../src/lib/agents/keyword-scout.ts)
**No LLM call** — heuristics only
**Cron:** Monday 7:00 UTC (`/api/cron/keyword-scout`)
**Manual trigger:** `POST /api/admin/agents/keyword-scout/run`

**Inputs:**
- Last 28d `GscDailyKeyword` rows aggregated by query
- Existing `TrackedKeyword` set (case-insensitive)
- Open artifacts of type `keyword_candidate` (don't duplicate)
- `SitePage` rows for target page suggestion
- `BusinessProfile.brandEntities` + `companyName` for navigational-intent detection

**Filter:**
- Min 50 impressions in the lookback window
- Skip queries already tracked or already queued
- Min query length 3 chars

**Heuristics:**
- **Intent**:
  - Brand token in query → `navigational`
  - "buy", "price", "cost", "near me", "appointment", etc. → `transactional`
  - "best", "top", "vs", "review", "compare", "versus" → `commercial`
  - "how", "what", "why", "guide", "tutorial", etc. → `informational`
  - Default → `informational`
  - Word-boundary checks (avoids "top" matching inside "topic")
- **Tier**: ≥1000 impressions = tier1, ≥200 = tier2, else tier3
- **Target page**: token overlap against `SitePage.path` + `title`; service pages get +0.5 boost (only when score > 0)

**Output:** Top 15 candidates as `keyword_candidate` artifacts.

**Artifact payload:**
```ts
{
  keyword: string,
  intent: KeywordIntent,
  tier: KeywordTier,
  targetPage: string,
  clicks28d: number,
  impressions28d: number,
  ctr28d: number,
  position: number,                    // avg position over the window
  reason: string                       // e.g. "873 impressions, 2 clicks · page 2-3 candidate"
}
```

**Approval flow:** Publisher upserts a `TrackedKeyword` row (composite unique on `siteId+keyword`), emits `keyword.new_ranking` event.

---

### 3.7 Content Decay Watcher

**File:** [src/lib/agents/content-decay-watcher.ts](../../src/lib/agents/content-decay-watcher.ts)
**Model:** `claude-sonnet-4-20250514` (used to write the refresh brief per detected post)
**Cron:** Daily 6:30 UTC (`/api/cron/content-decay-watcher`)
**Manual trigger:** `POST /api/admin/agents/content-decay-watcher/run`

**Decay signals (any one triggers detection):**
1. Conversions dropped from ≥3 to 0 (last 14d vs prior 14d)
2. Sessions in last 14d < 50% of prior 14d (with floor: prior must have had ≥30 sessions)
3. A `TrackedKeyword` targeting `/blog/<slug>` lost ≥5 positions (currentPosition vs previousPosition)
4. Post hasn't been updated in 9+ months AND impressions trending down

**Idempotency:** Skips slugs that already have an open `content_brief` artifact in `state ∈ {pending_review, approved}`.

**Cap:** Max 3 briefs per run (avoids flooding the Inbox).

**For each decayed post:** Calls Claude with the post body (first 4000 chars) + decay reasons + metrics. Output is a structured refresh brief (forced to `type: "refresh"` with the original slug). Same payload shape as Brief Generator's output.

**Side effects:**
- Creates a `content_brief` artifact in `state=pending_review`
- Emits `audit.issue_detected` event with severity `warn`, payload includes the decay reasons + metrics + brief artifact ID

**Note:** Different from a manual refresh because the agent reads the actual current post body and proposes structured changes vs. starting from scratch.

---

### 3.8 Internal Link Agent

**File:** [src/lib/agents/internal-link-agent.ts](../../src/lib/agents/internal-link-agent.ts)
**No LLM call** — TF-IDF similarity from [src/lib/semantic-embeddings.ts](../../src/lib/semantic-embeddings.ts)
**Cron:** Daily 12:00 UTC (`/api/cron/internal-link-agent`)
**Manual trigger:** `POST /api/admin/agents/internal-link-agent/run` with optional `{ postId }`

Also fires automatically (fire-and-forget) when:
- A `blog_draft` artifact is approved (post-publish hook in [src/lib/agent-artifact-publishers.ts](../../src/lib/agent-artifact-publishers.ts))
- A blog post is published via the existing `/api/blog/[id]` PUT route

**Modes:**
- **`post`**: scan one specific post (used by the publish hooks)
- **`daily`**: sweep posts published in the last 30 days that don't already have an open `link_suggestions` artifact

**Per source post:**
- Build TF-IDF corpus over all published post bodies
- **Outgoing candidates**:
  1. Similar published posts not yet linked (similarity ≥ 0.18, capped 5 per source) — anchor = target's `targetKeyword` or title; context = first sentence in source containing the phrase
  2. Active `SitePage`s whose title tokens appear ≥2× in the source body but aren't yet linked
- Upserts `InternalLinkSuggestion` rows (idempotent via `@@unique(siteId, sourcePageUrl, targetPageUrl)`)
- Batches all suggestions for one source into a single `link_suggestions` artifact

**Artifact payload (`LinkSuggestionsPayload`):**
```ts
{
  sourcePageUrl: string,
  sourcePostId: string,
  suggestions: [{
    suggestionId: string,
    sourcePageUrl: string,
    targetPageUrl: string,
    anchorText: string,
    context: string,
    reason: string
  }]
}
```

**Approval flow:** Publisher calls `applyLinkSuggestions()`:
- For each suggestion, finds the first verbatim occurrence of the anchor in the post body using a smart regex (handles non-word-boundary anchors like `(premium)`)
- Wraps it in a markdown link
- Skips if the anchor isn't found (post was edited since suggestion was generated) — non-fatal
- Skips if the target URL is already linked (de-double-link guard)
- Marks the `InternalLinkSuggestion` row `status=accepted`
- Updates the `BlogPost.body` once at the end
- Emits `content.updated` event with applied/skipped counts

---

### 3.9 Weekly Digest Email

**File:** [src/lib/weekly-digest.ts](../../src/lib/weekly-digest.ts)
**Cron:** Monday 11:00 UTC (`/api/cron/weekly-digest`) — fires after all Monday agents
**Manual trigger:** `POST /api/admin/agents/weekly-digest/run` (from the Digest tab in admin)

**Inputs:**
- Last 7d `CronJobRun` rows grouped by `jobType` (OK/fail counts + total duration)
- Last 7d `Event` rows (counts by type + verbatim list of warn/critical)
- Latest active `SeoStrategyDoc` from the analyst (markdown narrative)
- Currently-pending `AgentArtifact` count + sample list

**Recipient resolution** (in `resolveDigestRecipients`):
1. Explicit override (manual trigger preview)
2. `EmailConfig.reportToEmail` (edited via Digest tab UI)
3. `ReportPreference` rows (legacy)
4. `WEEKLY_DIGEST_RECIPIENT` env var
5. Hardcoded SeedTech default

**Base URL resolution** (so email links work):
1. Explicit `appBaseUrl` argument
2. `WEEKLY_DIGEST_BASE_URL` env var (recommended for production — prevents dev port leakage)
3. `NEXT_PUBLIC_SITE_URL`
4. `NEXTAUTH_URL`
5. `https://seedtechllc.com`

**Output sections in the email:**
- Inbox pending count + Open Inbox button
- **GBP content ideas table (new)** — if any `gbp_post_draft` artifacts are pending, a distinct blue callout table appears with: idea title, topic type badge, image suggestion (italicised), and a direct "Add image & approve →" link to the Inbox. This surfaces GBP work separately from the general pending count so it's impossible to miss.
- This week's strategy brief (markdown rendered to inline-styled HTML)
- Agent runs table
- Events table (top 12 types + a "Worth a closer look" list of warn/critical)

Uses the existing Resend `sendEmail` helper and respects `EmailBranding`.

---

## 4. Cron schedule (full)

All times UTC. Defined in [vercel.json](../../vercel.json).

```
Mon 06:00   /api/cron/seo                   weekly snapshot/crawl/insights (Phase 1-7)
daily 06:30 /api/cron/content-decay-watcher  decay detection → refresh briefs
Mon 07:00   /api/cron/keyword-scout          GSC → keyword candidates
daily 07:00 /api/cron/ga4-sync               GA4 page metrics + anomaly events
daily 07:30 /api/cron/gbp-sync               GBP sync + auto-draft review replies
Mon 08:00   /api/cron/strategy-analyst       weekly priority brief
Mon 08:30   /api/cron/brief-generator        2-3 content briefs queued
Mon 09:30   /api/cron/gbp-post-drafter       1-2 GBP posts per location queued
daily 10:00 /api/cron/blog-drafter           drains approved briefs into drafts
Mon 11:00   /api/cron/weekly-digest          email summary
daily 12:00 /api/cron/internal-link-agent    daily link-suggestion sweep
```

The Monday cascade is intentionally staggered so each agent reads fresh data from the prior step:
06:00 snapshot → 06:30 decay check → 07:00 keyword scout + GA4 sync → 07:30 GBP sync → 08:00 analyst → 08:30 briefs → 09:30 GBP posts → 11:00 digest.

Cron auth: every cron route uses `authenticateCron(req)` which checks `Authorization: Bearer ${CRON_SECRET}`.

---

## 5. Duplicate guard (cross-cutting)

**File:** [src/lib/dedup.ts](../../src/lib/dedup.ts)

Deterministic TF-IDF + cosine similarity (no LLM). Wired into Brief Generator (new posts) and GBP Post Drafter.

### Thresholds

| Agent | < WARN | WARN ≤ score < CONVERT/DROP | ≥ CONVERT/DROP |
|---|---|---|---|
| Brief Generator (new) | keep silently | yellow warning chip | auto-convert to refresh |
| GBP Post Drafter | keep silently | yellow warning chip | **dropped before queueing** |

Constants in `BRIEF_THRESHOLDS` and `GBP_POST_THRESHOLDS` — current values are WARN=0.35, CONVERT=DROP=0.55.

### What you see in the Inbox

- **Blue chip** "Auto-converted to refresh" — appears on a refresh-type brief whose original new-type proposal crossed the 0.55 threshold. Links to the matched existing post.
- **Yellow chip** "Potential duplicate" — appears on a brief or GBP post in the warning zone. Shows the matched URL/title (for briefs) or matched summary + date (for GBP posts), plus the similarity score.

### Implementation notes

- TF-IDF vectors over `title + targetKeyword + section H2s` (briefs) or the post `summary` (GBP).
- For briefs, compared against all published `BlogPost` bodies + titles + targetKeyword + excerpts.
- For GBP posts, compared against last 90 days of `GbpPost.summary`.
- Refresh briefs are skipped (they already target a specific existing slug — similarity is expected).
- Empty corpus / empty candidate → no warning (early return).

### Tuning

Empirical observation: unrelated English content lands at 0.10–0.25, same-topic-different-angle at 0.30–0.50, near-duplicates at 0.55+. Adjust thresholds in [src/lib/dedup.ts](../../src/lib/dedup.ts) based on your corpus.

---

## 6. AgentArtifact lifecycle + publisher registry

### States

```
pending_review ──approve──▶ approved ──publisher──▶ published
       │                       │
       │                       └──publisher fails──▶ failed (publishError populated)
       │
       └──reject──▶ rejected
```

Some artifact types (e.g. `content_brief`) don't have a publisher — approving just sets `state=approved` and a downstream agent picks them up (Blog Drafter cron drains approved briefs).

### Registered publishers

In [src/lib/agent-artifact-publishers.ts](../../src/lib/agent-artifact-publishers.ts):

| Artifact type | Publisher action |
|---|---|
| `review_reply_draft` | `replyToGbpReview()` → updates local `GbpReview.reply` so future syncs don't re-detect |
| `blog_draft` | Flips `BlogPost.status` to `published`, sets `publishedAt`, emits `content.published`, fires Internal Link Agent (fire-and-forget) |
| `gbp_post_draft` | Validates CTA URL, calls `createGbpLocalPost()`, persists into local `gbp_posts` table, emits `gbp.post_published` |
| `link_suggestions` | `applyLinkSuggestions()` — edits the source post body in place, marks accepted suggestions, emits `content.updated` |
| `keyword_candidate` | Upserts `TrackedKeyword`, emits `keyword.new_ranking` |
| `content_brief` | (none — Blog Drafter cron consumes) |

### Bulk actions

- `POST /api/inbox/bulk-approve` — max 50 IDs per call, sequential publisher execution, returns per-id results. Site-scoping enforced.
- `POST /api/inbox/bulk-reject` — max 100 per call, optional notes.

---

## 7. Event types (taxonomy)

Constants in [src/lib/events.ts](../../src/lib/events.ts):

| Type | Severity (typical) | Emitted by |
|---|---|---|
| `content.published` | info | `/api/blog/[id]` PUT, `blog_draft` publisher |
| `content.updated` | info | `/api/blog/[id]` PUT, `link_suggestions` publisher |
| `content.unpublished` | warn | `/api/blog/[id]` PUT |
| `keyword.moved` | info | (reserved — wire when GSC sync produces position deltas) |
| `keyword.new_ranking` | info | Keyword Scout approval |
| `keyword.lost` | warn | (reserved) |
| `metrics.conversion_spike` | info | GA4 sync (≥3 conversions AND ≥2× prior 7d) |
| `metrics.conversion_drop` | warn | GA4 sync (had ≥3, now 0) |
| `metrics.traffic_spike` | info | (reserved) |
| `metrics.traffic_drop` | warn | (reserved) |
| `citation.gained` | info | (reserved — citation diff) |
| `citation.lost` | warn | (reserved) |
| `audit.issue_detected` | warn | Content Decay Watcher |
| `audit.issue_resolved` | info | (reserved) |
| `gbp.review_received` | info / warn | GBP sync (warn for ≤3-star) |
| `gbp.post_published` | info | `gbp_post_draft` / `review_reply_draft` publishers |
| `agent.run_completed` | info | Strategy Analyst |
| `agent.artifact_created` | info | `createArtifact()` helper |

Query API: `GET /api/events?types=...&severity=...&since=...&until=...&entityType=...&entityId=...&limit=...`.

---

## 8. Integration foundations

### Google OAuth

[src/lib/google-oauth.ts](../../src/lib/google-oauth.ts) — single OAuth client covering GSC + GA4 + GBP scopes.

Scopes:
- GSC: `https://www.googleapis.com/auth/webmasters.readonly`
- GA4: `https://www.googleapis.com/auth/analytics.readonly`
- GBP: `https://www.googleapis.com/auth/business.manage`

Refresh tokens are AES-256-GCM encrypted ([src/lib/credential-encryption.ts](../../src/lib/credential-encryption.ts)) and persisted on `IntegrationCredential.encryptedCredentials`. State nonce + cookie CSRF check on the callback.

Connect flow:
- `GET /api/integrations/google/connect?types=google_search_console,google_analytics,google_business_profile` → Google consent → `GET /api/integrations/google/callback` → redirect to `/admin/seo/settings/integrations` with `oauth_success` or `oauth_error` param.
- `POST /api/integrations/google/disconnect` body `{ type }` → soft-deactivates (preserves history).

### GA4

[src/lib/ga4.ts](../../src/lib/ga4.ts) — lists properties (Admin API) and runs page-level reports (Data API). Property selection persisted on `IntegrationCredential.property` per site (format: `properties/12345`).

[src/lib/ga4-sync.ts](../../src/lib/ga4-sync.ts) — daily sync writes to `PageMetrics`. After upserting rows, runs `detectConversionAnomalies()` which emits `metrics.conversion_spike` or `metrics.conversion_drop` events per URL.

### GBP

[src/lib/gbp.ts](../../src/lib/gbp.ts) — wraps four Google APIs:
1. Account Management v1 (`google.mybusinessaccountmanagement`) — accounts
2. Business Information v1 (`google.mybusinessbusinessinformation`) — locations
3. Performance v1 (`businessprofileperformance.googleapis.com`) — daily metrics
4. Legacy v4 (`mybusiness.googleapis.com/v4`) — reviews + local posts (via raw fetch since `googleapis` npm doesn't ship a v4 client)

Reviews and local posts depend on the v4 API, which Google has flagged as deprecated but is still functional. If v4 goes dark, locations + Performance metrics still work.

### Credential encryption

`CREDENTIAL_ENCRYPTION_KEY` env var — 32 bytes hex (64 hex chars). Generate with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Lose it and every stored refresh token becomes unreadable; clients have to reconnect. Treat it like a password.

---

## 9. Rate limiting

[src/lib/agent-rate-limit.ts](../../src/lib/agent-rate-limit.ts) — applied to every `POST /api/admin/agents/*` route (8 routes plus `run-all`).

Defaults per site:
- 10 manual runs per minute (`AGENT_RATE_PER_MIN` env override)
- 60 per hour (`AGENT_RATE_PER_HOUR` env override)

Returns 429 with a human-readable error when either limit is hit. In-memory only — resets on deploy / cold start, which is fine for Vercel because each instance still rate-limits bursts.

---

## 10. UI surfaces

### `/admin/seo/agents` — Agents control panel

**Two tabs:**
- **Agents** — "Run all weekly agents" hero card + 8 agent rows with cadence, description, individual Run button, last result inline
- **Digest** — recipients editor (chip-style, writes `EmailConfig.reportToEmail`), "Send preview now" button, recent digest sends history (last 20 `CronJobRun` rows)

### `/admin/inbox` — Weeks table

Single-row-per-week table. Columns: Week, Pending, Approved, Published, Total, Digest status. Click row → drill into `/admin/inbox/[week]`. Current week always shown even if empty.

### `/admin/inbox/[week]` — Per-week detail

Two main parts:
1. **Narrative section (top, collapsible)** — analyst brief for that week, markdown-rendered (h2/h3/h4, bullets, blockquotes, bold)
2. **Grouped artifact sections** — 6 categories (review replies, GBP posts, content briefs, blog drafts, keyword candidates, link suggestions) each with icon, count, group-level select-all link, and individual cards

Sticky bulk action bar appears when at least one pending item exists — "Select all (N)", count of selected, "Approve N selected" / "Reject N selected" buttons.

Per-card features:
- Checkbox (when state=pending_review)
- Expandable detail view with type-specific renderer
- Inline edit for `review_reply_draft.reply` and `gbp_post_draft.summary`
- Per-card Approve / Reject buttons
- "Draft now (Sonnet/Haiku)" for approved content_briefs
- Similarity warning chip on briefs and GBP posts
- Live CTA URL validation badge on GBP post drafts

### `/admin/seo/settings/integrations` — Google connections

Three cards (GSC, GA4, GBP) with Connect / Disconnect. "Connect all" button for one-shot consent. GA4 panel includes property selector + "Sync last 7 days" button. GBP panel includes "Sync now" button. Per-card status badge (Connected with grant date, or Not connected).

### Sidebar nav (under SEO)
- AI Context
- **Agents** (`/admin/seo/agents`)
- **Inbox** (`/admin/inbox`)
- Blog Manager
- Reports
- SEO Settings

---

## 11. Environment variables (Phase 8 only)

| Var | Required | Notes |
|---|---|---|
| `CREDENTIAL_ENCRYPTION_KEY` | yes | 32 bytes hex |
| `GOOGLE_OAUTH_CLIENT_ID` | yes | Google Cloud Console OAuth Web App |
| `GOOGLE_OAUTH_CLIENT_SECRET` | yes | same |
| `GOOGLE_OAUTH_REDIRECT_URI` | yes | `<base>/api/integrations/google/callback` |
| `CLAUDE_API_KEY` | yes | All LLM-driven agents |
| `CRON_SECRET` | yes | Bearer token for all cron routes |
| `RESEND_API_KEY` | yes | Weekly digest delivery |
| `WEEKLY_DIGEST_RECIPIENT` | no | Fallback when no `EmailConfig.reportToEmail` set |
| `WEEKLY_DIGEST_BASE_URL` | recommended | Stable URL base for email links — prefer this over `NEXTAUTH_URL` |
| `AGENT_RATE_PER_MIN` | no | Default 10 |
| `AGENT_RATE_PER_HOUR` | no | Default 60 |
| `BLOG_DRAFTER_MODEL` | no | Set to `fast` to default to Haiku |

---

## 12. Multi-tenancy

Every artifact, event, integration credential, cron run, GBP table, page metric, and AgentArtifact is per-site via `siteId`. Cron jobs iterate `getAllActiveSiteIds()` and run each agent per-site. The Inbox, Agents page, and Digest tab all operate on the active site (resolved via `requireSiteContext()` from the user's cookie).

Onboarding a new client:
1. Create a `Tenant` + `Site`
2. Add the user via `Membership`
3. Have the client OAuth-connect their Google services on `/admin/seo/settings/integrations`
4. Set `EmailConfig.reportToEmail` for that site via the Digest tab
5. Agents start firing on the next Monday cron cascade

---

## 13. Testing

`npm test` runs vitest. Current coverage (pure functions only — no DB/LLM):

| File | Tests |
|---|---|
| `src/lib/credential-encryption.test.ts` | 5 — round-trip, IV non-determinism, tamper detection, format checks |
| `src/lib/iso-week.test.ts` | 3 — toIsoWeek formatting, range round-trip, error cases |
| `src/lib/dedup.test.ts` | 7 — both threshold-decision functions across all boundaries, ordering sanity |
| `src/lib/gbp.test.ts` | 7 — `validateGbpCtaUrl` allowlist, www handling, location override, off-domain rejection, malformed URL, protocol check, null handling |
| `src/lib/agents/keyword-scout.test.ts` | 12 — intent classification, tier thresholds, target page matching with service-page boost |
| `src/lib/agents/internal-link-agent.test.ts` | 7 — `insertMarkdownLink` case sensitivity, already-linked detection, regex metacharacter escaping, single-occurrence wrapping |

Total: 41 tests. Real bugs caught by tests during initial runs: keyword-scout intent substring matching ("top" inside "topic"), suggestTargetPage service-boost on score=0, insertMarkdownLink `\b` at non-word boundaries.

---

## 14. File map (the agent layer)

```
src/lib/
├─ agent-artifacts.ts                — create/approve/reject helpers
├─ agent-artifact-publishers.ts      — registers all publishers
├─ agent-publisher-registry.ts       — tiny shared registry (broke a circular import)
├─ agent-rate-limit.ts               — per-site 429 guards
├─ credential-encryption.ts          — AES-256-GCM for OAuth refresh tokens
├─ dedup.ts                          — duplicate-content guard (TF-IDF)
├─ events.ts                         — event log helpers + EVENT_TYPES constants
├─ ga4.ts                            — Admin + Data API wrappers
├─ ga4-sync.ts                       — daily sync + anomaly detection
├─ gbp.ts                            — 4 Google APIs (accounts/locations/reviews/posts/metrics/replies/createPost)
├─ gbp-sync.ts                       — daily sync + auto-draft review replies
├─ google-oauth.ts                   — single OAuth client for GSC/GA4/GBP
├─ iso-week.ts                       — ISO 8601 week helpers
├─ weekly-digest.ts                  — digest email assembly
└─ agents/
   ├─ strategy-analyst.ts            — Mon analyst brief
   ├─ brief-generator.ts             — Mon content briefs
   ├─ blog-drafter.ts                — daily drafter
   ├─ content-decay-watcher.ts       — daily decay detection
   ├─ gbp-post-drafter.ts            — Mon GBP posts
   ├─ internal-link-agent.ts         — daily link sweep
   └─ keyword-scout.ts               — Mon keyword candidates

src/app/api/
├─ integrations/google/
│  ├─ connect/route.ts
│  ├─ callback/route.ts
│  ├─ disconnect/route.ts
│  └─ status/route.ts
├─ integrations/ga4/
│  ├─ properties/route.ts
│  └─ property/route.ts
├─ admin/integrations/
│  ├─ ga4/sync/route.ts
│  ├─ gbp/sync/route.ts
│  └─ gbp/validate-cta/route.ts
├─ admin/agents/
│  ├─ run-all/route.ts
│  ├─ strategy-analyst/run/route.ts
│  ├─ brief-generator/run/route.ts
│  ├─ blog-drafter/run/route.ts
│  ├─ gbp-post-drafter/run/route.ts
│  ├─ keyword-scout/run/route.ts
│  ├─ content-decay-watcher/run/route.ts
│  ├─ internal-link-agent/run/route.ts
│  └─ weekly-digest/run/route.ts
├─ admin/digest/
│  ├─ recipients/route.ts
│  └─ runs/route.ts
├─ cron/
│  ├─ ga4-sync/route.ts
│  ├─ gbp-sync/route.ts
│  ├─ strategy-analyst/route.ts
│  ├─ brief-generator/route.ts
│  ├─ blog-drafter/route.ts
│  ├─ gbp-post-drafter/route.ts
│  ├─ keyword-scout/route.ts
│  ├─ content-decay-watcher/route.ts
│  ├─ internal-link-agent/route.ts
│  └─ weekly-digest/route.ts
├─ inbox/
│  ├─ route.ts                       — flat list (legacy, kept for API compat)
│  ├─ weeks/route.ts                 — weekly bucket table
│  ├─ by-week/route.ts               — drill-down for one week (+ analyst narrative)
│  ├─ bulk-approve/route.ts
│  ├─ bulk-reject/route.ts
│  └─ [id]/
│     ├─ approve/route.ts
│     └─ reject/route.ts
└─ events/route.ts                   — event query API

src/app/admin/
├─ inbox/
│  ├─ page.tsx                       — weeks table
│  └─ [week]/page.tsx                — per-week detail with narrative + grouped sections
├─ seo/agents/
│  ├─ page.tsx                       — two-tab shell
│  ├─ AgentsTab.tsx                  — run-all + individual agent rows
│  └─ DigestTab.tsx                  — recipients + preview + history
└─ seo/settings/integrations/
   ├─ page.tsx                       — OAuth integrations
   ├─ Ga4Panel.tsx
   └─ GbpPanel.tsx

prisma/migrations/manual/
├─ phase8-gbp-ga4-oauth-foundation.sql
├─ phase8-event-log.sql
└─ phase8-agent-artifacts.sql
```

---

## 15. Known limitations + things to wire next

**Acknowledged gaps:**
- Event types `keyword.moved`, `keyword.lost`, `metrics.traffic_spike/drop`, `citation.gained/lost`, `audit.issue_resolved` are defined but not yet emitted from the source syncs. Wiring is a one-line change per location.
- GBP v4 API is on Google's deprecation list. Reviews/posts depend on it. Locations + Performance API are on supported APIs and will keep working.
- Brief Generator dedup is title + section H2s vs. published bodies. Doesn't catch cases where the brief's *intent* matches existing content but the wording is unique. The yellow warning chip catches most of these.
- Daily Blog Drafter cron caps at 3 briefs per run. If you approve 10 briefs Monday, it takes 4 days to drain. Bump `MAX_BRIEFS_PER_RUN` in [src/lib/agents/blog-drafter.ts](../../src/lib/agents/blog-drafter.ts) if you want faster.

**Plausible next agents:**
- **Trend Analyst** (Friday) — Perplexity related + Google Trends rising → emerging-topic briefs into the Monday Brief Generator
- **Competitor Move Detector** (weekly) — diff competitor sitemaps; queue a brief when a tracked-keyword competitor publishes
- **Schema Generator** — produce JSON-LD for posts/services missing structured data
- **Review Request Agent** — post-customer-interaction email asking for a GBP review (would need a customer event source)
- **Content Repurposing Agent** — given a blog post, produce LinkedIn post + email newsletter blurb + GBP post drafts

**Production-readiness items not yet done:**
- Multi-recipient digest with per-recipient `unsubscribe` links
- Sentry / observability beyond `CronJobRun.errorMessage`
- Admin UI for browsing `CronJobRun` history (currently DB-only)
- Per-site auto-publish toggles (every approval is manual today; some clients may want the Internal Link Agent to auto-apply, for example)
- White-label digest branding (currently uses the active site's `EmailBranding`)
