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
│ TrackedKeyword│                          │ approve          │
└───────────────┘                          └─────────────────┘
```

**Memory layer.** `Event` rows are the journal. Dotted event types (`metrics.conversion_drop`, `gbp.review_received`, `agent.run_completed`, `content.published`). `logEvent()` never throws. `queryEvents()` filters by site + types + range.

**Artifact lifecycle.** `pending_review → approved → published | failed` (or `rejected`).

**Publisher registry.** A `Map<artifactType, PublisherFn>` defined in `src/lib/agent-publisher-registry.ts` (extracted to break a circular import). `src/lib/agent-artifact-publishers.ts` registers publishers at module load.

| Artifact type | Publisher action |
|---|---|
| `content_brief` | Mark consumed → Blog Drafter picks up next run |
| `blog_draft` | Create `BlogPost` row (status=draft) for final review |
| `gbp_post_draft` | Validate CTA URL → `createGbpLocalPost` |
| `review_reply_draft` | `replyToGbpReview` |
| `link_suggestions` | Apply link insertions or mark suggestions accepted |
| `keyword_candidate` | Upsert into `TrackedKeyword` |

---

## Schema (Phase 8 additions)

Migrations live in `prisma/migrations/manual/`:
- `phase8-gbp-ga4-oauth-foundation.sql`
- `phase8-event-log.sql`
- `phase8-agent-artifacts.sql`

New models (all carry `siteId` with `onDelete: Cascade`):

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

Enum addition on `IntegrationType`: `google_business_profile`.

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
| `/admin/seo/agents` | Agents tab + Digest tab |
| `/admin/seo/settings/integrations` | OAuth + GA4 property + GBP location panels |
| `/admin/inbox` | Weeks table |
| `/admin/inbox/[week]` | Per-week detail with narrative + grouped task sections + bulk-approve/reject |

Sidebar (`src/components/admin/AdminSidebar.tsx`) groups Agents and Inbox under SEO.

---

## File map

```
src/lib/
  agent-artifacts.ts          create/approve/reject/list
  agent-artifact-publishers.ts  registers publishers
  agent-publisher-registry.ts   shared Map (breaks circular import)
  agent-configs.ts            UI metadata + tuning context
  agent-rate-limit.ts         in-memory per-site limiter
  agents/
    industry-researcher.ts
    strategy-analyst.ts
    brief-generator.ts
    blog-drafter.ts
    gbp-post-drafter.ts
    keyword-scout.ts
    content-decay-watcher.ts
    internal-link-agent.ts
  credential-encryption.ts    AES-256-GCM
  dedup.ts                    TF-IDF threshold decisions
  events.ts                   EVENT_TYPES + logEvent/queryEvents
  ga4.ts, ga4-sync.ts
  gbp.ts, gbp-sync.ts         gbp-sync embeds draftReviewReply
  google-oauth.ts
  iso-week.ts
  weekly-digest.ts

src/app/api/
  admin/agents/<key>/run/     manual triggers (rate limited)
  admin/agents/run-all/       Monday lineup
  admin/digest/recipients/    per-tenant recipient mgmt
  cron/<agent>/               Vercel cron endpoints
  inbox/                      weeks, by-week, bulk-approve/reject
  events/                     event log query
  integrations/google/        OAuth connect/callback/disconnect/status
```

---

## Known limitations

- Reserved event types (`keyword.moved`, `keyword.lost`, `metrics.traffic_spike/drop`) are declared but not yet emitted.
- Trend Analyst (Friday agent), Competitor Move Detector, and Schema Generator are not built yet.
- Auto-publish toggles per site/artifact-type are not implemented — every artifact requires human approval.
- CronJobRun history admin UI does not exist yet.
- Rate limiter is in-memory; under heavy parallel cold-starts on Vercel, limits may be soft. Move to Redis or DB if abuse appears.
