# SEO Autopilot — Architecture

Cross-cutting reference for the agentic layer. For per-agent specs see [agents.md](agents.md). For env vars and onboarding see [setup.md](setup.md).

---

## Core primitives

```
┌───────────────┐    ┌───────────────┐    ┌────────────────────┐
│   Sync jobs   │ →  │   Event log   │ →  │   AgentArtifact    │
│ (GSC/GA4/GBP) │    │   (memory)    │    │ (pending → approved│
└───────────────┘    └───────────────┘    │  → published)      │
        ↓                    ↓             └────────┬───────────┘
┌───────────────┐    ┌───────────────┐              │
│ Sync targets: │    │ Agents read   │              ↓
│ GbpLocation,  │    │ events +      │     ┌─────────────────┐
│ GbpReview,    │    │ DB context    │     │ Publisher applies│
│ PageMetrics,  │    └───────────────┘     │ side effect on   │
│ TrackedKeyword│         │                │ approve          │
└───────────────┘         ↓                └─────────────────┘
                  ┌───────────────┐
                  │   AgentRun    │  ← observability: status, duration,
                  │ (per invoke)  │     model, tokens, cost, artifacts
                  └───────────────┘
```

**Memory layer.** `Event` rows are the journal. Dotted event types (`metrics.conversion_drop`, `gbp.review_received`, `agent.run_completed`, `content.published`). `logEvent()` never throws. `queryEvents()` filters by site + types + range.

**Artifact lifecycle.** `pending_review → approved → published | failed` (or `rejected`).

**Publisher registry.** A `Map<artifactType, PublisherFn>` defined in `src/lib/agent-publisher-registry.ts` (extracted to break a circular import). `src/lib/agent-artifact-publishers.ts` registers publishers at module load.

**Agent registry.** A separate map in `src/lib/agent-registry.ts` keys `agentKey → { run, extract }`. All manual + cron + run-all routes call `runRegisteredAgent(key, opts)` rather than importing agents directly. The extract function maps each agent's return shape to `AgentRunAccounting` (model, tokens, artifacts, summary).

| Artifact type | Publisher action |
|---|---|
| `content_brief` | Mark consumed → Blog Drafter picks up next run |
| `blog_draft` | Create `BlogPost` row (status=draft) for final review |
| `gbp_post_draft` | Validate CTA URL → `createGbpLocalPost` |
| `review_reply_draft` | `replyToGbpReview` |
| `link_suggestions` | Apply link insertions or mark suggestions accepted |
| `keyword_candidate` | Upsert into `TrackedKeyword` |

---

## Schema additions

Migrations live in `prisma/migrations/manual/` — apply in order:
- `phase8-gbp-ga4-oauth-foundation.sql`
- `phase8-event-log.sql`
- `phase8-agent-artifacts.sql`
- `phase9-research-signals.sql`
- `phase10-agent-runs.sql`

All new models carry `siteId` with `onDelete: Cascade`:

| Model | Purpose |
|---|---|
| `GbpLocation` | One row per Google Business Profile location |
| `GbpPost` | Synced local posts (and ones we published) |
| `GbpReview` | Synced reviews + reply state |
| `GbpMetricsDaily` | Performance API daily rollups |
| `PageMetrics` | GA4 page-level daily metrics |
| `Event` | Cross-agent journal / memory |
| `AgentArtifact` | Pending/approved/published artifacts (the review queue) |
| `ResearchSignal` | Industry Researcher output, consumed by Brief Generator |
| `AgentRun` | One row per agent invocation — status, duration, model, tokens, cost, artifacts |

Enum additions: `IntegrationType.google_business_profile`, `AgentRunStatus { running, completed, failed }`, `AgentRunTrigger { cron, manual, run_all, chained }`.

---

## AgentRun observability

Every agent invocation writes one `AgentRun` row via `runAgent()` in `src/lib/agent-runner.ts`. Routes never call `runAgent` directly — they go through `runRegisteredAgent(key, opts)` in `src/lib/agent-registry.ts`, which is the only place that knows the mapping `agentKey → run fn + result extractor`.

**Captured per run:** `status`, `startedAt`, `completedAt`, `durationMs`, `trigger`, `model`, `tokensIn`, `tokensOut`, `costEstimateUsd`, `artifactsCreated`, `artifactIds`, `resultSummary`, `error`, `metadata`.

**Token capture.** All Claude calls go through `callClaude()` in `src/lib/claude.ts`, which returns `{ text, usage, model }` from Anthropic's `/v1/messages` response. Multi-call agents (Industry Researcher, Blog Drafter, Content Decay Watcher) accumulate usage with `addUsage()` and return the total in their result. The registry extractor threads `usage.tokensIn` / `usage.tokensOut` → the AgentRun row.

**Cost estimation.** `estimateCostUsd(model, tokensIn, tokensOut)` in `agent-runner.ts` uses a per-model pricing table:

| Model | In ($/M) | Out ($/M) |
|---|---|---|
| `claude-sonnet-4-20250514` | 3.0 | 15.0 |
| `claude-haiku-4-5-20251001` | 1.0 | 5.0 |
| `claude-opus-4-7` | 15.0 | 75.0 |

Update the table in `agent-runner.ts` when Anthropic changes prices.

**Surfaces:** `/admin/seo/agent-runs` (totals + per-agent rollup with p50/p95 + recent 50 runs) and the `AgentRunsWidget` on the admin dashboard. API: `GET /api/admin/agents/runs?window=7d|30d|all&agent=<key>`.

---

## Dedup guard

`src/lib/dedup.ts` provides TF-IDF cosine similarity over existing content. Independent of LLM trust.

```ts
findSimilarPublishedPosts(siteId, candidateText, topN)
findSimilarGbpPosts(siteId, candidateText, topN)

decideForBrief(score)    // "keep" | "warn" | "convert_to_refresh"
decideForGbpPost(score)  // "keep" | "warn" | "drop"

BRIEF_THRESHOLDS = { WARN: 0.35, CONVERT: 0.55 }
GBP_POST_THRESHOLDS = { WARN: 0.35, DROP: 0.55 }
```

Uses the existing `semantic-embeddings.ts` TF-IDF implementation. Decisions are pure functions and unit-tested.

---

## Event types (taxonomy)

Defined in `src/lib/events.ts` (`EVENT_TYPES`). Add new types here so all readers agree.

| Type | Emitted by |
|---|---|
| `content.published` | Blog publisher |
| `gbp.review_received` | GBP sync (when new review lands) |
| `gbp.post_published` | GBP post publisher |
| `metrics.conversion_drop` | GA4 sync anomaly detector |
| `metrics.conversion_spike` | GA4 sync anomaly detector |
| `agent.run_started` | Agent runners |
| `agent.run_completed` | Agent runners |
| `agent.run_failed` | Agent runners |
| `artifact.created` | `createArtifact` |
| `artifact.approved` | `approveArtifact` |
| `artifact.rejected` | `rejectArtifact` |

Reserved (not yet wired): `keyword.moved`, `keyword.lost`, `metrics.traffic_spike`, `metrics.traffic_drop`.

---

## Cron schedule (`vercel.json`)

| Time (UTC) | Path | Notes |
|---|---|---|
| Mon 05:00 | `/api/cron/industry-researcher` | Fetch RSS, extract signals |
| Mon 06:00 | `/api/cron/seo` | Existing weekly snapshot + crawl + insights + citations |
| Daily 06:00 | `/api/cron/wordpress-sync` | Pull WP posts/pages (skips sites without WP integration) |
| Daily 06:30 | `/api/cron/content-decay-watcher` | |
| Daily 07:00 | `/api/cron/ga4-sync` | |
| Mon 07:00 | `/api/cron/keyword-scout` | |
| Daily 07:30 | `/api/cron/gbp-sync` | Includes review-reply drafting |
| Mon 08:00 | `/api/cron/strategy-analyst` | |
| Mon 08:30 | `/api/cron/brief-generator` | Consumes fresh ResearchSignals |
| Mon 09:30 | `/api/cron/gbp-post-drafter` | |
| Daily 10:00 | `/api/cron/blog-drafter` | Picks up approved briefs |
| Mon 11:00 | `/api/cron/weekly-digest` | Email send |
| Daily 12:00 | `/api/cron/internal-link-agent` | |

All cron endpoints use `authenticateCron()` and wrap work in `runTrackedJob(siteId, jobType, fn)` from `cron-runner.ts`.

---

## WordPress integration

**Read-only content sync.** Pulls published posts + pages from a self-hosted WordPress site into `BlogPost` / `SitePage` tables so all agents can run against real client content without a CMS migration.

**Auth.** WordPress Application Password (Basic auth over HTTPS). Credentials stored encrypted in `IntegrationCredential` with `type = "wordpress"`. No OAuth redirect — credentials entered directly in the integrations UI.

**Credential payload** (encrypted JSON in `encryptedCredentials`):
```json
{ "siteUrl": "https://client.com", "username": "admin", "appPassword": "xxxx xxxx xxxx", "pathPrefix": "/blog" }
```
`pathPrefix` controls how blog post slugs become `SitePage.path` (default `"/blog"` → `/blog/slug`; set to `""` for flat WordPress installs).

**Sync (`src/lib/wordpress-sync.ts`).** `syncWordPressForSite(siteId)` fetches all published posts + pages via `src/lib/wordpress.ts` (paginated, 100/page). Each post is upserted into `BlogPost` matched on `(siteId, slug)`. Posts are skipped when `wordPressPostId` + `updatedAt` match — keeping syncs idempotent. Yoast SEO fields (`yoast_head_json`) map to `metaTitle`, `metaDescription`, `targetKeyword` when present; falls back to slug-derived keyword. After sync, calls `syncBlogPostsToSitePages()` to ensure SitePage inventory is complete. Logs `wordpress.sync_completed` event.

**New BlogPost fields:**
- `wordPressPostId Int?` — WP post ID for reconciliation; null for SeedTech-native posts
- `wordPressSiteUrl String?` — source WP site URL

**API surface:**
```
GET/POST/DELETE /api/admin/integrations/wordpress/connect  — check status, connect, disconnect
POST            /api/admin/integrations/wordpress/sync     — manual sync trigger
GET             /api/cron/wordpress-sync                   — daily cron (06:00 UTC)
```

**UI.** WordPress panel added to `/admin/seo/settings/integrations` (above Google Workspace). Connect form with site URL, username, application password, path prefix. "Connect & Test" validates before saving. Connected state shows post count, last sync, and "Sync now" button.

**Agent compatibility.** No agent changes required. All agents read `BlogPost` rows regardless of `wordPressPostId`. `SitePage.source = "wordpress"` for synced pages.

---

## Integration foundations

**OAuth (`src/lib/google-oauth.ts`).** Single OAuth client covers GSC + GA4 + GBP. Functions: `buildAuthUrl`, `exchangeCode`, `getAuthorizedClient`, `getStoredOAuthCredential`. Refresh tokens stored encrypted.

**Credential encryption (`src/lib/credential-encryption.ts`).** AES-256-GCM. Format: `${iv_b64}.${tag_b64}.${ciphertext_b64}`. Requires `CREDENTIAL_ENCRYPTION_KEY` (32 bytes hex).

**GA4 (`src/lib/ga4.ts`, `src/lib/ga4-sync.ts`).** `listGa4Properties`, `fetchGa4DailyPageMetrics`, `syncGa4ForSite`, `detectConversionAnomalies` (emits spike/drop events).

**GBP (`src/lib/gbp.ts`, `src/lib/gbp-sync.ts`).** `listGbpAccounts`, `listGbpLocations`, `listGbpReviews`, `listGbpLocalPosts`, `fetchGbpDailyMetrics`, `replyToGbpReview`, `createGbpLocalPost`, `validateGbpCtaUrl`. `syncGbpForSite` orchestrates everything and triggers `draftReviewReply` for new reviews.

---

## Rate limiting

`src/lib/agent-rate-limit.ts` — in-memory `checkAgentRateLimit(siteId)`. Defaults: 10/min, 60/hour. Applied to all `/api/admin/agents/*` routes. Acceptable on Vercel because each agent run is a single request — bursts get rejected at the boundary.

---

## Multi-tenancy

- Every model carries `siteId` with cascade deletes.
- Every agent takes `siteId` as its first argument.
- Cron endpoints iterate active `Site` rows.
- `EmailConfig.notifyRecipients` per tenant; falls back to `DIGEST_RECIPIENTS` env.
- `resolveDigestRecipients(siteId)` resolves the recipient list.
- ISO week bucketing (`src/lib/iso-week.ts`): `toIsoWeek`, `isoWeekRange`, `isoWeekLabel`.

---

## UI surfaces

| Path | Purpose |
|---|---|
| `/admin` | Dashboard with `AgentRunsWidget` (last 7d) |
| `/admin/seo/agents` | Agents tab + Digest tab |
| `/admin/seo/agent-runs` | Observability: per-agent rollup + recent runs |
| `/admin/seo/settings/integrations` | OAuth + GA4 property + GBP location panels |
| `/admin/inbox` | Weeks table |
| `/admin/inbox/[week]` | Per-week detail with narrative + grouped task sections + bulk-approve/reject |

Sidebar (`src/components/admin/AdminSidebar.tsx`) groups Agents and Inbox under SEO.

---

## File map

```
src/lib/
  agent-artifacts.ts            create/approve/reject/list
  agent-artifact-publishers.ts  registers publishers
  agent-publisher-registry.ts   shared Map (breaks circular import)
  agent-configs.ts              UI metadata + tuning context
  agent-rate-limit.ts           in-memory per-site limiter
  agent-runner.ts               runAgent wrapper + cost estimator
  agent-registry.ts             agentKey → run fn + extractor (single source of truth)
  claude.ts                     callClaude wrapper that returns usage
  agents/
    industry-researcher.ts
    strategy-analyst.ts
    brief-generator.ts
    blog-drafter.ts
    gbp-post-drafter.ts
    keyword-scout.ts
    content-decay-watcher.ts
    internal-link-agent.ts
  credential-encryption.ts      AES-256-GCM
  wordpress.ts                  WordPress REST API client (fetchWpPosts, fetchWpPages, testWpConnection)
  wordpress-sync.ts             Sync orchestrator — pulls WP content into BlogPost/SitePage tables
  dedup.ts                      TF-IDF threshold decisions
  events.ts                     EVENT_TYPES + logEvent/queryEvents
  ga4.ts, ga4-sync.ts
  gbp.ts, gbp-sync.ts           gbp-sync embeds draftReviewReply
  google-oauth.ts
  iso-week.ts
  weekly-digest.ts

src/app/api/
  admin/agents/<key>/run/       manual triggers (rate limited)
  admin/agents/<key>/runs/      per-agent run history (AgentRun)
  admin/agents/runs/            aggregate observability endpoint
  admin/agents/run-all/         Monday lineup
  admin/digest/recipients/      per-tenant recipient mgmt
  cron/<agent>/                 Vercel cron endpoints
  inbox/                        weeks, by-week, bulk-approve/reject
  events/                       event log query
  integrations/google/          OAuth connect/callback/disconnect/status

src/app/admin/
  page.tsx                      dashboard (with AgentRunsWidget)
  seo/agents/                   Agents + Digest tabs
  seo/agent-runs/               observability page
  inbox/                        review queue
```

---

## Roadmap (post-MVP)

The MVP is complete: 10 agents, full sync layer, dedup guard, observability with cost telemetry, inbox approval flow, weekly digest, multi-tenant. Next priorities, in order:

1. **Artifact scoring + Critic Agent (paired).** Add `confidenceScore`, `impactScore`, `riskScore`, `sourceEvidence[]` to `AgentArtifact`. A lightweight critic runs between generator and `pending_review` for `blog_draft`, `gbp_post_draft`, `review_reply_draft`. Skip for `keyword_candidate` / `link_suggestions` — their generators are already deterministic. Don't add the score fields without the critic.
2. **OutcomeWindow tracking.** New table keyed on the *published entity* (BlogPost.id, GbpPost.id) at 7d/28d/90d intervals. Joins GSC + GA4 + GBP performance. Start collecting before analysis — signal accrues over 90 days.
3. **Machine-readable Strategy Analyst output.** A `recommendedRuns[]` JSON sidecar that lets `run-all` adapt to the week's signals. Only valuable once outcome data exists to inform recommendations.
4. **Per-site auto-publish toggles.** For low-risk artifact types (`link_suggestions`, `keyword_candidate`), allow skipping human approval. Reduces inbox fatigue.

## Known limitations

- Reserved event types (`keyword.moved`, `keyword.lost`, `metrics.traffic_spike/drop`) are declared but not yet emitted.
- Trend Analyst (Friday agent), Competitor Move Detector, and Schema Generator are not built yet.
- Rate limiter is in-memory; under heavy parallel cold-starts on Vercel, limits may be soft. Move to Redis or DB if abuse appears.
- `inputSnapshotHash` field on `AgentRun` is wired but not yet populated by agents — would enable dedup-by-identical-inputs across runs.
- Cost pricing table in `agent-runner.ts` is hard-coded — update when Anthropic changes prices.
