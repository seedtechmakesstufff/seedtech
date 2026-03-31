# SEO Autopilot — Development Log

**Project:** SeedTech SEO Autopilot (bundled with web builds for local businesses)  
**Stack:** Next.js 14.2 (App Router) · Prisma 7.5 · PostgreSQL (Neon) · Claude API · NextAuth · Tailwind  
**Repo:** github.com/seedtechmakesstufff/seedtech (main branch)  
**Last updated:** March 30, 2026

---

## Completed Phases

### Phase 1-4: Multi-Tenant Architecture
**Commits:** c18291d → 9d03ec7 → fd24a42 → 357fa6a

Built the full multi-tenant foundation:
- **Schema:** Tenant → Site → all-data hierarchy, every SEO model has `siteId` with cascade deletes
- **Auth:** NextAuth credentials provider, JWT with userId/tenantId/siteId/role, `requireSiteContext()` pattern
- **Roles:** owner / admin / editor / viewer with `hasRole()` enforcement
- **Site context:** Cookie-based site switching, `requireRole()` helper
- **Constants:** DEFAULT_SITE_ID = "site_seedtech", DEFAULT_TENANT_ID = "tenant_seedtech"
- **Dashboard monolith split:** Settings, blog, SEO pages extracted into proper routes
- **Onboarding:** Template-based site provisioning with placeholder substitution

### Phase 5: SaaS Production Readiness
**Commit:** 06e1fc2 (29 files, +3,190 lines)

#### 5A — Schema (6 new models)
- `Author` — per-site expert entities with credentials, expertise, sameAs links
- `ExperienceEvidence` — case studies, metrics, testimonials for E-E-A-T
- `IndustryConfig` — per-site credential keywords, geographic terms, known entities, authority domains
- `CompetitorAnalysis` — results of scoring competitor pages
- `CronJobRun` — execution tracking for scheduled jobs
- `UserInvite` — pending team member invitations

#### 5B — CRUD APIs
- `/api/admin/authors` + `/api/admin/authors/[id]` — Author management
- `/api/admin/evidence` + `/api/admin/evidence/[id]` — Experience evidence CRUD
- `/api/admin/industry-config` — Industry config GET/PUT (upsert)

#### 5C — De-hardcode SeedTech DNA
- `src/lib/site-scoring-config.ts` — DB-driven config loader, builds compiled regex patterns for credential/geo/entity matching from IndustryConfig + BusinessProfile + Authors + Evidence
- `src/lib/ai-visibility.ts` — All regex checks now use siteConfig when provided (credential patterns, geographic terms, entity signals, freshness patterns)
- `src/lib/seo-eeat.ts` — Author entities from DB, config-driven credential patterns and authority domains
- `src/lib/seo-aio.ts` — Dynamic year freshness patterns via `buildFreshnessRegex()`

#### 5D — Cron System
- `src/lib/cron-runner.ts` — `runTrackedJob()` wrapper creates CronJobRun records, `getAllActiveSiteIds()`, `authenticateCron()`, `getCronSiteId()`
- `/api/cron/snapshot` `/api/cron/crawl` `/api/cron/insights` — Individual cron endpoints
- `/api/cron/seo` — Refactored to multi-site with CronJobRun tracking
- `/api/admin/cron-history` — Admin-only cron execution history

#### 5E — User Management
- `/api/admin/team` — List members + invites, send invites (7-day expiry)
- `/api/admin/team/[id]` — Role changes, member/invite removal
- `/admin/settings/team` — Full team management UI (invite form, member list, role editing)

#### 5F — Competitive Intelligence Engine
- `src/lib/competitive-intel.ts` — `analyzeCompetitorPage()`, `analyzeAllCompetitors()` (sitemap discovery + scoring), `getCompetitorGaps()`, `getCompetitorOverviews()`
- `/api/admin/seo/competitors/analysis` — Trigger analysis (POST) + retrieve results (GET)

#### 5G — Competitors UI
- `src/app/admin/seo/competitors-tab.tsx` — Competitor cards (domain, AI Vis score, E-E-A-T score, pages analyzed), add competitor form, "Analyze All" trigger, competitor detail modal with page-level analysis, content gaps section

### Phase 6: Topic Authority Engine
**Commit:** 2670b2c (13 files, +1,841 lines)

#### 6A — Schema Evolution
- Enriched `KeywordCluster` with: `authorityScore`, `coveragePercent`, `avgContentScore`, `avgAiVisScore`, `linkDensity`, `status` (draft/active/archived), `seedKeyword`
- New `ClusterSubtopic` model — spoke pages with targetKeyword, searchIntent, contentStatus (missing/idea/draft/published), matchedPageUrl, priority, wordCountTarget, briefNotes
- New `InternalLinkSuggestion` model — source/target page URLs, anchor text, reason, status (pending/accepted/dismissed)
- Added `clusterId` to `ContentIdea` for cluster → content pipeline linking

#### 6B — AI Cluster Generator
- `generateTopicCluster(siteId, seedKeyword)` — Claude-powered pillar/spoke generation (8-15 subtopics with keyword, intent, priority, word count targets, content briefs)
- `saveGeneratedCluster()` — Persist to DB with all subtopics

#### 6C — Cluster Gap Analysis
- `analyzeClusterGaps(siteId, clusterId)` — Matches subtopics against existing blog posts + site pages using keyword/slug/title similarity. Identifies missing topics and weak pages (score < 60)
- `analyzeAllClusterGaps(siteId)` — Run across all active clusters

#### 6D — Cluster Authority Scoring
- `scoreClusterAuthority(siteId, clusterId)` — Composite score weighted: topic coverage (30%), content quality (25%), internal linking (20%), AI visibility (25%)
- Persists scores back to `KeywordCluster` for dashboard display

#### 6E — Internal Link Enforcer
- `enforceClusterLinks(siteId, clusterId)` — Reads blog post bodies, detects missing links between cluster pages (pillar ↔ spoke, spoke ↔ spoke), generates suggestions with anchor text and reason
- Saves to `InternalLinkSuggestion` table (upserts to avoid duplicates)

#### 6F — API Routes (7 files)
- `/api/admin/seo/clusters` — GET list (with subtopics + counts) / POST create
- `/api/admin/seo/clusters/generate` — POST AI generation from seed keyword
- `/api/admin/seo/clusters/[id]` — GET detail / PATCH update / DELETE (archives)
- `/api/admin/seo/clusters/[id]/gaps` — GET/POST gap analysis
- `/api/admin/seo/clusters/[id]/score` — POST authority scoring
- `/api/admin/seo/clusters/[id]/links` — GET existing / POST re-analyze

#### 6G — Topic Clusters UI Tab
- `src/app/admin/seo/topic-clusters-tab.tsx` — Full UI component:
  - AI cluster generator with seed keyword input
  - Expandable cluster cards with coverage progress bars + score badges (Authority, Coverage%, AI Vis)
  - Three sub-views: Subtopics (status icons, intent badges, matched pages), Gaps (missing + weak), Links (source → target with anchor text)
  - Authority breakdown visualization with weighted dimension bars
  - Action bar: Analyze Gaps, Score Authority, Check Links, Archive

### Phase 7: AI Citation Intelligence
**Commit:** fec6dee (14 files, +2,589 lines)

> Validates the AI Visibility thesis with real citation data — are AI platforms actually citing our brand?

#### 7A — Schema Evolution
- Extended `AICitation` model: `checkRunId` (links to batch run), `competitorId` (competitor tracking), `responseLength`, `position` (brand mention position in response)
- New `CitationCheckRun` model — batch execution tracking: status, totalQueries, totalPlatforms, brandMentions, urlCitations, mentionRate, durationMs
- Migration: `prisma/migrations/manual/phase7-citation-intelligence.sql`

#### 7B — Automated Citation Checker
- `src/lib/citation-checker.ts` — Multi-platform citation intelligence engine:
  - **Perplexity API** (real) — sonar model with structured citation extraction
  - **OpenAI API** (real) — gpt-4o for ChatGPT brand mention detection
  - **Claude-simulated** — Google AIO, Gemini, Copilot responses via claude-sonnet-4-20250514
  - Smart query generation from tracked keywords + business context + location
  - Brand mention detection (regex + contextual analysis)
  - URL citation detection (response text + structured citations)
  - Citation type classification: direct_quote, brand_mention, url_citation, recommendation
  - Sentiment analysis: positive, neutral, negative
  - Competitor mention tracking across all platforms
  - Rate-limited batch execution with CitationCheckRun tracking
  - `runCitationCheck()` — Full batch run, `checkSingleQuery()` — Spot check

#### 7C — Citation Analytics
- `src/lib/citation-analytics.ts` — Comprehensive analytics:
  - `getCitationDashboard()` — Single-call aggregator for UI
  - Mention rate trends (daily aggregation over configurable window)
  - Platform breakdown with per-platform sentiment distribution
  - Top citation queries ranked by mention rate
  - Competitor citation comparison with gap calculation
  - Score-to-citation correlation (validates AI Vis scoring engine)
  - Citation type + sentiment distribution analysis

#### 7D — API Routes (7 endpoints)
- `GET/POST /api/admin/seo/citations` — Dashboard data + trigger check run
- `GET /api/admin/seo/citations/runs` — Check run history
- `GET /api/admin/seo/citations/[runId]` — Run detail with our vs competitor citations
- `GET /api/admin/seo/citations/trends` — Trend data (configurable days param)
- `GET /api/admin/seo/citations/competitors` — Competitor comparison
- `POST /api/admin/seo/citations/check` — Single query spot check
- `GET /api/admin/seo/citations/correlation` — Score-to-citation correlation

#### 7E — Citations UI Tab
- `src/app/admin/seo/citations-tab.tsx` — Full dashboard tab:
  - Top stats: mention rate (with change), brand mentions, URL citations, best platform
  - Platform breakdown: progress bars per platform with sentiment indicators
  - Top citation queries: ranked by mention rate with platform dots
  - Competitor comparison: side-by-side rates with gap indicators
  - Citation type + sentiment distribution: horizontal bar charts
  - Recent citations: expandable cards with context snippets
  - Spot check tool: test any query on any platform in real-time
  - Check run history: collapsible panel with run stats

#### 7F — Cron Integration
- `/api/cron/citations` — Automated weekly citation checks (Wednesday 6 AM UTC)
- Uses `runTrackedJob()` for execution tracking via CronJobRun

---

## Architecture Overview

### Key Files
| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | ~960 lines, 33+ models |
| `src/lib/ai-visibility.ts` | AI Visibility scoring engine (5 dimensions, 20+ checks) |
| `src/lib/gsc-sync.ts` | GSC data sync engine (staleness-based, DB storage, TrackedKeyword updates) |
| `src/lib/crawl-to-tasks.ts` | Crawl issue → SeoTask pipeline (30 templates, dedup, auto-resolve) |
| `src/lib/page-metadata.ts` | Dynamic metadata bridge: DB → live page rendering (buildMetadata, resolveMetadata) |
| `src/lib/citation-checker.ts` | Multi-platform automated citation checking |
| `src/lib/citation-analytics.ts` | Citation trend analysis + score correlation |
| `src/lib/seo-eeat.ts` | E-E-A-T auditing and scoring |
| `src/lib/seo-aio.ts` | AIO (AI Overview) readiness scoring |
| `src/lib/topic-clusters.ts` | Topic authority engine (generation, gaps, scoring, links) |
| `src/lib/competitive-intel.ts` | Competitor analysis and gap detection |
| `src/lib/site-scoring-config.ts` | DB-driven per-site scoring config loader |
| `src/lib/cron-runner.ts` | Cron job tracking and multi-site execution |
| `src/lib/business-context.ts` | Per-site business profile for prompts |
| `src/lib/seo-crawler.ts` | 25+ check type site crawler (v2) |
| `src/lib/seo-insights.ts` | Freshness, cannibalization, linking, CTR insights |
| `src/app/admin/seo/page.tsx` | Main SEO dashboard (9 tabs) |

### Dashboard Tabs
1. **Overview** — Health score, snapshots, key metrics
2. **AI Visibility** — Per-page AI citation readiness scores with 5-dimension breakdown
3. **Keywords** — Tracked keywords with GSC position data, tier, intent, cluster assignment
4. **Site Audit** — Crawl results with critical/warning/info issues
5. **Insights** — AI-generated freshness, cannibalization, linking, E-E-A-T insights
6. **Topic Clusters** — Pillar/spoke cluster maps with gap analysis + authority scoring
7. **Citations** — AI platform citation tracking, trends, competitor comparison, spot checks
8. **Competitors** — Competitive intelligence with content gap detection
9. **Strategy** — Implementation roadmap tasks + content ideas calendar

### Prisma Models (key SEO ones)
`Site` · `BusinessProfile` · `IndustryConfig` · `Author` · `ExperienceEvidence` · `BlogPost` · `SitePage` · `PageMetadata` · `PageContext` · `ContextNode` · `ContentScore` · `AIVisibilityScore` · `AICitation` · `CitationCheckRun` · `TrackedKeyword` · `KeywordCluster` · `ClusterSubtopic` · `InternalLinkSuggestion` · `ContentIdea` · `SeoTask` · `SeoSnapshot` · `SeoCrawlRun` · `SeoPageAudit` · `SeoInsight` · `CompetitorDomain` · `CompetitorAnalysis` · `SeoLeadEvent` · `CronJobRun` · `UserInvite` · `GscSyncLog` · `GscDailyKeyword` · `GscDailyPage`

### Week 1 Data Loop — GSC Sync + Crawl-to-Tasks + Dashboard Polish
**Date:** March 31, 2026

> Make the data loop work: GSC data flows into the DB, crawl issues become tasks, dashboard auto-refreshes.

#### W1-A — GSC Data Storage (3 new models)
- **`GscSyncLog`** — Tracks each sync execution: status (running/completed/failed), keywordsFetched, pagesFetched, keywordsUpdated, durationMs, syncType, daysRange
- **`GscDailyKeyword`** — Historical keyword performance from GSC. One row per keyword per date per device/country. Unique on `(siteId, date, query, device, country)`. Enables trend charts.
- **`GscDailyPage`** — Historical page performance from GSC. One row per page per date. Same structure as keywords.
- **SeoTask extended** — Added `sourceType`, `sourceUrl`, `sourceCheckType`, `sourceRunId`, `autoResolved` for crawl-task dedup and auto-resolve tracking. New index on `(siteId, sourceUrl, sourceCheckType)`.
- Relations added to `Site` model: `gscSyncLogs`, `gscDailyKeywords`, `gscDailyPages`
- Schema pushed via `prisma db push`

#### W1-B — GSC Sync Engine (`src/lib/gsc-sync.ts`)
- **Staleness-based sync (Option B):** No cron dependency, syncs when data is >6 hours stale
- `getGscSyncStatus(siteId)` — Returns last sync time, staleness status, sync stats
- `isGscStale(siteId)` — Quick boolean check
- `syncGscData(siteId, { force? })` — Full sync pipeline:
  1. Check if GSC configured (via `isSearchConsoleConfigured()`)
  2. Staleness gate (skip if fresh, unless force=true)
  3. Running-sync guard (skip if another sync in progress)
  4. Create `GscSyncLog` record (status: "running")
  5. Fetch keyword performance from GSC API (500 keywords, 28 days)
  6. Fetch page performance from GSC API (200 pages, 28 days)
  7. Upsert into `GscDailyKeyword` (dedup by date+query+device+country)
  8. Upsert into `GscDailyPage` (dedup by date+page+device+country)
  9. Update `TrackedKeyword` records: currentPosition, previousPosition, bestPosition, clicks28d, impressions28d, ctr28d
  10. Update `GscSyncLog` and create `CronJobRun` for unified tracking
- `syncGscIfStale(siteId)` — Convenience: only syncs if stale
- **API budget:** ~4 GSC API calls per sync ≈ 0.3% of daily quota (1,200/day limit)

#### W1-C — GSC Sync API (`/api/admin/seo/gsc-sync/route.ts`)
- `GET` — Returns sync status: configured, lastSyncAt, isStale, isSyncing, totalSyncs, lastKeywordsFetched, lastPagesFetched
- `POST` — Triggers a sync. Accepts `{ force: boolean }` body. Returns SyncResult.

#### W1-D — GSC Sync UI (Settings Page)
- New "GSC Data Sync" section in Automation & Reports tab
- Shows: last sync time, status badge (Fresh/Stale/Not configured), keywords pulled, total syncs
- Schedule info: "Staleness-based — auto-syncs when data is >6 hours old on dashboard visit"
- Manual "Sync Now" button with loading state and result feedback
- Uses existing `Search`, `RefreshCw`, `Loader2`, `CheckCircle2`, `XCircle` icons

#### W1-E — Crawl-to-Tasks Pipeline (`src/lib/crawl-to-tasks.ts`)
- **30 check type → task templates** with human-readable titles, priority mapping, phase assignment:
  - Critical: missing-title, missing-meta-description, missing-h1, fetch-failed, noindex-detected, broken-internal-link
  - High: thin-content, missing-og-tags, missing-canonical, no-structured-data, invalid-json-ld, duplicate-title, duplicate-meta-description, multiple-h1
  - Medium: short/long title, short/long meta desc, missing-alt-text, few-internal-links, missing-lang, heading-hierarchy-broken, redirect-chain, content-duplication
  - Low: missing-viewport, bad-viewport, no-speakable, unoptimized-image-format, missing-lazy-loading
- **Deduplication:** Won't create duplicate tasks for same page + checkType. Uses `"url::checkType"` compound key.
- **Auto-resolve:** When a crawl issue disappears in a subsequent crawl, the corresponding task is marked `status: "done", autoResolved: true`
- **Unknown check types:** Generates generic tasks with severity-based priority
- `generateTasksFromCrawl(runId, siteId)` — Main pipeline, called after crawl
- `generateTasksFromLatestCrawl(siteId)` — Convenience wrapper
- **Wired into crawl API:** `/api/admin/seo/crawl/route.ts` POST now calls `generateTasksFromCrawl()` after crawl completes. Non-blocking — task generation failure doesn't fail the crawl response.

#### W1-F — Dashboard Auto-Sync
- SEO dashboard `useEffect` now fires a background `POST /api/admin/seo/gsc-sync` (force=false) on every load
- If data is stale (>6hrs), sync runs silently and re-fetches keywords on completion
- If data is fresh, API returns immediately with `status: "skipped"` (no GSC API calls)
- Non-blocking — failures don't affect dashboard rendering

#### W1-G — Competitor Seeding
- Added real MSP competitors: **Dataprise** (dataprise.com) + **Ntiva** (ntiva.com)
- Deactivated HIBU (hibu.com) — not an MSP competitor
- Script: `scripts/seed-competitors.ts`

#### W1-H — Task Backfill
- Ran `scripts/backfill-tasks.ts` to generate 30 tasks from existing crawl data
- 12 critical + 18 warning issues → 30 actionable SeoTask records
- Tasks include source tracking for future dedup/auto-resolve

#### W1-I — First GSC Sync Results
- Initial sync pulled 19 keywords and 13 pages from GSC
- Top keyword: "seed tech" (pos 7, 16 clicks, 138 impressions)
- 0/18 tracked keywords matched — expected since tracked keywords are aspirational targets, not yet ranking
- GSC data stored in `gsc_daily_keywords` and `gsc_daily_pages` tables for historical tracking

#### Files Created/Modified
| File | Action |
|------|--------|
| `prisma/schema.prisma` | Added 3 models (GscSyncLog, GscDailyKeyword, GscDailyPage), extended SeoTask with source tracking |
| `src/lib/gsc-sync.ts` | **NEW** — GSC sync engine (staleness check, data pull, DB storage, TrackedKeyword updates) |
| `src/lib/crawl-to-tasks.ts` | **NEW** — Crawl-to-tasks pipeline (30 templates, dedup, auto-resolve) |
| `src/app/api/admin/seo/gsc-sync/route.ts` | **NEW** — GSC sync API (GET status, POST trigger) |
| `src/app/api/admin/seo/crawl/route.ts` | Modified — added auto task generation after crawl |
| `src/app/admin/seo/settings/page.tsx` | Modified — added GSC Data Sync section in Automation tab |
| `src/app/admin/seo/page.tsx` | Modified — added background GSC auto-sync on dashboard load |
| `scripts/seed-competitors.ts` | **NEW** — Seed Dataprise + Ntiva, deactivate HIBU |
| `scripts/backfill-tasks.ts` | **NEW** — Backfill tasks from existing crawl data |
| `scripts/run-gsc-sync.ts` | **NEW** — Manual GSC sync script (first run) |

#### DB State After Week 1
| Table | Count | Notes |
|-------|-------|-------|
| `gsc_sync_logs` | 1 | First sync completed (4.8s) |
| `gsc_daily_keywords` | 19 | 19 keywords from GSC |
| `gsc_daily_pages` | 13 | 13 pages from GSC |
| `seo_tasks` | 30 | Generated from crawl issues |
| `tracked_keywords` | 18 | Aspirational targets (not yet matching GSC) |
| `competitor_domains` | 3 | Dataprise ✓, Ntiva ✓, HIBU ✗ (deactivated) |

---

### UX Overhaul + Dynamic Metadata System
**Date:** March 30, 2026  
**Commit:** b8b7a39 (96 files, +14,067 / −869 lines)

> User tested the SEO dashboard and found 4 critical UX problems. Fixed all 4, then discovered and fixed the root cause: admin metadata was never reaching live pages.

#### Problem 1: Strategy Tab — Display-Only Tasks
**Before:** Task list was read-only. No way to change status, navigate to fix, or mark complete.  
**After:**
- `toggleTaskStatus(taskId, currentStatus)` — cycles not-started → in-progress → done via API
- Priority badges (critical/high/medium/low) with color coding
- Source page links (click to see the page with the issue)
- "Edit Metadata" fix buttons (navigates to metadata editor for the right page)
- Filter tabs: All / Not Started / In Progress / Done
- Progress bar: visual completion tracker
- Auto-resolve indicator for tasks fixed by subsequent crawls

#### Problem 2: Keywords Tab — Duplicated AI Context Keywords
**Before:** Keywords tab showed a static table duplicating the AI Context page.  
**After:** Replaced with summary cards:
- Tier distribution (T1/T2/T3 counts)
- GSC performance stats (avg position, total clicks/impressions)
- "Manage Keywords" link to `/admin/seo/context?section=keywords`
- Kept AI Keyword Discovery section for quick research

#### Problem 3: Audit Tab — No Actions
**Before:** Audit results were informational only — no way to act on findings.  
**After:** Added "Action" column:
- "Fix" button → navigates to metadata tab and opens the slide-out editor for that page
- "Task" link → navigates to strategy tab filtered to that page's tasks
- Cross-tab navigation via `open-metadata-editor` custom event

#### Problem 4: Metadata Tab — Crawl Issue Disconnect
**Before:** Metadata tab showed pages as "complete" while audit tab flagged issues on the same page.  
**After:**
- Fetches crawl issues on mount, builds per-path issue map
- Bug icon with count badge on table rows that have crawl issues
- Crawl issues warning panel inside slide-out editor (severity-coded: red/yellow/blue)
- `open-metadata-editor` event listener for cross-tab navigation from audit/strategy tabs

#### Root Cause Discovery: Metadata Never Rendered on Live Pages
**The problem:** `PageMetadata` DB records stored what the admin wanted, but every page had hardcoded `export const metadata = {...}` in its source file. The DB was disconnected from rendering — the crawler saw hardcoded values, not admin values.

**Solution — Dynamic Metadata System (`src/lib/page-metadata.ts`):**
- `buildMetadata(path, defaults)` — Returns an async `generateMetadata()` function for Next.js
  1. Reads `PageMetadata` from DB via `prisma.pageMetadata.findUnique()`
  2. DB values override hardcoded defaults
  3. Handles: title, description, ogTitle, ogDescription, ogImage, canonical, noIndex, noFollow, twitterCard
- `resolveMetadata(path)` — Convenience for composing with other dynamic metadata
- `getPageMetadataRecord(path)` — Raw DB record access for custom `generateMetadata` (used by `blog/[slug]`)

**All 28 pages/layouts converted:**
- Replaced `export const metadata: Metadata = {...}` → `export const generateMetadata = buildMetadata("/path", { fallbacks })`
- `blog/[slug]` — Special case: merges DB overrides with blog post metadata via `getPageMetadataRecord()`
- `terms-conditions` — Passes `noIndex: true` as fallback (DB can override)
- Root `layout.tsx` and `admin/layout.tsx` kept static (site-wide defaults + admin area)

**On-demand revalidation:**
- `revalidatePath(path)` added to metadata save API (`POST /api/admin/seo/metadata`)
- `revalidatePath(page.path)` added to bulk generate API (`POST /api/admin/seo/metadata/generate-all`)
- Pages stay static (fast TTFB, good for SEO) but cache busts instantly when admin saves metadata

#### The Full Loop Now Works:
```
Admin saves metadata → DB updated → revalidatePath() fired
→ Next.js regenerates static page with new metadata
→ Crawler sees updated metadata → Audit matches reality
→ Strategy tasks auto-resolve when issues are fixed
```

#### Files Created/Modified
| File | Action |
|------|--------|
| `src/lib/page-metadata.ts` | **NEW** — Dynamic metadata system (buildMetadata, resolveMetadata, getPageMetadataRecord) |
| `src/app/api/admin/seo/metadata/route.ts` | Modified — added `revalidatePath()` after metadata save |
| `src/app/api/admin/seo/metadata/generate-all/route.ts` | Modified — added `revalidatePath()` after each page's metadata generation |
| `src/app/api/admin/seo/strategy/route.ts` | Modified — GET returns sourceType, sourceUrl, sourceCheckType, autoResolved |
| `src/app/admin/seo/page.tsx` | **Heavily modified** — rebuilt Strategy, Audit, Keywords tabs; added toggleTaskStatus, getFixUrl |
| `src/app/admin/seo/metadata-tab.tsx` | Modified — crawl issue integration, bug badges, cross-tab event listener |
| 19 page files + 4 layout files | Converted from static `export const metadata` to dynamic `buildMetadata()` |

#### Merge Resolution
Merged 14 remote commits (hero WebGL, PublicShell refactor, industry/about copy updates, case studies, new UI components). Resolved 6 conflicts:
- `about/page.tsx` — kept local redesign (hero image, statement, video, owner photos, service-link CTA) + remote's updated values copy
- `industries/construction|law-firms|medical|trucking` — kept `buildMetadata()` wrapper + remote's refined descriptions
- `globals.css` — kept ReactFlow canvas overrides + remote's trailing whitespace

---

## What's Next

### Phase 8: Content Pipeline Maturity
> Make the blog writer produce genuinely better content for clients.

1. **Evidence injection** — Auto-weave case studies, metrics, testimonials into AI drafts
2. **Content briefs** — AI-generated research-backed briefs before writing
3. **Post-publish monitoring** — Index verification, ranking tracking, citation tracking, decay alerts
4. **Structured data generator** — FAQPage, HowTo, Article, Speakable auto-generation

### Phase 9: Client Onboarding Polish
> Smooth experience when spinning up a new client site.

1. **GSC OAuth flow** — In-app consent, token storage, automatic data pulls
2. **Guided setup checklist** — Connect integrations, first crawl, first blog post
3. **White-label reports** — PDF exports, branded email reports
4. **Industry presets** — One-click IndustryConfig for common verticals (MSP, legal, HVAC, dental, etc.)

---

## Known Issues / Tech Debt
- TS server occasionally reports stale errors for new Prisma models (tsc validates clean)
- `DEFAULT_AUTHORS` in seo-eeat.ts kept as fallback — should eventually be removed when all sites have DB authors
- `DEFAULT_CONTEXT` in business-context.ts is SeedTech-specific — OK as ultimate fallback but clearly marked deprecated
- `DEFAULT_SITE_ID` / `DEFAULT_TENANT_ID` still referenced — needed for backwards compat during migration
- No email delivery for team invites (TODO: integrate Resend)
- Competitive intel URL discovery is basic (sitemap parsing) — needs headless browser for JS-rendered sites
- Content matching in gap analysis uses keyword/slug heuristics — could use embeddings for semantic matching