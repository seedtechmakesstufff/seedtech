# SEO Autopilot — Development Log

**Project:** SeedTech SEO Autopilot (bundled with web builds for local businesses)  
**Stack:** Next.js 14.2 (App Router) · Prisma 7.5 · PostgreSQL (Neon) · Claude API · NextAuth · Tailwind  
**Repo:** github.com/seedtechmakesstufff/seedtech (main branch)  
**Last updated:** March 31, 2026

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
| `prisma/schema.prisma` | ~1100 lines, 35+ models |
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
| `src/lib/seo-context.ts` | Central AI context builder (business + keywords + pages + strategy docs → prompt) |
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
`Site` · `BusinessProfile` · `IndustryConfig` · `Author` · `ExperienceEvidence` · `BlogPost` · `SitePage` · `PageMetadata` · `PageContext` · `ContextNode` · `ContentScore` · `AIVisibilityScore` · `AICitation` · `CitationCheckRun` · `TrackedKeyword` · `KeywordCluster` · `ClusterSubtopic` · `InternalLinkSuggestion` · `ContentIdea` · `SeoTask` · `SeoSnapshot` · `SeoCrawlRun` · `SeoPageAudit` · `SeoInsight` · `CompetitorDomain` · `CompetitorAnalysis` · `SeoLeadEvent` · `CronJobRun` · `UserInvite` · `GscSyncLog` · `GscDailyKeyword` · `GscDailyPage` · `SeoStrategyDoc` · `ReportPreference`

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

### SEO Onboarding — Keyword Strategy + Strategy Docs
**Date:** March 31, 2026

> Full SEO onboarding for site_seedtech: service context nodes, 157-keyword strategy built over 4 iterations, SeoStrategyDoc persistence feature, and 4 strategy documents seeded.

#### OB-A — Service Context Nodes
Created 2 service nodes via `/admin/seo/context` → Service Nodes:
- **Managed IT Support** — 25 page links (primary: `/services/managed-it`, secondary: plans, assessment, onboarding, why-seedtech, mobile-device-management, industry pages)
- **Web Development** — 16 page links (primary: `/services/web-development`, secondary: ecommerce, custom-dev, seedtech-platform, seo-autopilot, industry pages)
- 41 total page links across both nodes

#### OB-B — Keyword Strategy (157 keywords, 4 rounds)

**Round 1 — v3 Base (92 keywords)**
Script: `scripts/seed-keywords-v3.ts`
Methodology: Deep-read every service page, industry page, FAQ, pricing section. Derived keywords from:
1. Actual page copy (hero sections, feature lists)
2. FAQ schema content (Google "People Also Ask" match)
3. Pricing specifics ("$110/user/month", "no contract")
4. Differentiator language ("unlimited help desk", "no ticket black holes")
5. Industry page framing ("digital intake tools law firm")
6. Local geography (Northern NJ, Morris/Sussex/Passaic/Warren County)

**Round 2 — AI Audit Patch (+18 keywords)**
Script: `scripts/seed-keywords-v3-patch.ts`
Triggered by GSC Full Audit results: 94% brand traffic, avg position 27.8, only 2/18 non-brand clicks.
Added: near-me queries, emergency/crisis terms, competitor displacement terms, geo expansion. Re-tiered 3 keywords to tier1, fixed 1 target page.

**Round 3 — Reactive Expansion (+48 keywords)**
Script: `scripts/seed-keywords-reactive.ts`
Thesis: Most managed IT searches happen AFTER something breaks. 6 pain categories:
- Crisis Moment (16kw): email outages, hacked, ransomware, server crashes
- Frustration (9kw): bad MSP experience, slow response, "how to fire your IT company"
- Post-Incident (6kw): prevention after breach, "what to do after data breach"
- Compliance Panic (6kw): insurance denied, HIPAA, failed audit
- Cost Shock (6kw): too expensive, locked into contract, per-user pricing searches
- Growth Trigger (5kw): outgrew break-fix, "nephew does our IT"

**Final distribution:**
| Tier | Count | Intent | Count |
|------|-------|--------|-------|
| T1 | 13 | Commercial | 82 |
| T2 | 81 | Informational | 49 |
| T3 | 63 | Transactional | 24 |
| | | Navigational | 2 |

#### OB-C — SeoStrategyDoc Feature (NEW)

**Problem:** AI research output was ephemeral — streaming results that disappeared after the session. No way to persist strategy context for future AI operations.

**Solution:** Full `SeoStrategyDoc` model with CRUD, versioning, and injection into all AI consumers.

**Schema additions** (`prisma/schema.prisma`):
- `StrategyDocCategory` enum: `keyword_strategy`, `content_roadmap`, `audit_findings`, `competitive_analysis`, `general`
- `SeoStrategyDoc` model: `siteId`, `title`, `category`, `content` (Text/markdown), `isActive`, `version` (auto-increments on content change), `source`, timestamps
- `strategyDocs` relation added to `Site` model

**API routes:**
- `GET/POST /api/admin/seo/strategy-docs` — List (with `?category=` and `?active=` filters) + create/update
- `GET/PUT/DELETE /api/admin/seo/strategy-docs/[id]` — Single doc operations

**Wired into 4 AI consumers:**
| Consumer | File | How |
|----------|------|-----|
| Metadata generation | `src/lib/seo-context.ts` | New section 5 in `getSeoContext()`, active docs formatted as `### title (category)\ncontent`, injected into `fullPrompt` between KEYWORDS and BUSINESS CONTEXT |
| Keyword research | `src/app/api/admin/seo/keywords/research/route.ts` | `strategyBlock` variable appended to `dataContext` for all 5 research modes |
| Blog writer | `src/app/api/ai/generate-blog/route.ts` | `strategyDocsContext` appended to `strategyContext` for outline/draft/meta |
| Batch blog writer | `src/lib/batch-blog-writer.ts` | `strategyDocsContext` appended to `baseContext` |

**UI** (`src/app/admin/seo/context/page.tsx`):
- New 5th navigation section "Strategy" with ScrollText icon
- `StrategyDocsSection` component (~300 lines):
  - Document list with expand/collapse content view
  - Create/edit form with title, category dropdown, content textarea, active toggle
  - Delete with confirmation
  - Toggle active/inactive from list view
  - Category icons and color coding
  - Version display and source tracking
  - Empty state with description

#### OB-D — Strategy Documents Seeded
Script: `scripts/seed-strategy-docs.ts`
4 documents, all active:

| Title | Category | Content |
|-------|----------|---------|
| Keyword Architecture — 157 Keywords, 3 Tiers | `keyword_strategy` | Tier structure, intent distribution, derivation methodology, what's excluded |
| Reactive Keyword Thesis — Pain-Point Targeting | `keyword_strategy` | 6 pain categories, 48 keywords, content implications |
| GSC Baseline — March 2026 Audit | `audit_findings` | 94% brand traffic, avg position 27.8, quick wins, 90-day targets |
| Blog Content Roadmap — 31 Articles | `content_roadmap` | 5 priority tiers, specific slugs, content guidelines (citeable paragraphs, entity refs, internal links, CTAs) |

#### OB-E — Miscellaneous Changes
- `src/lib/page-metadata.ts` — Fixed `buildMetadata()` import pattern for consistency across 28 page files
- `src/components/forms/AuditForm.tsx` — Form validation cleanup
- `src/components/quote-generator/quote-price-calculator.tsx` — Minor pricing display fix
- `ai/security/security-requirements.md` — Added security notes

#### Files Created/Modified
| File | Action |
|------|--------|
| `prisma/schema.prisma` | Added `StrategyDocCategory` enum, `SeoStrategyDoc` model, `strategyDocs` relation on Site |
| `src/app/api/admin/seo/strategy-docs/route.ts` | **NEW** — Strategy docs list + create/update API |
| `src/app/api/admin/seo/strategy-docs/[id]/route.ts` | **NEW** — Strategy doc GET/PUT/DELETE API |
| `src/lib/seo-context.ts` | Added `strategyContext` to interface, section 5 fetch, fullPrompt injection |
| `src/app/api/admin/seo/keywords/research/route.ts` | Added `strategyBlock` fetch + inject into dataContext |
| `src/app/api/ai/generate-blog/route.ts` | Added `strategyDocsContext` fetch + inject |
| `src/lib/batch-blog-writer.ts` | Added `strategyDocsContext` fetch + inject |
| `src/app/admin/seo/context/page.tsx` | Added Strategy nav section + StrategyDocsSection component (~300 lines) |
| `src/lib/page-metadata.ts` | buildMetadata import pattern cleanup |
| `src/components/forms/AuditForm.tsx` | Form validation cleanup |
| 28 page/layout files | `buildMetadata()` wrapper updates |
| `scripts/seed-keywords-v3.ts` | **NEW** — 92 base keywords |
| `scripts/seed-keywords-v3-patch.ts` | **NEW** — 18 AI audit patch keywords |
| `scripts/seed-keywords-reactive.ts` | **NEW** — 48 reactive/pain-point keywords |
| `scripts/seed-strategy-docs.ts` | **NEW** — 4 strategy documents |

#### DB State After Onboarding
| Table | Count | Notes |
|-------|-------|-------|
| `context_nodes` | 2+ | Managed IT Support, Web Development (+ business node) |
| `context_node_pages` | 41 | Page links across both service nodes |
| `tracked_keywords` | 157 | 13 T1 / 81 T2 / 63 T3 |
| `seo_strategy_docs` | 4 | All active, feeding all AI prompts |
| `gsc_sync_logs` | 1+ | Baseline sync completed |
| `gsc_daily_keywords` | 19+ | From GSC |
| `seo_tasks` | 30+ | From crawl issues |

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

### Week 2 — Content Engine
**Date:** March 30, 2026  
**Commit:** 1919172 (7 files, +802 lines)

> Build the AI content pipeline: generate a data-driven content calendar from GSC + tracked keywords, then batch-write blog posts from the ideas.

#### W2-A — Content Calendar Generator (`src/lib/content-calendar-generator.ts`)
- `generateContentCalendar(siteId, { ideaCount?, save? })` — Full AI content calendar pipeline:
  1. Gathers business context, tracked keywords (with GSC performance), existing blog posts, existing content ideas, keyword clusters
  2. Identifies **content gaps** — keywords with no content targeting them
  3. Identifies **strike-distance keywords** — positions 8-20 (close to page 1)
  4. Identifies **high-impression/low-CTR keywords** — content improvement opportunities
  5. Builds a rich Claude prompt with all data + strategic rules (funnel mix, sequencing, dedup)
  6. Parses Claude's JSON response into `GeneratedIdea[]`
  7. Matches ideas to existing `KeywordCluster` records by seed keyword overlap
  8. Deduplicates against existing `ContentIdea` records (case-insensitive keyword match)
  9. Saves new ideas to DB as `ContentIdea` (status: "idea")
- **Output:** `CalendarGenerationResult { ideas, saved, skipped, prompt }`
- **Rules baked into prompt:** 40% Top / 35% Middle / 25% Bottom funnel mix, foundational → authority → niche sequencing, one primary keyword per article, question-format titles preferred

#### W2-B — Content Calendar API (`/api/admin/seo/content-calendar/generate`)
- `POST` — Triggers calendar generation for the current site
- Body: `{ ideaCount?: number, preview?: boolean }`
- Returns: `{ success, ideas[], saved, skipped, total }`

#### W2-C — Batch Blog Writer (`src/lib/batch-blog-writer.ts`)
- `batchWriteBlogPosts(siteId, { count?, status?, ideaIds? })` — Writes N blog posts from unpublished ContentIdeas:
  1. Picks next N ideas with `status: "idea"` (or specific IDs)
  2. Loads shared context once (business, author, tracked keywords, AI-first instructions)
  3. For each idea, runs 3-step Claude pipeline:
     - **Outline** — Structured JSON (title, slug, sections, FAQ, meta, tags, category)
     - **Draft** — Full markdown, AI-citation-optimized (citeable opening, entity definition, question H2s, comparison table, numbered steps, definitions, FAQ section, CTA)
     - **Meta** — metaTitle, metaDescription, excerpt
  4. Saves as `BlogPost` via `createPost()` (with word count calculation)
  5. Updates `ContentIdea` status → "draft" and sets slug
  6. Duplicate slug detection with skip + error reporting
- **Output:** `BatchResult { total, written, failed, posts[], errors[] }`
- Sequential execution (avoids Claude rate limits), max 10 per batch

#### W2-D — Batch Blog API (`/api/admin/seo/blog-batch/generate`)
- `POST` — Triggers batch blog writing
- Body: `{ count?: number (max 10), status?: "draft"|"published", ideaIds?: string[] }`
- Returns: `{ success, total, written, failed, posts[], errors[] }`

#### W2-E — Strategy Tab UI Enhancements
- **"Generate 90-Day Plan" button** — Purple sparkle button in Content Calendar header
  - Loading spinner during generation
  - Result banner: "✓ Generated 12 ideas — 10 saved, 2 skipped (already existed)"
  - Dismissible with X button
- **"Write 5 Posts" button** — Blue pencil button next to calendar generator
  - Disabled when no `status: "idea"` content ideas exist
  - Tooltip shows count of available ideas
  - Loading spinner during batch writing
  - Result banner: "✓ Wrote 5/5 blog posts as drafts" with keyword tag links
  - Auto-refreshes strategy data after completion
- Both buttons disable each other during execution (prevent concurrent long-running jobs)

#### W2-F — Copy Updates
- "Trusted by Brands" heading in `TrustedBySection.tsx` and `services/web-development/page.tsx`

#### Files Created/Modified
| File | Action |
|------|--------|
| `src/lib/content-calendar-generator.ts` | **NEW** — AI content calendar generator (318 lines) |
| `src/lib/batch-blog-writer.ts` | **NEW** — Batch blog writer pipeline (301 lines) |
| `src/app/api/admin/seo/content-calendar/generate/route.ts` | **NEW** — Calendar generation endpoint |
| `src/app/api/admin/seo/blog-batch/generate/route.ts` | **NEW** — Batch blog writing endpoint |
| `src/app/admin/seo/page.tsx` | Modified — added calendar + batch writer buttons, state, result banners |
| `src/components/home/TrustedBySection.tsx` | Modified — "Trusted by Brands" copy |
| `src/app/services/web-development/page.tsx` | Modified — "Trusted by Brands" copy |

---

### Week 3 — Analysis Depth
**Commit:** c8cd5f9 (4 files, +233/−21 lines)

> Fix insights to use site-scoped GSC credentials + add keyword gap analysis.

#### W3-A — Insight Detector GSC Fixes (`src/lib/seo-insights.ts`)
**Critical bug found and fixed:** All 4 GSC-dependent insight detectors were calling GSC functions without site-scoped integration credentials. They used the env-only `isSearchConsoleConfigured()` check and called `getKeywordPerformance()` / `getPagePerformance()` without passing the integration object.

**Functions fixed:**
- `detectCannibalization(siteId)` — Now loads integration via `getSearchConsoleIntegration(siteId)`, passes it to `getKeywordPerformance()`
- `detectCTROpportunities(siteId)` — Same fix: loads integration, passes to `getKeywordPerformance()`
- `discoverKeywords(siteId)` — Loads integration + business context, passes to `getKeywordPerformance()`. Also fixed missing `siteId` param for `getTrackedKeywordStrings()`
- `detectLinkingOpportunities(siteId)` — GSC section now loads integration, passes to `getPagePerformance()`. Fixed missing `siteId` for `getTrackedKeywords()`

**Import changes:** Added `getSearchConsoleIntegration`, `getBusinessContextForSite`; removed unused `SearchConsoleIntegration` type

#### W3-B — Keyword Gap Analysis (`src/lib/competitive-intel.ts`)
**New function:** `findKeywordGaps(siteId)` — Compares competitor analysis topics against our tracked keywords + published blog posts.

**Logic:**
1. Loads all competitor analyses, tracked keywords, and published blog posts
2. For each competitor topic: checks substring match and word-overlap (≥2 shared words) against our keywords
3. Topics we don't cover → `gapType: "they-have-we-dont"` with competitor URL and AI Vis score
4. Keywords we track but no competitor covers → `gapType: "we-have-they-dont"` (our advantage)
5. Returns capped at 75 gaps, sorted with opportunities first

**New interface:** `KeywordGap { keyword, competitorDomain, competitorUrl, competitorHasCoverage, weHaveCoverage, gapType, opportunity }`

#### W3-C — API Update (`/api/admin/seo/competitors/analysis`)
- GET handler now calls `findKeywordGaps(siteId)` alongside existing `getCompetitorOverviews` + `getCompetitorGaps`
- Returns `{ overviews, gaps, keywordGaps }`

#### W3-D — Competitors Tab UI (`competitors-tab.tsx`)
- Added `KeywordGap` interface + state + expandable panel
- Color-coded dots: 🔴 `they-have-we-dont`, 🟢 `we-have-they-dont`, 🔵 `both-have`
- Badges: "They have it" / "Our advantage"
- Opportunity descriptions with competitor domain labels
- External links to competitor pages

#### W3-E — Build Fix
- `[...ourKeywords]` → `Array.from(ourKeywords)` for Set iteration (tsconfig compat)

---

### Testing Results (March 30, 2026)

Automated test suite: `scripts/test-week2-3.py` — 5/5 PASS

#### Week 2 Results
| Test | Status | Details |
|------|--------|---------|
| **2A Content Calendar** | ✅ PASS | 12 ideas generated, 5 saved, 7 skipped (from prior test run) |
| **2B Calendar Dedup** | ✅ PASS | 6 ideas generated, 6/6 skipped — dedup working perfectly |
| **2C Batch Blog Writer** | ✅ PASS | 2 posts written, 0 failed. 1,811 + 1,913 words |

Sample posts:
- "Break-Fix vs Managed IT: Why Northern NJ Businesses Are Making the Switch in 2025" (1,811 words)
- "How to Choose an MSP: The Complete Guide for NJ Business Owners (2025)" (1,913 words)

#### Week 3 Results
| Test | Status | Details |
|------|--------|---------|
| **3A SEO Insights** | ✅ PASS | 4 insights: ctr_optimization, eeat_issue, internal_linking, keyword_opportunity |
| **3B Competitor Gaps** | ✅ PASS | 2 overviews, 50 content gaps, 75 keyword gaps (all they-have-we-dont) |

Sample insight: "[eeat_issue] /blog has 4 E-E-A-T issue(s) (1 critical) — No outbound links to authoritative sources"
Sample gap: "[they-have-we-dont] 'SEO vs GEO vs AEO vs AIO: How They Differ' — hibu.com covers this topic (AI Vis: 15)"

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

1. ~~Strategy document persistence~~ ✅ Done (March 31 — SeoStrategyDoc model + UI)
2. ~~Keyword seeding methodology~~ ✅ Done (March 31 — documented in ONBOARDING.md)
3. **GSC OAuth flow** — In-app consent, token storage, automatic data pulls
4. **Guided setup checklist** — Connect integrations, first crawl, first blog post
5. **White-label reports** — PDF exports, branded email reports
6. **Industry presets** — One-click IndustryConfig for common verticals (MSP, legal, HVAC, dental, etc.)
7. **Strategy doc templates** — Pre-built strategy doc templates per industry vertical

---

## Known Issues / Tech Debt
- TS server occasionally reports stale errors for new Prisma models (tsc validates clean — restart TS server to fix)
- `DEFAULT_AUTHORS` in seo-eeat.ts kept as fallback — should eventually be removed when all sites have DB authors
- `DEFAULT_CONTEXT` in business-context.ts is SeedTech-specific — OK as ultimate fallback but clearly marked deprecated
- `DEFAULT_SITE_ID` / `DEFAULT_TENANT_ID` still referenced — needed for backwards compat during migration
- No email delivery for team invites (TODO: integrate Resend)
- Competitive intel URL discovery is basic (sitemap parsing) — needs headless browser for JS-rendered sites
- Content matching in gap analysis uses keyword/slug heuristics — could use embeddings for semantic matching
- Strategy doc content is plain markdown in a textarea — could benefit from a rich editor in future
- Keyword seed scripts in `/scripts/` are one-shot and SeedTech-specific — need generalized import/export for other clients