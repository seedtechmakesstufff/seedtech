# SEO Autopilot — Agent Reference

Imperative spec for every agent in the system. Each section: what the agent reads, what it writes, when it runs, and the file path of its implementation.

The system has **10 agents**. Humans are the approval bottleneck, not the work bottleneck. Every agent that produces output emits an `AgentArtifact` in `state=pending_review`. On approval, a registered publisher applies the side effect (publish post, reply to review, create GBP post, etc.).

See [architecture.md](architecture.md) for cross-cutting concerns (schema, lifecycle, events, dedup, rate limits, integrations). See [setup.md](setup.md) for env vars, OAuth, and onboarding.

---

## Agent Index

| # | Agent | File | Cron | Output |
|---|-------|------|------|--------|
| 1 | Industry Researcher | `src/lib/agents/industry-researcher.ts` | Mon 05:00 UTC | `ResearchSignal` rows |
| 2 | Strategy Analyst | `src/lib/agents/strategy-analyst.ts` | Mon 08:00 UTC | `SeoStrategyDoc` |
| 3 | Brief Generator | `src/lib/agents/brief-generator.ts` | Mon 08:30 UTC | `content_brief` artifacts |
| 4 | Blog Drafter | `src/lib/agents/blog-drafter.ts` | Daily 10:00 UTC | `blog_draft` artifacts |
| 5 | GBP Post Drafter | `src/lib/agents/gbp-post-drafter.ts` | Mon 09:30 UTC | `gbp_post_draft` artifacts |
| 6 | GBP Review Reply Drafter | `src/lib/gbp-sync.ts` (`draftReviewReply`) | Daily 07:30 UTC (in sync) | `review_reply_draft` artifacts |
| 7 | Keyword Scout | `src/lib/agents/keyword-scout.ts` | Mon 07:00 UTC | `TrackedKeyword` rows |
| 8 | Content Decay Watcher | `src/lib/agents/content-decay-watcher.ts` | Daily 06:30 UTC | `SeoInsight` + briefs |
| 9 | Internal Link Agent | `src/lib/agents/internal-link-agent.ts` | Daily 12:00 UTC | `InternalLinkSuggestion` rows |
| 10 | Weekly Digest Email | `src/lib/weekly-digest.ts` | Mon 11:00 UTC | Email via Resend |

Static metadata (display labels, settings, tuning context for the AI tuning modal) lives in `src/lib/agent-configs.ts`.

---

## 1. Industry Researcher

**Purpose.** Fetch primary/credible RSS sources across client verticals, extract genuinely novel insights via Claude, and store them as `ResearchSignal` rows. The Brief Generator consumes these first, so weekly content is grounded in real-world events instead of recycled keyword loops.

**Reads:**
- 14 RSS/Atom feeds across 4 verticals (trucking, law, restaurant, general). See registry in `industry-researcher.ts`.
- Existing `ResearchSignal` rows from the last 7 days (dedup window — skip domains/URLs already covered).
- Business profile (company name, services, location, target audience).

**Writes:**
- `ResearchSignal` rows with `status="fresh"`. Up to 12 per run.

**Constants:**
- `MAX_SIGNALS_PER_RUN = 12`
- `SOURCE_DEDUP_DAYS = 7`
- `MAX_ITEM_AGE_DAYS = 14`
- Min `shareScore` to save: 40 / 100
- Items per source feed: top 5 fresh items

**Source registry:**
- **Trucking:** fmcsa.dot.gov, trucking.org, overdriveonline.com, ttnews.com
- **Law:** abajournal.com, law360.com, courtlistener.com, justia.com
- **Restaurant:** fda.gov (food safety), restaurant.org, fsrmagazine.com, qsrmagazine.com
- **General:** hbr.org, sba.gov

**Pipeline.** Fetch each feed (10s timeout, no external deps — regex-based RSS/Atom parser) → filter by recency and dedup → batch by industry → send to Claude Sonnet 4 with the business context → parse JSON → store signals with `shareScore` and `recencyScore`.

**Model.** `claude-sonnet-4-20250514`, `max_tokens=3000`.

---

## 2. Strategy Analyst

**Purpose.** Read every signal source and produce a weekly strategic brief that the Brief Generator uses as its primary context.

**Reads:**
- `TrackedKeyword` (positions, clicks, impressions, trends)
- `GscDailyKeyword` (last 28 days)
- `BlogPost` (published + draft)
- `SeoInsight` (active)
- `BusinessProfile`
- Prior `SeoStrategyDoc` rows (for continuity)
- `AICitation` rows (last 30 days)
- `GbpReview`, `GbpMetricsDaily` (if synced)
- Recent `Event` rows (last 7 days)

**Writes:**
- One `SeoStrategyDoc` row with `source="ai-strategy-analyst"`, upserted weekly (Markdown body).

**Output sections:** executive summary, keyword priorities, content gaps, recommended actions (3–5), competitive context.

**Model.** `claude-sonnet-4-20250514`, `max_tokens=4096`.

---

## 3. Brief Generator

**Purpose.** Produce 2–3 structured `content_brief` artifacts per week. Prioritise fresh `ResearchSignal` rows over pure keyword analysis.

**Reads:**
- Latest `SeoStrategyDoc` (source=`ai-strategy-analyst`)
- Top 40 `TrackedKeyword` by `impressions28d`
- Last 30 published `BlogPost` rows
- 5 most recent `KeywordCluster` + their `ClusterSubtopic` (gaps where `contentStatus != "published"`)
- 60 active `SitePage` rows (for internal-link targets)
- Top 6 fresh `ResearchSignal` rows by `shareScore desc, recencyScore desc`

**Writes:**
- `content_brief` `AgentArtifact` rows (≤5 per run, typically 2–3).
- On approval → publisher updates `ContentIdea` and prepares brief for Blog Drafter.
- When a brief consumes a signal, marks the signal `status="consumed"` and `consumedBy=artifact.id`.

**Dedup guard.** For each `type="new"` brief, runs `findSimilarPublishedPosts` (TF-IDF cosine, top 3). Applies `decideForBrief(score)`:
- `< 0.35` → keep as new
- `[0.35, 0.55)` → keep as new, attach `similarityWarning`
- `≥ 0.55` → auto-convert to `refresh`, set `targetSlug` to matched post, attach warning

**Brief payload (`ContentBriefPayload`):** `type`, `targetKeyword`, `targetSlug`, `title`, `intent`, `funnelStage`, `wordCountTarget`, `sections[]`, `mustInclude[]`, `internalLinks[]`, `sourcesToCite[]`, `reasoning`, `researchSignalId?`, `similarityWarning?`.

**Model.** `claude-sonnet-4-20250514`, `max_tokens=4096`.

---

## 4. Blog Drafter

**Purpose.** Pick up approved `content_brief` artifacts and write full Markdown blog posts as `blog_draft` artifacts.

**Reads:**
- Approved `content_brief` artifacts (or specific IDs via `briefArtifactIds`)
- Business profile + tone of voice
- Latest `SeoStrategyDoc` (strategic framing)
- `InternalLinkSuggestion` rows (wire real links)

**Writes:**
- `blog_draft` artifacts (one per brief). On approval → publisher creates `BlogPost` with `status="draft"` for final review and publish.

**Options:** `{ briefArtifactIds?, max?, fast? }`. Parallel concurrency = 2.

**Models:**
- `MODEL_QUALITY = claude-sonnet-4-20250514` (default)
- `MODEL_FAST = claude-haiku-4-5-20251001` (when `fast: true`)
- `max_tokens=8192`

**Mandatory components** (from `CLAUDE.md` rules): citeable opening (20–60 words), entity definition, Q&A H2s, comparison table, FAQ section (4–6 Q's), CTA closing. Frontmatter: title, metaTitle, metaDescription, targetKeyword.

---

## 5. GBP Post Drafter

**Purpose.** Draft 1–2 Google Business Profile post ideas per `GbpLocation` per week.

**Reads:**
- `GbpLocation` rows (or stub if none synced)
- Past `GbpPost` rows with view/click counts (90-day lookback) — for performance analysis
- `GbpMetricsDaily` (60-day lookback)
- Recent `BlogPost` rows (last 28 days, for cross-promotion ideas)
- Business profile

**Writes:**
- `gbp_post_draft` artifacts. On approval → publisher calls `createGbpLocalPost`.

**Payload per idea:** `summary` (100–300 chars), `topicType` (STANDARD | OFFER | EVENT | ALERT), `ctaType` + `ctaUrl`, `imagePrompt`, `reasoning`.

**Performance analysis** (`analysePostPerformance`): groups past posts by `topicType`, computes CTR (`clickCount/viewCount`), identifies top-performing type, high-CTR inspirations, low-CTR patterns to avoid. Injected into prompt as structured blocks.

**CTA URL validation** (`validateGbpCtaUrl`): allowlist against `Site.domain`, `BusinessProfile.domain`, and the location's `websiteUri`. Invalid URLs blocked at approval.

**Dedup guard.** `findSimilarGbpPosts` against recent posts. Thresholds: `< 0.35` keep, `[0.35, 0.55)` warn, `≥ 0.55` drop.

**Approval UI requirement:** human must upload an image before the Approve button enables.

**Model.** `claude-sonnet-4-20250514`.

---

## 6. GBP Review Reply Drafter

**Purpose.** When new `GbpReview` rows land during GBP sync, generate a `review_reply_draft` artifact for each so a human can approve a contextually appropriate reply.

**Lives in:** `src/lib/gbp-sync.ts` (function `draftReviewReply`). Not a standalone cron — fires during `syncGbpForSite`.

**Reads:** the new review + business profile + location metadata.

**Writes:** `review_reply_draft` artifact with `{ reviewName, reply }` payload. On approval → publisher calls `replyToGbpReview`.

**Tone rules:** match star rating. 5-star → thank + reinforce. 1–3 star → empathetic, offer offline resolution, never argue.

---

## 7. Keyword Scout

**Purpose.** Mine GSC query data to surface impressioned-but-untracked queries.

**Reads:**
- `GscDailyKeyword` rows (last 28 days)
- Existing `TrackedKeyword` rows (dedup)

**Writes:**
- New `TrackedKeyword` rows (tier=tier2 by default).

**Heuristics (no LLM):**
- Min impressions: 10 (28-day total)
- `inferIntent(query)`: word-boundary checks via `hasWord` helper.
  - `cost|price|hire` → `transactional`
  - `best|top` → `commercial`
  - matches brand → `navigational`
  - else → `informational`
- `inferTier(query)`: based on query length + commercial intent.
- `suggestTargetPage(query)`: scores service/location/blog candidates. Service-page +0.5 boost applies only when score > 0 (else returns nothing).

**Tests:** `src/lib/agents/keyword-scout.test.ts` (12 tests).

---

## 8. Content Decay Watcher

**Purpose.** Detect published posts losing traffic or position over time. Capped at 3 briefs/run.

**Reads:**
- Published `BlogPost` rows
- `GscDailyKeyword` (position trend, last 28 vs prior 28 days)
- `PageMetrics` (GA4 sessions/conversions if available)

**Writes:**
- `SeoInsight` rows (type=`content_freshness`).
- Optionally `content_brief` artifacts (type=`refresh`) for the worst cases (≤3 per run).

**Decay signals:**
1. Conversions dropped to 0 (was > 0)
2. Sessions dropped ≥ 50%
3. Keyword position lost ≥ 5 places
4. Stale: not updated in ≥ 9 months

---

## 9. Internal Link Agent

**Purpose.** Suggest internal links between pages/posts that share topic clusters but don't currently cross-link.

**Reads:** published `BlogPost`, `SitePage`, `KeywordCluster` + `ClusterSubtopic`, existing `InternalLinkSuggestion` (dedup).

**Writes:** `InternalLinkSuggestion` rows (status=pending). Optionally `link_suggestions` artifact for bulk approval.

**Modes:**
- `post` — analyse one specific post
- `daily` — incremental scan of posts updated in last 7 days

**Algorithm:** TF-IDF cosine over post body + target keyword vs candidate anchor pages. Per page-pair, checks cluster overlap, similarity, and whether a link already exists.

**Key export:** `insertMarkdownLink(content, anchorText, url)` — pure helper with adaptive word-boundary handling (only adds `\b` if anchor edge is a word char, so anchors like `(premium)` still match).

**Tests:** `src/lib/agents/internal-link-agent.test.ts` (7 tests).

---

## 10. Weekly Digest Email

**Purpose.** Monday-morning summary email per tenant. The "inbox" notification for clients/admins.

**Reads:**
- Pending `AgentArtifact` rows (all types) bucketed by ISO week
- Latest `SeoStrategyDoc`
- Active `SeoInsight` rows
- Pending `gbp_post_draft` artifacts (up to 10)
- `EmailConfig.notifyRecipients` per tenant (falls back to `DIGEST_RECIPIENTS` env)
- Recent `Event` rows for the week

**Writes:**
- Email via Resend
- `CronJobRun` row (`weekly_digest` or `weekly_digest_manual`)

**Email sections:**
1. Pending inbox count + link to `/admin/inbox/[week]`
2. GBP ideas table (idea, type badge, image suggestion, approve link)
3. Strategy brief excerpt
4. Active SEO insights
5. Keyword movement highlights

**Base URL.** Prefers `WEEKLY_DIGEST_BASE_URL` env so digest links work in production even when `NEXTAUTH_URL` captured a dev port.

**Helper:** `resolveDigestRecipients(siteId)` returns recipient list with multi-tenant fallback.

---

## Manual triggers

Every agent has a manual run endpoint at `/api/admin/agents/<key>/run` (POST, requires admin session, rate limited). The Agents tab in `/admin/seo/agents` exposes a button per agent and a "Run all weekly agents" button (`/api/admin/agents/run-all`) that fires the Monday lineup in dependency order.

## Tests

41 tests across 6 files (vitest, pure logic only — no DB/network):

- `src/lib/credential-encryption.test.ts` (5)
- `src/lib/iso-week.test.ts` (3)
- `src/lib/dedup.test.ts` (7)
- `src/lib/gbp.test.ts` (7, mocks Prisma)
- `src/lib/agents/keyword-scout.test.ts` (12)
- `src/lib/agents/internal-link-agent.test.ts` (7)

Run: `npm test`. Vitest config sets `CREDENTIAL_ENCRYPTION_KEY="0".repeat(64)` for the test env.
