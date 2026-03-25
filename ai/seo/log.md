# SEO Autopilot — Development Log

**Project:** SeedTech SEO Autopilot (bundled with web builds for local businesses)  
**Stack:** Next.js 14.2 (App Router) · Prisma 7.5 · PostgreSQL (Neon) · Claude API · NextAuth · Tailwind  
**Repo:** github.com/seedtechmakesstufff/seedtech (main branch)  
**Last updated:** March 25, 2026

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
| `prisma/schema.prisma` | ~800 lines, 30+ models |
| `src/lib/ai-visibility.ts` | AI Visibility scoring engine (5 dimensions, 20+ checks) |
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
`Site` · `BusinessProfile` · `IndustryConfig` · `Author` · `ExperienceEvidence` · `BlogPost` · `SitePage` · `ContentScore` · `AIVisibilityScore` · `AICitation` · `CitationCheckRun` · `TrackedKeyword` · `KeywordCluster` · `ClusterSubtopic` · `InternalLinkSuggestion` · `ContentIdea` · `SeoTask` · `SeoSnapshot` · `SeoCrawlRun` · `SeoPageAudit` · `SeoInsight` · `CompetitorDomain` · `CompetitorAnalysis` · `SeoLeadEvent` · `CronJobRun` · `UserInvite`

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