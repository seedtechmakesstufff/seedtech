# SeedTech SEO Autopilot — Comprehensive System Review

**Date:** March 25, 2026  
**Goal:** Evaluate readiness as a reusable SaaS product, aligned with Google's E-E-A-T framework, topic authority, and the rise of generative AI in search.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What's Working Well](#2-whats-working-well)
3. [Architecture & SaaS Readiness Gaps](#3-architecture--saas-readiness-gaps)
4. [E-E-A-T Alignment Audit](#4-e-e-a-t-alignment-audit)
5. [AI Search / Generative Engine Optimization Audit](#5-ai-search--generative-engine-optimization-audit)
6. [Topic Authority & Content Strategy Gaps](#6-topic-authority--content-strategy-gaps)
7. [Scoring Engine Critique](#7-scoring-engine-critique)
8. [Blog Writer / Content Pipeline Critique](#8-blog-writer--content-pipeline-critique)
9. [Missing Features for a Real SaaS Product](#9-missing-features-for-a-real-saas-product)
10. [Prioritized Roadmap](#10-prioritized-roadmap)

---

## 1. Executive Summary

The system has strong foundations: a multi-tenant schema (Passes 1-4 complete), an AI Visibility scoring engine, E-E-A-T page-level auditing, AIO content optimization, a blog writer with AI-first prompts, site crawling with 25+ check types, content scoring, keyword tracking with GSC integration, insights engine, lead tracking, email reports, competitor tracking, and a template-based onboarding system.

**However, there are significant gaps between where we are and a shippable SaaS product that aligns with today's SEO reality:**

### The 3 Biggest Strategic Problems

| # | Problem | Impact |
|---|---------|--------|
| 1 | **The AI Visibility scoring is a heuristic checklist, not measured citation data** | The system claims to score "AI citation probability" but actually checks for markdown formatting patterns. It has no real-world AI citation measurement. The `AICitation` table exists but is a manual logging endpoint with no automated collectors. |
| 2 | **E-E-A-T is surface-level** | Google's E-E-A-T guidance (per the Feb 2023 blog post and subsequent updates) centers on "Who created the content, How, and Why." The system checks for regex patterns like `/we've/` and counts credential-sounding words. It doesn't model actual author entities per-site, verify real credentials, track author-topic mapping, or build genuine topical authority signals. |
| 3 | **Content generation lacks genuine expertise injection** | The blog writer produces AI content with AI-sounding experience markers ("In our experience..."). Google's guidance is explicit: AI content is fine IF it demonstrates real E-E-A-T. The system has no mechanism to inject real company data, case study results, proprietary metrics, or genuine expert quotes into AI-generated content. |

### The 3 Biggest SaaS Architecture Problems

| # | Problem | Impact |
|---|---------|--------|
| 1 | **No billing, usage limits, or plan enforcement** | `plans.ts` defines IT support plans, not SaaS subscription tiers. There's no concept of a free vs. paid tenant, API call budgets, or feature gates. |
| 2 | **Hardcoded SeedTech DNA still permeates the system** | `DEFAULT_AUTHORS` has SeedTech data. `seo-eeat.ts` checks for NJ-specific certifications. `ai-visibility.ts` references "Northern New Jersey" and MSP-specific credentials (CompTIA, CISSP). `scoreContentEEAT` checks for `seedtechllc.com` in external link detection. Business context defaults are SeedTech-specific. |
| 3 | **No user-facing management for critical SaaS features** | No UI for: managing author entities, configuring which credentials matter for their industry, setting up automated crawl schedules, managing GSC OAuth flow, or customizing scoring weights per industry. |

---

## 2. What's Working Well

### Multi-Tenant Architecture ✅
- **Tenant → Site → all-data** hierarchy is clean and complete
- Every SEO model has `siteId` with cascade deletes
- `requireSiteContext()` pattern is solid — session-aware + cookie override for site switching
- Role-based access (owner/admin/editor/viewer) with `hasRole()` helper
- Site switcher component with validated cookie-based override
- Template-based onboarding with placeholder substitution (`{region}`, `{year}`)

### Data Model ✅
The Prisma schema at 578 lines is comprehensive:
- `TrackedKeyword` with GSC position tracking, tier, intent, cluster association
- `KeywordCluster` for topic authority modeling
- `ContentScore` combining E-E-A-T + AIO + AI Visibility into a composite score
- `AICitation` for tracking brand mentions across AI platforms
- `AIVisibilityScore` for historical score trends
- `SeoLeadEvent` for SEO → conversion attribution
- `CompetitorDomain` for competitive intelligence
- `SeoTask` + `ContentIdea` for workflow management
- `SeoCrawlRun` + `SeoPageAudit` for audit history

### Crawler v2 ✅
- 25+ check types: title, meta, headings, images, links, structured data, robots, viewport, canonical, hreflang, content duplication, E-E-A-T signals
- Content similarity hashing for duplication detection
- E-E-A-T page-level audit integration
- Site-scoped with `SitePage` inventory

### Insights Engine ✅
- Content freshness detection
- Keyword cannibalization via GSC + tracked keyword cross-reference
- Internal linking suggestions using `SitePage` inventory
- E-E-A-T deficiency detection from crawl data
- CTR optimization from GSC data
- Keyword discovery via Claude

### AI-First Content Philosophy ✅
The core insight is correct: content should be written to be cited by AI systems, not just to rank. The writing instructions in `getAIFirstWritingInstructions()` and `getAIOWritingInstructions()` reflect this well.

---

## 3. Architecture & SaaS Readiness Gaps

### 3.1 No Subscription / Billing Layer

**Current state:** `plans.ts` defines IT support plans (SeedCare Essentials/Plus/Pro). There is no SaaS subscription model.

**Needed:**
- `Subscription` model on `Tenant` (plan tier, status, billing period, trial end)
- Feature flags per plan (e.g., free = 1 site + 50 keywords, Pro = 10 sites + unlimited)
- Usage metering: AI API calls per month, crawl pages per month, keyword slots
- Stripe/billing integration (or at minimum, plan enforcement middleware)
- Trial flow with auto-downgrade

### 3.2 Remaining SeedTech-Specific Hardcoding

| File | Hardcoded Value | Fix |
|------|----------------|-----|
| `seo-eeat.ts` | `DEFAULT_AUTHORS` with SeedTech data | Author entities should be per-site in DB |
| `seo-eeat.ts` | `getAuthorEntity()` falls back to SeedTech | Should fall back to site's business profile |
| `ai-visibility.ts` | Geographic check for "New Jersey/NJ/Bergen County" | Should use site's `location` from BusinessProfile |
| `ai-visibility.ts` | Entity check for "CompTIA/CISSP/CISM/Microsoft/AWS" | Should use site's `brandEntities` + industry-specific credentials |
| `ai-visibility.ts` | `brandName` defaults to `"SeedTech"` | Should always require explicit brand name |
| `seo-eeat.ts` | `scoreContentEEAT` checks for `seedtechllc.com` | Should use site's domain |
| `business-context.ts` | `DEFAULT_CONTEXT` is all SeedTech | OK as ultimate fallback, but should be clearly marked |
| `seo-aio.ts` | Freshness check regex `20(24|25|26|27)` | Should compute from current year dynamically |
| `ai-advisor/route.ts` | Uses `getServerSession` directly instead of `requireSiteContext()` | Should use the standard pattern |
| `site-context.ts` | `DEFAULT_SITE_ID = "site_seedtech"` | Eventually remove; currently needed for backwards compat |

### 3.3 OAuth / Integration Management

**Current state:** `IntegrationCredential` model exists but there's no UI or OAuth flow for connecting GSC/GA4. The system reads from env vars (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GSC_SITE_URL`).

**Needed:**
- GSC OAuth 2.0 consent flow per site
- GA4 integration (currently no GA4 data ingestion at all)
- Integration status dashboard showing connected/disconnected per site
- Credential encryption/decryption for stored OAuth tokens

### 3.4 Background Jobs / Cron System

**Current state:** Snapshots, crawls, and insights are triggered manually from the dashboard or ad-hoc. There's no scheduler.

**Needed:**
- Cron system for: weekly snapshots, weekly crawls, daily GSC data pulls, monthly reports
- Job queue for: AI content generation, bulk scoring, bulk crawling
- Job status tracking in UI

### 3.5 API Design for External Consumers

All API routes are under `/api/admin/seo/*` and are session-authenticated. For a SaaS product:
- Need public API with API key auth for external integrations
- Rate limiting per tenant/plan
- Webhook support for events (crawl complete, score changed, insight generated)

---

## 4. E-E-A-T Alignment Audit

### Google's Actual Guidance (from the referenced blog post + EEAT docs)

Google's position is clear:
1. **AI content is NOT against guidelines** — it's about quality, not production method
2. **E-E-A-T = Experience, Expertise, Authoritativeness, Trustworthiness**
3. **The Who/How/Why framework:**
   - **Who** created the content? Is authorship clear?
   - **How** was the content created? If AI was involved, is that disclosed?
   - **Why** was the content created? Was it created for people, or to manipulate rankings?
4. **Author bylines should be used when readers would reasonably expect it**
5. **AI disclosures are useful when readers might wonder "how was this created?"**

### Current System vs. Google's E-E-A-T Requirements

| E-E-A-T Dimension | What Google Wants | What We Have | Gap |
|---|---|---|---|
| **Experience** | Real first-hand experience evidence | Regex check for `/we've|our team/` patterns in markdown | ❌ Detects AI-written experience language, not real experience. No mechanism to inject actual case studies, client outcomes, or proprietary data |
| **Expertise** | Identifiable expert authors with verifiable credentials | `DEFAULT_AUTHORS` dict with SeedTech hardcoded. `getAuthorEntity()` returns generic data | ❌ No per-site author management. No credential verification. No author-topic authority mapping |
| **Authoritativeness** | External recognition, citations, known entity | Checks for outbound links to .gov/.edu and Organization schema | ⚠️ Partially covered. Missing: backlink profile, brand mention monitoring, third-party citation tracking |
| **Trustworthiness** | HTTPS, privacy policy, contact info, accurate content | Checks HTTPS, privacy links, contact info, date signals | ✅ Adequate for page-level audit. Missing: review/testimonial structured data, business verification |

### Critical E-E-A-T Gaps

#### Gap 1: No Author Entity System
The `AuthorEntity` type exists in `seo-eeat.ts` but is hardcoded. A SaaS product needs:
```
model Author {
  id          String   @id
  siteId      String
  name        String
  slug        String
  jobTitle    String
  bio         String
  imageUrl    String?
  canonicalUrl String  // /about#sam or /team/sam
  sameAs      String[] // LinkedIn, GitHub, etc.
  expertise   String[] // topics qualified to write about
  credentials String[] // CompTIA A+, CISSP, etc.
  site        Site     @relation(...)
  
  @@unique([siteId, slug])
}
```
This powers:
- Person schema generation in blog posts
- Author bylines with bio links
- Author-topic authority scoring (is this author qualified for this topic?)
- E-E-A-T expertise signals that are real, not AI-generated

#### Gap 2: No "Experience Evidence" System
Google's "Experience" is the hardest signal to fake. The system needs a way for users to:
- Upload/link case studies with real metrics
- Tag blog posts with related case studies
- Define company-specific data points (e.g., "We've helped 150+ NJ businesses")
- Auto-inject these into AI-generated content as genuine experience signals

Something like:
```
model ExperienceEvidence {
  id          String
  siteId      String
  type        String  // "case_study", "metric", "testimonial", "certification"
  title       String
  content     String  // The quotable evidence
  source      String? // Client name, certification body, etc.
  tags        String[] // Topics this applies to
  isPublic    Boolean  // Can be shown on site
}
```

#### Gap 3: No AI Content Disclosure System
Google explicitly recommends AI disclosures when appropriate. The blog writer generates 100% AI content with no disclosure mechanism. Need:
- Configurable AI disclosure toggle per site
- Auto-inserted disclosure footer in AI-generated posts
- Audit trail of which content was AI-generated vs. human-written
- "Human reviewed" flag and reviewer attribution

---

## 5. AI Search / Generative Engine Optimization Audit

### The Generative AI Search Landscape (2026)

The system correctly identifies the shift: ~65% of queries now get AI-generated answers. The scoring engine targets the right platforms:
- Google AI Overviews (AIO)
- ChatGPT / Copilot
- Perplexity
- Gemini

### What's Strong

1. **AI Visibility Score** — The 5-dimension scoring (Citation Readiness, Entity Authority, Structured Clarity, Conversational Fit, Multi-Engine Coverage) is a well-designed rubric
2. **AIO optimization** — Direct answer scoring, Q&A structure, comparison tables, FAQ detection
3. **Writing instructions** — `getAIFirstWritingInstructions()` is an excellent prompt system
4. **Entity signal extraction** — `extractEntitySignals()` identifies brand definitions, claims, credentials, attributions, relationships

### Critical Gaps

#### Gap 1: No Actual AI Citation Measurement
The `AICitation` table and API exist, but it's a **manual logging endpoint**. The system cannot:
- Automatically query ChatGPT/Perplexity/Gemini to check if the brand is being cited
- Monitor Google AIO results for brand mentions
- Track citation trends over time from real data
- Compare citation rates against competitors

**This is the single most important feature gap.** The entire system philosophy is "be cited by AI" but there's no automated way to measure whether that's actually happening. The scoring engine tells you what *should* help, but never validates whether it *did* help.

**Recommendation:** Build a Citation Monitor service:
1. Define a set of "brand queries" per site (e.g., "best managed IT services Northern NJ")
2. Periodically query AI platforms via their APIs (Perplexity has a public API, OpenAI/Anthropic can be queried, Google AIO is harder)
3. Parse responses for brand mentions, URL citations, sentiment
4. Store results in `AICitation` and surface trends in dashboard

#### Gap 2: No Structured Data Generation
The system **audits** for structured data (JSON-LD) but doesn't **generate** it. A SaaS SEO tool should:
- Auto-generate FAQPage schema from FAQ sections in blog posts
- Auto-generate HowTo schema from numbered step lists
- Auto-generate Article schema with proper author attribution
- Auto-generate Organization + LocalBusiness schema for service pages
- Auto-generate Speakable schema for AI-targeted content
- Provide a "Schema Builder" UI or at minimum, copy-paste schema snippets

#### Gap 3: No Content Cluster / Topic Authority Visualization
The `KeywordCluster` model exists but has no UI, no automatic cluster generation, and no pillar-cluster content strategy tooling. Topic authority is THE key ranking signal for 2026, and the system doesn't help users build it.

**Needed:**
- Topic cluster visualization (pillar page → supporting content map)
- Cluster gap analysis (which subtopics have no content?)
- Cluster authority scoring (how well does each cluster cover its topic?)
- AI-assisted cluster expansion (suggest new content for weak clusters)
- Internal link recommendations within clusters

#### Gap 4: No Source Attribution System
Perplexity and Google AIO heavily weight content that cites authoritative sources. The system checks for external links but doesn't:
- Maintain a library of authoritative sources per industry
- Auto-suggest citations during content creation
- Verify cited sources are still live
- Track which sources AI platforms trust most in the user's industry

---

## 6. Topic Authority & Content Strategy Gaps

### Current State
- `KeywordCluster` model: id, name, pillarPage, description, keywords[]
- `TrackedKeyword` has clusterId linking to cluster
- `ContentIdea` has title, targetKeyword, funnelStage, status
- Template system provides starter keywords, tasks, and content ideas

### What's Missing

#### 6.1 No Topic Map / Content Hub Architecture
Modern SEO requires a "hub and spoke" content architecture:
- **Pillar page** (2000+ word comprehensive guide on a core topic)
- **Cluster pages** (supporting blog posts targeting long-tail variations)
- **Internal linking web** between pillar and cluster pages

The system has the data model (`KeywordCluster.pillarPage`) but no:
- UI to create/visualize topic maps
- AI to auto-generate topic maps from a seed keyword
- Content gap analysis within a topic cluster
- Internal link enforcement within clusters
- Topic authority scoring

#### 6.2 No Content Freshness System
The insights engine detects stale content (>3 months), but there's no:
- Content update workflow (suggest specific sections to update)
- Auto-refresh scheduling
- Freshness score tracking over time
- Competitor freshness comparison

#### 6.3 No Content Repurposing / Distribution
A single blog post should become:
- Social media snippets
- Email newsletter excerpt
- FAQ schema entries
- Knowledge base article
- Video script outline

The system generates blog posts but doesn't help with content repurposing.

#### 6.4 No Competitive Content Analysis
`CompetitorDomain` exists but has no intelligence:
- No content gap analysis (what topics do competitors cover that we don't?)
- No SERP feature tracking (who owns featured snippets, PAA, AIO for our keywords?)
- No competitor content scoring (how does their AI Visibility score compare?)

---

## 7. Scoring Engine Critique

### AI Visibility Score (`ai-visibility.ts`)

**Strengths:**
- 5-dimension model is well-designed
- 20+ individual checks with weights
- Clear grade system (A-F)
- Actionable fix suggestions per check

**Problems:**

| Issue | Severity | Detail |
|-------|----------|--------|
| Heuristic-only scoring | 🔴 Critical | Counts regex matches, not actual AI citation rates. A perfectly-scored article may never get cited; a poorly-scored one might. |
| Hardcoded credential list | 🟡 Medium | Checks for CompTIA/CISSP/Microsoft/AWS — MSP-specific. A law firm or HVAC company has different credential signals. |
| Hardcoded geography | 🟡 Medium | Checks for "New Jersey/NJ/Bergen County" — should use site's location from BusinessProfile. |
| No industry context | 🟡 Medium | An e-commerce product page and a legal advice article have very different AI citation patterns. The scorer treats all content the same. |
| Freshness year list is static | 🟢 Low | `20(24|25|26|27)` will stop working in 2028. Should compute dynamically. |
| No word count factor | 🟢 Low | A 300-word page and a 3000-word pillar are scored identically. Thin content should be penalized. |

**Recommendations:**
1. Make credential lists, geography terms, and entity relationships configurable per site (pull from `BusinessProfile.brandEntities` + new `IndustryConfig`)
2. Add content type context: service page, blog post, landing page, pricing page each have different optimal patterns
3. Add word count as a factor (thin content penalty, minimum thresholds per page type)
4. Eventually: validate scores against real AI citation data to calibrate weights

### E-E-A-T Score (`seo-eeat.ts`)

**Strengths:**
- Page-level HTML audit is thorough (author schema, trust signals, outbound links)
- Content-level markdown scoring for pre-publish checks
- Clear signal categorization

**Problems:**

| Issue | Severity | Detail |
|-------|----------|--------|
| Author system is SeedTech-only | 🔴 Critical | `DEFAULT_AUTHORS` record has one entry: "seedtech". Other sites get a generic clone. |
| Credential detection is keyword matching | 🟡 Medium | Matching `/CompTIA|CISSP|CISM/` doesn't verify anything. It could match in a sentence like "We don't have CISSP certification." |
| No author-topic authority mapping | 🟡 Medium | A SaaS product should know that Author X is an expert on Topic Y, and flag when content is attributed to the wrong expert. |
| Experience scoring is surface-level | 🟡 Medium | Checking for `/we've|in our experience/` detects AI-generated experience language — the opposite of what Google wants. |

### Content Score (`content-score/route.ts`)

**Strengths:**
- Composite scoring: 50% AI Visibility + 25% E-E-A-T + 25% AIO
- Tracks word count, readability, links, schema presence
- Historical tracking via `ContentScore` table

**Problems:**
- No benchmark comparison (what's a "good" score for this industry/page type?)
- No competitor comparison (how does this score vs. the current #1 ranking page?)
- Readability score is a crude proxy (sentence length / 2)
- Should integrate Flesch-Kincaid or similar proper readability algorithm

---

## 8. Blog Writer / Content Pipeline Critique

### Current Flow
1. User picks topic + keyword (with DB-backed keyword suggestions)
2. AI generates outline via Claude
3. AI generates full draft via Claude
4. Structured block editor for editing
5. Preview, then publish

### What's Good
- AI-first writing instructions are well-crafted
- Outline → Draft → Edit flow is intuitive
- Structured block editor with drag-and-drop
- Auto-scoring during edit phase
- Internal link suggestions from site page inventory

### Critical Gaps

#### Gap 1: No Genuine Expertise Injection
The AI generates content that sounds expert but contains no real proprietary data. Google's guidance is clear: AI content is fine if it demonstrates real expertise.

**Needed:** An "Evidence Library" that injects:
- Real client metrics ("We reduced downtime by 73% for a 50-person law firm")
- Actual pricing data from the business
- Real testimonials/quotes
- Company-specific processes and methodologies
- Local market data

The blog writer should pull from this library during generation, and the prompt should instruct Claude to weave in specific evidence, not generic claims.

#### Gap 2: No Human-in-the-Loop Expertise Flag
Google asks "Who created this content?" The system should:
- Track which posts were AI-generated vs. human-written vs. AI-assisted
- Require human review before publish (at minimum an "I reviewed this" checkbox)
- Store the reviewer's identity
- Support AI disclosure configuration per site

#### Gap 3: No Content Briefs
Before generating, a SaaS tool should produce a "content brief":
- Target keyword + secondary keywords
- Competitor analysis (what do the top 5 articles cover?)
- Suggested word count based on competitor average
- Required sections based on topic gaps
- Internal link targets
- Source citations to include
- Author assignment

#### Gap 4: No Post-Publish Monitoring
After publishing, the system doesn't track:
- Whether the post started ranking
- Whether it got indexed (IndexNow exists but no verification)
- Whether AI platforms cite it
- Whether traffic/conversions came from it
- Content decay over time

---

## 9. Missing Features for a Real SaaS Product

### Must-Have for MVP Launch

| Feature | Current | Needed |
|---------|---------|--------|
| **Subscription billing** | None | Stripe integration, plan tiers, usage limits |
| **User invitation flow** | None | Invite team members, assign roles per site |
| **GSC OAuth flow** | Env vars only | In-app OAuth consent + token storage |
| **Scheduled jobs** | None | Cron for snapshots, crawls, reports |
| **Author management** | Hardcoded | Per-site author CRUD with credentials |
| **Industry configuration** | MSP-specific | Configurable credential types, geographic terms, entity relationships |
| **Onboarding completion** | Partial | Guided setup checklist (connect GSC, add keywords, first crawl, first blog post) |
| **Error handling** | Silent catches | User-facing error messages, retry logic, health checks |
| **Mobile responsiveness** | Unknown | Dashboard must work on tablet/mobile |

### Should-Have for Competitive SaaS

| Feature | Impact |
|---------|--------|
| **Topic cluster builder** | Core differentiation — AI-powered topic map generation |
| **AI citation monitor** | Validates the entire "AI Visibility" thesis |
| **Content brief generator** | Essential for content strategy at scale |
| **Structured data generator** | FAQPage, HowTo, Article, Organization auto-generation |
| **Competitive content analysis** | Content gap, SERP feature tracking, competitor scoring |
| **White-label / custom domains** | Agency market requirement |
| **API + webhooks** | Integration with other tools |
| **Content calendar** | Visual calendar view with scheduling |
| **Bulk operations** | Score all pages, crawl all pages, update all keywords |
| **Export / reporting** | PDF reports, CSV exports, white-label email reports |

### Nice-to-Have / Differentiators

| Feature | Impact |
|---------|--------|
| **Real-time SERP tracker** | Position tracking without GSC delay |
| **AI content detector** | Help users balance AI vs. human content ratio |
| **Schema validation tool** | Test/preview structured data before publishing |
| **Content A/B testing** | Test title/meta variations |
| **Video content suggestions** | Google AIO increasingly cites video |
| **Multilingual support** | International SEO |

---

## 10. Prioritized Roadmap

### Phase 5: E-E-A-T Foundation (Next)

> **Goal:** Make the system's E-E-A-T scoring genuine, not pattern-matching theater.

1. **Author entity system** — `Author` model, per-site CRUD UI, Person schema generation
2. **Experience evidence library** — `ExperienceEvidence` model for case studies, metrics, testimonials
3. **Industry configuration** — Move credential types, geographic terms, entity relationships into site-specific config
4. **De-hardcode SeedTech** — Replace all hardcoded SeedTech references with site-context-driven values
5. **AI disclosure system** — Configurable per-site, auto-inserted in AI-generated content
6. **Content authorship tracking** — Track human vs. AI origin, reviewer identity

### Phase 6: Topic Authority Engine

> **Goal:** Make topic clusters the core strategic tool.

1. **Topic cluster UI** — Visualize pillar → spoke content maps
2. **AI cluster generator** — Given a seed topic, auto-generate a full topic map with keywords
3. **Cluster gap analysis** — Which subtopics have no content?
4. **Cluster authority scoring** — Combine keyword coverage + content depth + internal linking
5. **Internal link enforcer** — Ensure every cluster page links to pillar and siblings

### Phase 7: AI Citation Intelligence

> **Goal:** Validate the "AI Visibility" thesis with real data.

1. **Automated citation checker** — Query Perplexity API + scrape Google AIO for brand mentions
2. **Citation trend dashboard** — Track brand mention rates over time per platform
3. **Citation-to-score correlation** — Validate which scoring dimensions actually predict citations
4. **Competitor citation comparison** — How often are competitors cited vs. us?

### Phase 8: SaaS Productization

> **Goal:** Ship to paying customers.

1. **Subscription system** — Stripe billing, plan tiers, usage metering
2. **User management** — Invitation flow, role assignment, multi-tenant admin
3. **GSC OAuth flow** — In-app consent, token storage, automatic data pulls
4. **Scheduled jobs** — Cron for snapshots, crawls, insights, reports
5. **Onboarding wizard v2** — Connect integrations, guided first crawl + first post
6. **API keys + rate limiting** — For external integrations
7. **White-label / agency features** — Custom branding, client dashboards

### Phase 9: Competitive Intelligence

> **Goal:** Know the landscape, not just your own content.

1. **Competitive content analysis** — Score competitor content with same AI Visibility engine
2. **Content gap analysis** — What topics do competitors cover that you don't?
3. **SERP feature tracking** — Who owns featured snippets, PAA, AIO for your keywords?
4. **Competitive keyword intelligence** — What keywords are competitors ranking for?

### Phase 10: Content Pipeline Maturity

> **Goal:** Full content lifecycle management.

1. **Content briefs** — AI-generated research-backed briefs before writing
2. **Evidence injection** — Auto-weave case studies, metrics, testimonials into AI drafts
3. **Post-publish monitoring** — Index verification, ranking tracking, citation tracking, decay alerts
4. **Content repurposing** — Generate social posts, email excerpts, video scripts from blog posts
5. **Structured data generator** — FAQPage, HowTo, Article, Speakable auto-generation
6. **Content calendar view** — Visual calendar with drag-and-drop scheduling

---

## Summary: The One-Line Diagnosis

**The system is a well-built content creation and auditing tool that talks the language of 2026 AI-first SEO, but it doesn't yet practice what it preaches — it scores content for AI citation readiness without measuring actual citations, checks for E-E-A-T signals without modeling real expertise, and generates AI content without injecting genuine experience.**

The foundation is strong. The multi-tenant architecture is solid. The scoring rubrics are thoughtfully designed. The path forward is:
1. Make E-E-A-T real (authors, evidence, credentials — not regex)
2. Measure what matters (actual AI citations, not heuristic scores)
3. Build topic authority tooling (clusters, gaps, internal linking)
4. Productize (billing, onboarding, integrations, scheduling)

The system is approximately **40% of the way to a shippable SaaS product** and **60% of the way on SEO feature depth**. The next highest-leverage work is Phase 5 (E-E-A-T Foundation) because it fixes the credibility gap between what the tool claims and what it actually delivers.
