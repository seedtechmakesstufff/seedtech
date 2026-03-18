# SeedTech SEO Autopilot — Product & Deployment Guide# SeedTech SEO Autopilot — Product & Deployment Guide



> **Internal document** — Defines the SEO automation platform SeedTech has built, how it works, how to deploy it per-customer, and how to position it as a service add-on.> **Internal document** — Defines the SEO automation platform SeedTech has built, how it works, how to deploy it per-customer, and how to position it as a service add-on.



------



## 1. Executive Summary## 1. Executive Summary



SeedTech has built a fully integrated, AI-powered SEO management system that runs inside every Next.js website we build. It is **not** a third-party plugin or a SaaS subscription the customer buys — it is a proprietary backend built into the site itself.SeedTech has built a fully integrated, AI-powered SEO management system that runs inside every Next.js website we build. It is **not** a third-party plugin or a SaaS subscription the customer buys — it is a proprietary backend built into the site itself.



This system gives customers a self-service SEO command center inside their admin panel, powered by:This system gives customers a self-service SEO command center inside their admin panel, powered by:

- **Live Google Search Console data** — real keyword rankings, click data, page performance- **Live Google Search Console data** — real keyword rankings, click data, page performance

- **Google PageSpeed Insights** — Core Web Vitals, performance scores, actionable optimization opportunities- **Google PageSpeed Insights** — Core Web Vitals, performance scores, actionable optimization opportunities

- **IndexNow instant indexing** — ping Bing, Yandex, and other search engines the moment content is published or updated- **IndexNow instant indexing** — ping Bing, Yandex, and other search engines the moment content is published or updated

- **Auto-IndexNow on blog publish** — when a blog post goes live or content is updated, search engines are pinged automatically- **AI SEO Advisor (Claude)** — on-demand strategic analysis that combines all live data with the customer's business context to produce specific, prioritized recommendations

- **AI SEO Advisor (Claude)** — on-demand strategic analysis that combines all live data with the customer's business context to produce specific, prioritized recommendations- **AI Blog Writer (Claude)** — a guided wizard that generates full SEO-optimized blog posts targeting specific keywords, with proper internal linking and metadata

- **AI Blog Writer (Claude)** — a guided wizard that generates full SEO-optimized blog posts targeting specific keywords, with proper internal linking and metadata- **Tracked Keyword Strategy** — tiered keyword list with volumes, competition, intent, and target pages — monitored against live GSC positions

- **SEO Health Snapshots** — automated weekly scoring (GSC + PageSpeed) with historical trends- **Content Calendar** — blog pipeline with keyword targets, word counts, funnel stages, and publication status

- **On-Page Crawler** — server-side HTML auditor checking titles, meta, headings, images, links, word count, and more across all key pages- **Editable Business Context** — customers can update their company profile, tone of voice, and custom instructions that feed into every AI-generated output

- **AI Insights Engine** — detects stale content, keyword cannibalization, internal linking gaps, and keyword opportunities

- **AI Keyword Discovery** — Claude-powered research generating new keyword opportunities from your existing data### What makes this different

- **Weekly Email Reports** — automated digest with health score trends, keyword movers, critical issues, and AI recommendationsThis isn't "we'll do your SEO for you" — this is **"we built the tool that does your SEO, and it lives inside your website."** The customer has full visibility and control. The AI does the analysis and content generation. SeedTech provides the infrastructure, setup, and ongoing support.

- **JSON-LD Structured Data** — LocalBusiness, Service, Article, FAQ, and Breadcrumb schema automatically injected into pages

- **Tracked Keyword Strategy** — tiered keyword list with volumes, competition, intent, and target pages — monitored against live GSC positions---

- **Content Calendar** — blog pipeline with keyword targets, word counts, funnel stages, and publication status

- **Editable Business Context** — customers can update their company profile, tone of voice, and custom instructions that feed into every AI-generated output## 2. Complete Capabilities Inventory



### What makes this different### 2.1 Google Search Console Integration

This isn't "we'll do your SEO for you" — this is **"we built the tool that does your SEO, and it lives inside your website."** The customer has full visibility and control. The AI does the analysis and content generation. SeedTech provides the infrastructure, setup, and ongoing support.**File:** `src/lib/google-search-console.ts`  

**API Route:** `GET /api/admin/seo/search-console`

---

| Capability | Description |

## 2. Complete Capabilities Inventory|---|---|

| Connection test | Verify service account access to the customer's GSC property |

### 2.1 Google Search Console Integration| Keyword performance | Top 100 keywords with clicks, impressions, CTR, and average position (configurable date range) |

**File:** `src/lib/google-search-console.ts`  | Page performance | Top 50 pages with clicks, impressions, CTR, and position |

**API Route:** `GET /api/admin/seo/search-console`| Full summary | Aggregated overview — total clicks, total impressions, avg CTR, avg position, top keywords, top pages |

| Tracked keyword positions | Cross-reference the customer's target keyword list against real GSC data to show actual ranking positions |

| Capability | Description || Site listing | List all properties the service account has access to (useful for debugging) |

|---|---|

| Connection test | Verify service account access to the customer's GSC property |**Auth method:** Google Service Account (JWT) with `webmasters.readonly` scope.

| Keyword performance | Top 100 keywords with clicks, impressions, CTR, and average position (configurable date range) |

| Page performance | Top 50 pages with clicks, impressions, CTR, and position |### 2.2 PageSpeed Insights

| Full summary | Aggregated overview — total clicks, total impressions, avg CTR, avg position, top keywords, top pages |**File:** `src/lib/pagespeed.ts`  

| Tracked keyword positions | Cross-reference the customer's target keyword list against real GSC data to show actual ranking positions |**API Route:** `GET /api/admin/seo/pagespeed`

| Site listing | List all properties the service account has access to (useful for debugging) |

| Capability | Description |

**Auth method:** Google Service Account (JWT) with `webmasters.readonly` scope.|---|---|

| Single URL analysis | Performance, Accessibility, Best Practices, and SEO scores + Core Web Vitals (LCP, CLS, FCP, TBT, TTI, Speed Index) |

### 2.2 PageSpeed Insights| Multi-page site audit | Audit up to N key pages at once — returns per-page scores and site-wide averages |

**File:** `src/lib/pagespeed.ts`  | Optimization opportunities | Ranked list of specific improvements with estimated time savings in milliseconds |

**API Route:** `GET /api/admin/seo/pagespeed`| Strategy toggle | Mobile or desktop analysis |



| Capability | Description |**Auth method:** Public API (free), optional `PAGESPEED_API_KEY` for higher rate limits.

|---|---|

| Single URL analysis | Performance, Accessibility, Best Practices, and SEO scores + Core Web Vitals (LCP, CLS, FCP, TBT, TTI, Speed Index) |### 2.3 IndexNow Instant Indexing

| Multi-page site audit | Audit up to N key pages at once — returns per-page scores and site-wide averages |**File:** `src/lib/indexnow.ts`  

| Optimization opportunities | Ranked list of specific improvements with estimated time savings in milliseconds |**API Route:** `POST /api/admin/seo/indexnow`

| Strategy toggle | Mobile or desktop analysis |

| Capability | Description |

**Auth method:** Public API (free), optional `PAGESPEED_API_KEY` for higher rate limits.|---|---|

| Single URL submission | Notify Bing + IndexNow consortium that a specific URL has been created/updated |

### 2.3 IndexNow Instant Indexing| Batch URL submission | Submit multiple URLs at once (e.g., after a sitemap update or blog publishing session) |

**File:** `src/lib/indexnow.ts`  | Dual endpoint ping | Submits to both `api.indexnow.org` and `bing.com/indexnow` for maximum coverage |

**API Route:** `POST /api/admin/seo/indexnow`  | Configuration check | `GET` endpoint returns whether IndexNow is properly configured |

**Auto-trigger:** `src/app/api/blog/[id]/route.ts` (on PUT)

**Auth method:** Self-generated API key served as a `.txt` file at the site root.

| Capability | Description |

|---|---|### 2.4 AI SEO Advisor

| Single URL submission | Notify Bing + IndexNow consortium that a specific URL has been created/updated |**File:** `src/app/api/admin/seo/ai-advisor/route.ts`  

| Batch URL submission | Submit multiple URLs at once (e.g., after a sitemap update or blog publishing session) |**API Route:** `POST /api/admin/seo/ai-advisor`

| Dual endpoint ping | Submits to both `api.indexnow.org` and `bing.com/indexnow` for maximum coverage |

| Configuration check | `GET` endpoint returns whether IndexNow is properly configured || Capability | Description |

| **Auto-ping on blog publish** | When a blog post status changes to "published" or content is updated on a published post, IndexNow is automatically pinged — no manual action needed ||---|---|

| Full analysis | Executive summary, top 3 priorities, keyword opportunities, content gaps, technical issues, competitive insights |

**Auth method:** Self-generated API key served as a `.txt` file at the site root.| Custom questions | Ask specific SEO questions — "How do I rank for [keyword]?", "What should my next blog post be about?" |

| Data fusion | Combines GSC live data + PageSpeed data + keyword strategy + content calendar + business context into a single analysis prompt |

### 2.4 AI SEO Advisor| Actionable output | References real numbers, real keywords, real pages — not generic advice |

**File:** `src/app/api/admin/seo/ai-advisor/route.ts`  

**API Route:** `POST /api/admin/seo/ai-advisor`**AI model:** Claude (Anthropic) via `CLAUDE_API_KEY`.



| Capability | Description |### 2.5 AI Blog Writer

|---|---|**File:** `src/app/api/ai/generate-blog/route.ts`  

| Full analysis | Executive summary, top 3 priorities, keyword opportunities, content gaps, technical issues, competitive insights |**Admin UI:** `src/app/admin/blog/new/page.tsx`

| Custom questions | Ask specific SEO questions — "How do I rank for [keyword]?", "What should my next blog post be about?" |

| Data fusion | Combines GSC live data + PageSpeed data + keyword strategy + content calendar + business context into a single analysis prompt || Capability | Description |

| Actionable output | References real numbers, real keywords, real pages — not generic advice ||---|---|

| Outline generation | Takes topic + keyword → produces structured outline with headings, key points, word count estimates, slug, excerpt, meta tags, internal links, categories, and tags |

**AI model:** Claude (Anthropic) via `CLAUDE_API_KEY`.| Full draft generation | Takes approved outline → produces complete Markdown blog post with proper SEO keyword placement (3-5 natural mentions), internal links, H2/H3 structure, and CTA |

| Meta generation | Generates optimized meta title (< 60 chars) and meta description (< 160 chars) |

### 2.5 AI Blog Writer| Business context injection | Every generation uses the customer's editable business profile, tone of voice, and keyword strategy |

**File:** `src/app/api/ai/generate-blog/route.ts`  | Content calendar integration | Pulls from the tracked keyword list and content calendar to inform topic suggestions |

**Admin UI:** `src/app/admin/blog/new/page.tsx`

### 2.6 Admin Dashboard

| Capability | Description |**File:** `src/app/admin/seo/page.tsx`

|---|---|

| Outline generation | Takes topic + keyword → produces structured outline with headings, key points, word count estimates, slug, excerpt, meta tags, internal links, categories, and tags || Panel | Description |

| Full draft generation | Takes approved outline → produces complete Markdown blog post with proper SEO keyword placement (3-5 natural mentions), internal links, H2/H3 structure, and CTA ||---|---|

| Meta generation | Generates optimized meta title (< 60 chars) and meta description (< 160 chars) || Strategy score cards | Tracked keyword count (by tier), task completion %, content calendar progress, avg keyword position (live from GSC) |

| Business context injection | Every generation uses the customer's editable business profile, tone of voice, and keyword strategy || Search Console overview | Top 10 keywords + top 8 pages with clicks, impressions, CTR, and position — refreshable live |

| Content calendar integration | Pulls from the tracked keyword list and content calendar to inform topic suggestions || Keyword tracking table | Full keyword list with tier, volume, competition, intent, target page, and live position from GSC |

| PageSpeed audit panel | Run on-demand mobile/desktop audits — shows per-page scores for Performance, Accessibility, SEO, plus Core Web Vitals |

### 2.6 SEO Health Snapshots| Implementation roadmap | Phased SEO task list with status tracking (done / in-progress / not-started) and priority flags |

**File:** `src/lib/seo-snapshot.ts`  | Content calendar | Blog pipeline with keyword targets, word counts, funnel stages, and publication status |

**API Route:** `GET|POST /api/admin/seo/snapshot`| AI SEO Advisor | Chat interface — run full analysis or ask specific questions, with quick-prompt suggestions |

| IndexNow button | One-click batch submission of key URLs to search engines |

| Capability | Description || Business Context modal | Edit company profile, tagline, services, tone of voice, and custom AI instructions |

|---|---|

| Health score calculation | Weighted composite: 40% PageSpeed performance, 20% PageSpeed SEO, 30% avg position, 10% CTR |### 2.7 Editable Business Context

| Snapshot capture | Stores GSC metrics (clicks, impressions, CTR, position) + PageSpeed scores + keyword positions in the database |**File:** `src/lib/business-context.ts`  

| Historical trends | Retrieve N most recent snapshots for sparklines and trend charts |**Storage:** `content/business-context.json`

| Keyword position tracking | Per-keyword position history across snapshots to detect ranking changes |

| Automated via cron | Weekly snapshots taken automatically via the `/api/cron/seo` endpoint |The business context is the "personality file" that feeds every AI output. It includes:

- Company name, tagline, location, domain

**Storage:** `SeoSnapshot` Prisma model (Neon PostgreSQL).- Primary and secondary services

- Target audience

### 2.7 On-Page Crawler- Unique selling points

**File:** `src/lib/seo-crawler.ts`  - Tone of voice

**API Route:** `GET|POST /api/admin/seo/crawl`- Custom instructions (e.g., "always link back to /pricing", "never mention competitor X")



| Capability | Description |This is editable from the admin dashboard via a modal — changes take effect immediately on the next AI generation.

|---|---|

| Server-side HTML audit | Fetches each page server-side using `jsdom` and inspects the real DOM |---

| 15 default audit paths | Homepage, services, industries, blog, pricing, about, contact, and more |

| Checks per page | Title tag (length, presence), meta description (length, presence), H1 count, image alt text, internal/external link counts, word count, canonical URL, Open Graph tags |## 3. Technical Architecture

| Severity classification | Each issue flagged as `critical`, `warning`, `info`, or `pass` |

| Batch processing | Crawls in batches of 3 to avoid overloading the server |```

| On-demand or automated | Run manually from the dashboard or automatically via the weekly cron |┌─────────────────────────────────────────────────┐

│                  Admin Dashboard                 │

**Storage:** `SeoPageAudit` Prisma model.│           /admin/seo  +  /admin/blog            │

├──────────┬──────────┬──────────┬────────────────┤

### 2.8 AI Insights Engine│  GSC     │ PageSpeed│ IndexNow │  AI Advisor    │

**File:** `src/lib/seo-insights.ts`  │  Panel   │  Panel   │  Button  │  + Blog Writer │

**API Route:** `GET|POST /api/admin/seo/insights`└────┬─────┴────┬─────┴────┬─────┴───────┬────────┘

     │          │          │             │

| Capability | Description |     ▼          ▼          ▼             ▼

|---|---|┌──────────┐ ┌────────┐ ┌────────┐ ┌───────────┐

| Stale content detection | Flags pages not updated in 90+ days that are losing rankings |│ GSC API  │ │ PSI API│ │IndexNow│ │Claude API │

| Keyword cannibalization | Identifies multiple pages competing for the same keyword |│ (Google) │ │(Google)│ │ (Bing) │ │(Anthropic)│

| Internal linking gaps | Finds pages with zero or very few internal links pointing to them |└──────────┘ └────────┘ └────────┘ └───────────┘

| AI keyword discovery | Claude-powered analysis of existing GSC data to suggest new keyword opportunities |     ▲                                    ▲

| Insight lifecycle | Each insight can be marked as active, dismissed, or resolved |     │                                    │

| Priority scoring | Insights ranked by impact (1-10) for triage |     └──── business-context.json ─────────┘

           seo-strategy.ts (keywords, tasks, calendar)

**Storage:** `SeoInsight` Prisma model.```



### 2.9 AI Keyword Discovery### Stack

**File:** `src/lib/seo-insights.ts` → `discoverKeywords()`  - **Framework:** Next.js 14 (App Router, Server Components)

**API Route:** `POST /api/admin/seo/keyword-discovery`- **Auth:** NextAuth.js — admin routes are session-gated

- **AI:** Claude (Anthropic API) — `claude-opus-4-6`

| Capability | Description |- **Google APIs:** `googleapis` npm package (Search Console), PageSpeed REST API

|---|---|- **Database:** Neon PostgreSQL + Prisma 7 (blog posts, settings)

| Data-driven discovery | Feeds Claude your current GSC keywords, pages, and business context |- **Hosting:** Vercel (recommended) or any Node.js host

| Structured output | Returns keyword, estimated volume, difficulty, intent, and suggested target page |

| Stored as insights | Each discovered keyword is saved as an `InsightType.keyword_opportunity` for tracking |---



### 2.10 Weekly Email Reports## 4. Per-Customer Deployment Guide

**File:** `src/lib/seo-reports.ts`  

**API Route:** `GET|POST /api/admin/seo/reports`  ### 4.1 Environment Variables Required

**Cron Route:** `GET /api/cron/seo`

Each customer deployment needs these environment variables configured:

| Capability | Description |

|---|---|```env

| Auto-build report data | Aggregates latest snapshot, keyword trends, insights, and crawl results |# ── Google Search Console ──

| HTML email template | Professional branded email with health score, keyword movers, critical issues, and top insights |GOOGLE_SERVICE_ACCOUNT_EMAIL=seo@customer-project.iam.gserviceaccount.com

| Send via Resend API | One-click send or automated via cron (requires `RESEND_API_KEY`) |GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"..."}

| Preview mode | View the HTML report in the dashboard without sending |GOOGLE_SEARCH_CONSOLE_SITE=sc-domain:customerdomain.com

| Weekly automation | Vercel Cron runs every Monday at 6 AM UTC — snapshot + crawl + insights + email |# Can also be https://customerdomain.com



### 2.11 JSON-LD Structured Data# ── AI (Claude) ──

**File:** `src/components/JsonLd.tsx`CLAUDE_API_KEY=sk-ant-...



| Schema Type | Where Used |# ── IndexNow ──

|---|---|INDEXNOW_API_KEY=a-random-string-you-generate

| `LocalBusinessJsonLd` | Homepage — company name, phone, email, area served |# Also serve https://customerdomain.com/{INDEXNOW_API_KEY}.txt

| `ServiceJsonLd` | Service pages (web-dev) + all industry pages (trucking, construction, law-firms, medical) |

| `ArticleJsonLd` | Blog post pages — title, author, dates, URL |# ── PageSpeed (optional — increases rate limits) ──

| `BreadcrumbJsonLd` | Blog posts, service pages, industry pages |PAGESPEED_API_KEY=AIzaSy...

| `FAQJsonLd` | Available for any page with FAQ sections |

# ── Auth ──

Schema is injected as `<script type="application/ld+json">` in the page head. Managed-IT service page has its own expanded inline schema with pricing.NEXTAUTH_SECRET=random-secret

NEXTAUTH_URL=https://customerdomain.com

### 2.12 Dynamic Sitemap & Robots```

**Files:** `src/app/sitemap.ts`, `src/app/robots.ts`

### 4.2 Google Search Console Setup (Per Customer)

| Feature | Description |

|---|---|1. **Create a GCP project** (or reuse SeedTech's central project)

| Dynamic sitemap | 22 static routes + all published blog posts with `lastModified` dates |2. **Create a service account** — name it something like `seo-bot@project.iam.gserviceaccount.com`

| Robots.txt | Allows all crawlers, blocks `/admin/`, `/api/`, `/design-kit` |3. **Generate a JSON key** for the service account

| Sitemap reference | Robots.txt points to the dynamic sitemap URL |4. **Add the service account as a user** in the customer's Google Search Console property (Settings → Users and permissions → Add user → Full access)

5. **Verify the property** in GSC if not already (DNS TXT record or HTML file method)

### 2.13 Admin Dashboard (5-Tab SEO Command Center)6. **Set the env vars** — paste the full JSON key or just the private_key PEM string

**File:** `src/app/admin/seo/page.tsx`

### 4.3 IndexNow Setup (Per Customer)

| Tab | Description |

|---|---|1. **Generate a random API key** — any alphanumeric string (e.g., `a1b2c3d4e5f6`)

| **Overview** | Health score gauge, GSC metrics cards, snapshot sparklines, quick-action buttons |2. **Create the verification file** — `public/{INDEXNOW_API_KEY}.txt` containing just the API key string

| **Keywords** | Full keyword tracking table with tier, volume, competition, intent, target page, live position from GSC, and position change indicators |3. **Set the env var** — `INDEXNOW_API_KEY=a1b2c3d4e5f6`

| **Audit** | On-page crawl results — per-page issue breakdown with severity badges, expandable details, one-click re-crawl |4. IndexNow will verify ownership by fetching `https://customerdomain.com/{key}.txt`

| **Insights** | AI-generated insights feed — stale content, cannibalization, linking gaps, keyword opportunities — with dismiss/resolve actions |

| **Strategy** | Implementation roadmap with task tracking, content calendar, AI advisor chat interface, IndexNow button, keyword discovery |### 4.4 SEO Strategy Customization (Per Customer)



### 2.14 Editable Business ContextThe file `src/data/seo-strategy.ts` must be customized per customer:

**File:** `src/lib/business-context.ts`  

**Storage:** `content/business-context.json`1. **TRACKED_KEYWORDS** — Research and define tiered keywords specific to the customer's industry, location, and services

   - Tier 1: Primary money keywords (highest intent, highest value)

The business context is the "personality file" that feeds every AI output. It includes:   - Tier 2: Secondary commercial keywords (supporting pages)

- Company name, tagline, location, domain   - Tier 3: Long-tail / informational keywords (blog targets)

- Primary and secondary services2. **SEO_TASKS** — Customize the implementation roadmap based on where the customer is starting from

- Target audience3. **CONTENT_CALENDAR** — Plan initial blog posts targeting Tier 3 keywords

- Unique selling points

- Tone of voice### 4.5 Business Context Customization

- Custom instructions (e.g., "always link back to /pricing", "never mention competitor X")

Edit `content/business-context.json` or use the admin dashboard modal:

This is editable from the admin dashboard via a modal — changes take effect immediately on the next AI generation.- Company name, tagline, domain

- Primary and secondary services

---- Target audience (geography, company size, industry)

- Unique selling points

## 3. Technical Architecture- Tone of voice

- Custom AI instructions

```

┌───────────────────────────────────────────────────────────┐### 4.6 Blog Infrastructure

│                     Admin Dashboard                        │

│      /admin/seo (5 tabs)  +  /admin/blog (writer)        │The blog system stores posts in the Neon PostgreSQL database via Prisma. Per customer:

├────────┬─────────┬────────┬──────────┬────────┬──────────┤1. Run Prisma migrations to create blog tables

│  GSC   │PageSpeed│IndexNow│ Snapshot │ Crawler│ Insights │2. Configure the admin user (NextAuth)

│ Panel  │ Panel   │ Button │ + Trends │ Audit  │ + KW Disc│3. The AI blog writer is immediately available from the dashboard

└───┬────┴───┬─────┴───┬────┴────┬─────┴───┬────┴────┬─────┘

    │        │         │         │         │         │---

    ▼        ▼         ▼         ▼         ▼         ▼

┌───────┐┌───────┐┌────────┐┌────────┐┌────────┐┌────────┐## 5. Customer Value Proposition

│GSC API││PSI API││IndexNow││Neon DB ││ jsdom  ││Claude  │

│(Google)││(Google)││ (Bing) ││(Prisma)││(crawl) ││(AI)    │### What the customer gets

└───────┘└───────┘└────────┘└────────┘└────────┘└────────┘

    ▲                                               ▲| Capability | Without SeedTech SEO Autopilot | With SeedTech SEO Autopilot |

    └──── business-context.json ────────────────────┘|---|---|---|

          seo-strategy.ts (keywords, tasks, calendar)| **Keyword tracking** | Pay $100–300/mo for Ahrefs, SEMrush, or Moz | Built into your dashboard — free, live data from Google |

| **SEO audits** | Hire an agency for $500–2,000/audit | One-click audit from your admin panel, anytime |

  ┌──────────────────────────────────────────────────────┐| **Content creation** | Pay $200–500 per blog post from a freelancer | AI-generated, SEO-optimized posts in minutes |

  │              Automated Pipeline (Cron)                │| **Technical SEO monitoring** | Requires an SEO specialist ($3–5k/mo retainer) | PageSpeed, Core Web Vitals, and indexing monitored from one panel |

  │  /api/cron/seo → snapshot → crawl → insights → email │| **Strategic recommendations** | Quarterly agency reports (if you're lucky) | On-demand AI analysis using YOUR real data, not generic advice |

  │  Runs weekly via Vercel Cron (Monday 6 AM UTC)       │| **Search engine notifications** | Manual sitemap submissions, wait for crawlers | Instant IndexNow pings — search engines know about new content in seconds |

  └──────────────────────────────────────────────────────┘| **Business context control** | Agency may not understand your business deeply | You control the AI's understanding of your company — editable anytime |



  ┌──────────────────────────────────────────────────────┐### How to talk about it

  │             Auto-IndexNow on Blog Publish             │

  │  PUT /api/blog/[id] → detect publish → ping engines  │> "Every SeedTech website comes with a built-in SEO command center. You get live keyword rankings from Google, automated performance audits, an AI advisor that actually knows your business, and a blog writer that produces SEO-optimized content in minutes — not weeks. No extra subscriptions. No agency retainers. It's all built into your site."

  └──────────────────────────────────────────────────────┘

```### Customer-facing feature bullets



### Stack- **Live Keyword Rankings** — See exactly where you rank on Google for every keyword that matters to your business, updated in real time from Search Console.

- **Framework:** Next.js 14 (App Router, Server Components)- **One-Click Performance Audits** — Run PageSpeed and Core Web Vitals audits on any page, anytime. Know exactly what's fast, what's slow, and what to fix.

- **Auth:** NextAuth.js — all admin API routes session-gated- **AI SEO Advisor** — Ask any SEO question and get specific, data-backed answers using your real rankings, traffic data, and business context.

- **AI:** Claude (Anthropic API) — `claude-sonnet-4-20250514`- **AI Blog Writer** — Generate full, SEO-optimized blog posts from a keyword. Outlines, drafts, and metadata — all in one guided workflow.

- **Google APIs:** `googleapis` npm package (Search Console), PageSpeed REST API- **Instant Search Engine Indexing** — New blog post? Updated service page? One click notifies Bing, Yandex, and others instantly via IndexNow.

- **Database:** Neon PostgreSQL + Prisma 7 (blog posts, SEO snapshots, audits, insights)- **Content Strategy Dashboard** — Tracked keywords, content calendar, implementation roadmap, and progress tracking — all in one place.

- **HTML Parsing:** `jsdom` (server-side on-page crawler)- **Your Business, Your Voice** — The AI knows your company, your services, your audience, and your tone. You control it.

- **Email:** Resend API (weekly reports)

- **Hosting:** Vercel (recommended) or any Node.js host---

- **Cron:** Vercel Cron (configured in `vercel.json`)

## 6. Business & Pricing Context

### Database Models (Prisma)

### Cost structure (SeedTech internal)

| Model | Table | Purpose |

|---|---|---|| Component | Per-Customer Cost |

| `BlogPost` | `blog_posts` | Blog content, metadata, status, scheduling ||---|---|

| `SeoSnapshot` | `seo_snapshots` | Weekly health scores, GSC metrics, keyword positions || Google Search Console API | Free (Google service account) |

| `SeoPageAudit` | `seo_page_audits` | Per-page crawl results with issue details || PageSpeed Insights API | Free (rate-limited, optional paid key) |

| `SeoInsight` | `seo_insights` | AI-generated insights with type, priority, status || IndexNow | Free |

| Claude API (AI Advisor + Blog Writer) | ~$0.01–0.05 per analysis, ~$0.05–0.15 per blog post |

---| Infrastructure (Vercel, Neon) | Already included in hosting |



## 4. Per-Customer Deployment Guide**Marginal cost per customer: near zero.** The expensive part was building the tool. Deploying it to each customer is a configuration exercise.



### 4.1 Environment Variables Required### Pricing models to consider



Each customer deployment needs these environment variables configured:1. **Included in web development package** — Position it as a differentiator. "Every site we build includes our SEO Autopilot system." Justifies premium pricing on the web build itself.



```env2. **Monthly managed SEO add-on ($200–500/mo)** — For customers who want SeedTech to actively manage the tool — running analyses, publishing blog content, adjusting keyword strategy.

# ── Google Search Console ──

GOOGLE_SERVICE_ACCOUNT_EMAIL=seo@customer-project.iam.gserviceaccount.com3. **Self-service tier (included) + managed tier (add-on)** — Give them the dashboard and AI tools for free with the site build. Charge monthly for hands-on SEO management and content production.

GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"..."}

GOOGLE_SEARCH_CONSOLE_SITE=sc-domain:customerdomain.com4. **Per-blog-post pricing ($50–100/post)** — For customers who don't want a monthly retainer but want occasional AI-assisted content. The AI does 90% of the work; SeedTech reviews and publishes.

# Can also be https://customerdomain.com

### Competitive advantage

# ── AI (Claude) ──

CLAUDE_API_KEY=sk-ant-...Most MSPs and web agencies don't offer anything like this. The typical competitor:

- Builds a WordPress site with Yoast SEO (a plugin that tells you your meta description is too long)

# ── IndexNow ──- Offers "SEO services" that are really just a monthly retainer for someone to write 2 blog posts

INDEXNOW_API_KEY=a-random-string-you-generate- Uses third-party tools (Ahrefs, SEMrush) that the customer never sees

# Also serve https://customerdomain.com/{INDEXNOW_API_KEY}.txt- Delivers quarterly PDF reports that nobody reads



# ── PageSpeed (optional — increases rate limits) ──SeedTech's approach:

PAGESPEED_API_KEY=AIzaSy...- The tool is **built into the product** — not bolted on

- The customer **owns the dashboard** — full transparency

# ── Email Reports (optional — enables weekly email digest) ──- The AI **actually knows their business** — not generic templates

RESEND_API_KEY=re_...- Content generation is **minutes, not weeks**

REPORT_FROM_EMAIL=seo@customerdomain.com- Real Google data, not estimates from third-party scrapers

REPORT_TO_EMAIL=admin@customerdomain.com

---

# ── Cron Authentication ──

CRON_SECRET=a-long-random-secret-for-cron-auth## 7. Per-Industry Deployment Notes



# ── Auth ──### Law Firms

NEXTAUTH_SECRET=random-secret- **Keywords:** Practice area + location combinations ("personal injury lawyer NJ", "family law attorney Hopatcong")

NEXTAUTH_URL=https://customerdomain.com- **Content strategy:** Case result summaries, legal guides, FAQ-style posts answering common legal questions

- **Business context:** Bar-compliant language, never guarantee outcomes, emphasize credentials and experience

# ── Database ──- **High-value pages:** Practice area pages, attorney profiles, "results" or "case studies" pages

DATABASE_URL=postgresql://...@neon.tech/...?sslmode=require

### Trucking & Logistics

# ── Site URL (used by JSON-LD and reports) ──- **Keywords:** Service type + lane combinations ("flatbed trucking NJ", "LTL freight Northeast"), equipment types, compliance terms

NEXT_PUBLIC_SITE_URL=https://customerdomain.com- **Content strategy:** Industry regulation explainers, equipment guides, safety/compliance content, lane-specific pages

- **Business context:** DOT compliance language, safety record emphasis, fleet capabilities

# ── Google Analytics (optional) ──- **High-value pages:** Service/lane pages, equipment pages, careers/driver recruiting

NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

```### Construction & Trades

- **Keywords:** Service type + location ("commercial roofing NJ", "steel erection contractor"), certifications, project types

### 4.2 Google Search Console Setup (Per Customer)- **Content strategy:** Project galleries with SEO-optimized descriptions, safety/certification content, market-specific pages

- **Business context:** Certifications (OSHA, union affiliations), bonding/insurance, project scale

1. **Create a GCP project** (or reuse SeedTech's central project)- **High-value pages:** Service pages, project gallery, certifications, multi-location pages

2. **Create a service account** — name it something like `seo-bot@project.iam.gserviceaccount.com`

3. **Generate a JSON key** for the service account### Medical Practices

4. **Add the service account as a user** in the customer's Google Search Console property (Settings → Users and permissions → Add user → Full access)- **Keywords:** Specialty + location ("dermatologist Hopatcong NJ", "primary care doctor near me"), procedure/service names

5. **Verify the property** in GSC if not already (DNS TXT record or HTML file method)- **Content strategy:** Patient education content, procedure explainers, provider profiles, health tips

6. **Set the env vars** — paste the full JSON key or just the private_key PEM string- **Business context:** HIPAA-aware language, never diagnose, emphasize credentials and patient experience

- **High-value pages:** Provider profiles, service/procedure pages, patient portal integration, appointment scheduling

### 4.3 IndexNow Setup (Per Customer)

---

1. **Generate a random API key** — any alphanumeric string (e.g., `a1b2c3d4e5f6`)

2. **Create the verification file** — `public/{INDEXNOW_API_KEY}.txt` containing just the API key string## 8. Roadmap & Future Capabilities

3. **Set the env var** — `INDEXNOW_API_KEY=a1b2c3d4e5f6`

4. IndexNow will verify ownership by fetching `https://customerdomain.com/{key}.txt`### Near-term (next 90 days)

5. Blog posts will automatically ping IndexNow on publish — no manual step needed- [ ] **Automated weekly SEO reports** — email digest with ranking changes, traffic trends, and AI recommendations

- [ ] **Blog auto-scheduling** — generate a month of blog posts in one session, auto-publish on schedule

### 4.4 Cron Setup (Per Customer)- [ ] **Competitor tracking** — monitor competitor keyword positions and content gaps

- [ ] **Schema markup automation** — auto-generate JSON-LD structured data for every page type

The `vercel.json` file configures the weekly cron job:

### Medium-term (6 months)

```json- [ ] **Multi-site dashboard** — central SeedTech admin to monitor all customer SEO performance from one view

{- [ ] **Google Business Profile integration** — manage GBP posts, reviews, and Q&A from the admin panel

  "crons": [- [ ] **Backlink monitoring** — track new/lost backlinks using GSC link data

    {- [ ] **AI content refresh** — identify aging content and auto-generate updated versions

      "path": "/api/cron/seo",

      "schedule": "0 6 * * 1"### Long-term

    }- [ ] **White-label mode** — customer sees their own branding on the SEO dashboard

  ]- [ ] **Client-facing reports** — auto-generated PDF reports customers can share with stakeholders

}- [ ] **API access** — let power users integrate SEO data into their own tools

```

---

1. **Set `CRON_SECRET`** — Vercel automatically sends this as an `Authorization: Bearer <secret>` header

2. **Deploy to Vercel** — cron jobs activate automatically on deployment## 9. File Reference

3. The cron runs: snapshot → crawl → insights → email report every Monday at 6 AM UTC

4. **Manual trigger:** `curl -H "Authorization: Bearer $CRON_SECRET" https://customerdomain.com/api/cron/seo`| Purpose | File Path |

|---|---|

### 4.5 Email Report Setup (Per Customer)| Google Search Console lib | `src/lib/google-search-console.ts` |

| PageSpeed Insights lib | `src/lib/pagespeed.ts` |

1. **Create a Resend account** — free tier allows 100 emails/day| IndexNow lib | `src/lib/indexnow.ts` |

2. **Verify the sender domain** in Resend (or use `onboarding@resend.dev` for testing)| Business context lib | `src/lib/business-context.ts` |

3. **Set env vars:** `RESEND_API_KEY`, `REPORT_FROM_EMAIL`, `REPORT_TO_EMAIL`| SEO strategy data | `src/data/seo-strategy.ts` |

4. Reports are sent automatically by the cron job, or manually via the dashboard| GSC API route | `src/app/api/admin/seo/search-console/route.ts` |

| PageSpeed API route | `src/app/api/admin/seo/pagespeed/route.ts` |

### 4.6 SEO Strategy Customization (Per Customer)| IndexNow API route | `src/app/api/admin/seo/indexnow/route.ts` |

| AI Advisor API route | `src/app/api/admin/seo/ai-advisor/route.ts` |

The file `src/data/seo-strategy.ts` must be customized per customer:| AI Blog Writer API route | `src/app/api/ai/generate-blog/route.ts` |

| SEO Dashboard (admin) | `src/app/admin/seo/page.tsx` |

1. **TRACKED_KEYWORDS** — Research and define tiered keywords specific to the customer's industry, location, and services| Blog Writer UI (admin) | `src/app/admin/blog/new/page.tsx` |

   - Tier 1: Primary money keywords (highest intent, highest value)| Business Context modal | `src/components/admin/BusinessContextModal.tsx` |

   - Tier 2: Secondary commercial keywords (supporting pages)| Admin Settings (connections) | `src/app/admin/settings/page.tsx` |

   - Tier 3: Long-tail / informational keywords (blog targets)| Business context storage | `content/business-context.json` |

2. **SEO_TASKS** — Customize the implementation roadmap based on where the customer is starting from

3. **CONTENT_CALENDAR** — Plan initial blog posts targeting Tier 3 keywords---



### 4.7 Business Context Customization## 10. Deployment Checklist (Per Customer)



Edit `content/business-context.json` or use the admin dashboard modal:- [ ] Customer's Next.js site built and deployed

- Company name, tagline, domain- [ ] Google Search Console property verified and service account added

- Primary and secondary services- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_SEARCH_CONSOLE_SITE` env vars set

- Target audience (geography, company size, industry)- [ ] `CLAUDE_API_KEY` env var set

- Unique selling points- [ ] `INDEXNOW_API_KEY` env var set + verification `.txt` file deployed

- Tone of voice- [ ] `PAGESPEED_API_KEY` env var set (optional)

- Custom AI instructions- [ ] `src/data/seo-strategy.ts` customized with customer-specific keywords, tasks, and content calendar

- [ ] `content/business-context.json` populated with customer company info (or done via admin modal)

### 4.8 JSON-LD Structured Data Customization- [ ] Admin user created in NextAuth

- [ ] Prisma migrations run (blog tables)

The `src/components/JsonLd.tsx` component provides reusable schema components. Per customer:- [ ] Test: GSC connection → green in admin settings

1. Update the constants at the top of the file: `SITE_URL`, `BUSINESS_NAME`, `LOGO_URL`- [ ] Test: AI Advisor → returns analysis with real data

2. Add `<LocalBusinessJsonLd>` to the homepage with the customer's phone, email, and area served- [ ] Test: AI Blog Writer → generates outline + draft

3. Add `<ServiceJsonLd>` to each service/industry page with appropriate name and description- [ ] Test: IndexNow → successful submission response

4. `<ArticleJsonLd>` and `<BreadcrumbJsonLd>` are already wired into blog post pages automatically- [ ] Test: PageSpeed audit → returns scores for key pages

5. Add `<FAQJsonLd>` to any page with FAQ sections- [ ] Walk customer through the dashboard


### 4.9 Blog Infrastructure

The blog system stores posts in the Neon PostgreSQL database via Prisma. Per customer:
1. Run Prisma migrations to create all tables (blog + SEO models)
2. Configure the admin user (NextAuth)
3. The AI blog writer is immediately available from the dashboard
4. Published posts automatically trigger IndexNow pings

---

## 5. Customer Value Proposition

### What the customer gets

| Capability | Without SeedTech SEO Autopilot | With SeedTech SEO Autopilot |
|---|---|---|
| **Keyword tracking** | Pay $100–300/mo for Ahrefs, SEMrush, or Moz | Built into your dashboard — free, live data from Google |
| **SEO audits** | Hire an agency for $500–2,000/audit | One-click audit from your admin panel, anytime |
| **On-page health checks** | Manual review or expensive crawler tools | Automated 15-page crawler checks titles, meta, headings, images, links |
| **Content creation** | Pay $200–500 per blog post from a freelancer | AI-generated, SEO-optimized posts in minutes |
| **Technical SEO monitoring** | Requires an SEO specialist ($3–5k/mo retainer) | PageSpeed, Core Web Vitals, and indexing monitored from one panel |
| **Strategic recommendations** | Quarterly agency reports (if you're lucky) | On-demand AI analysis using YOUR real data, not generic advice |
| **Search engine notifications** | Manual sitemap submissions, wait for crawlers | Instant IndexNow pings — automatic on blog publish |
| **Weekly reports** | Agency sends a PDF you never read | Automated email digest with trends, movers, and action items |
| **Structured data** | Manually write JSON-LD or use a WordPress plugin | Auto-generated schema for every page type |
| **Business context control** | Agency may not understand your business deeply | You control the AI's understanding of your company — editable anytime |

### How to talk about it

> "Every SeedTech website comes with a built-in SEO command center. You get live keyword rankings from Google, automated weekly health reports, an AI advisor that actually knows your business, and a blog writer that produces SEO-optimized content in minutes — not weeks. No extra subscriptions. No agency retainers. It's all built into your site."

### Customer-facing feature bullets

- **Live Keyword Rankings** — See exactly where you rank on Google for every keyword that matters to your business, updated in real time from Search Console.
- **Automated Health Monitoring** — Weekly health scores track your SEO performance over time. See trends, not just snapshots.
- **One-Click Performance Audits** — Run PageSpeed and Core Web Vitals audits on any page, anytime. Know exactly what's fast, what's slow, and what to fix.
- **On-Page Crawler** — Automatically checks every important page for SEO issues — missing titles, broken images, thin content, missing meta descriptions.
- **AI SEO Advisor** — Ask any SEO question and get specific, data-backed answers using your real rankings, traffic data, and business context.
- **AI Blog Writer** — Generate full, SEO-optimized blog posts from a keyword. Outlines, drafts, and metadata — all in one guided workflow.
- **Instant Search Engine Indexing** — New blog post? It's automatically submitted to Bing and other search engines the moment it's published.
- **Weekly Email Digest** — Get a report every Monday with your health score, keyword movers, critical issues, and next steps.
- **Smart Insights** — AI detects stale content, keyword cannibalization, internal linking gaps, and new keyword opportunities automatically.
- **Structured Data** — Every page gets proper schema markup for search engine rich results — no manual work.
- **Content Strategy Dashboard** — Tracked keywords, content calendar, implementation roadmap, and progress tracking — all in one place.
- **Your Business, Your Voice** — The AI knows your company, your services, your audience, and your tone. You control it.

---

## 6. Business & Pricing Context

### Cost structure (SeedTech internal)

| Component | Per-Customer Cost |
|---|---|
| Google Search Console API | Free (Google service account) |
| PageSpeed Insights API | Free (rate-limited, optional paid key) |
| IndexNow | Free |
| Claude API (AI Advisor + Blog Writer + Insights) | ~$0.01–0.05 per analysis, ~$0.05–0.15 per blog post |
| Resend (email reports) | Free tier: 100/day, then ~$20/mo |
| Infrastructure (Vercel, Neon) | Already included in hosting |

**Marginal cost per customer: near zero.** The expensive part was building the tool. Deploying it to each customer is a configuration exercise.

### Pricing models to consider

1. **Included in web development package** — Position it as a differentiator. "Every site we build includes our SEO Autopilot system." Justifies premium pricing on the web build itself.

2. **Monthly managed SEO add-on ($200–500/mo)** — For customers who want SeedTech to actively manage the tool — running analyses, publishing blog content, adjusting keyword strategy.

3. **Self-service tier (included) + managed tier (add-on)** — Give them the dashboard and AI tools for free with the site build. Charge monthly for hands-on SEO management and content production.

4. **Per-blog-post pricing ($50–100/post)** — For customers who don't want a monthly retainer but want occasional AI-assisted content. The AI does 90% of the work; SeedTech reviews and publishes.

### Competitive advantage

Most MSPs and web agencies don't offer anything like this. The typical competitor:
- Builds a WordPress site with Yoast SEO (a plugin that tells you your meta description is too long)
- Offers "SEO services" that are really just a monthly retainer for someone to write 2 blog posts
- Uses third-party tools (Ahrefs, SEMrush) that the customer never sees
- Delivers quarterly PDF reports that nobody reads

SeedTech's approach:
- The tool is **built into the product** — not bolted on
- The customer **owns the dashboard** — full transparency
- The AI **actually knows their business** — not generic templates
- Content generation is **minutes, not weeks**
- Real Google data, not estimates from third-party scrapers
- **Automated weekly reports** — not quarterly PDFs
- **Automatic IndexNow pings** — not manual sitemap submissions
- **On-page crawling** — finds issues before they hurt rankings

---

## 7. Per-Industry Deployment Notes

### Law Firms
- **Keywords:** Practice area + location combinations ("personal injury lawyer NJ", "family law attorney Hopatcong")
- **Content strategy:** Case result summaries, legal guides, FAQ-style posts answering common legal questions
- **Business context:** Bar-compliant language, never guarantee outcomes, emphasize credentials and experience
- **High-value pages:** Practice area pages, attorney profiles, "results" or "case studies" pages
- **JSON-LD:** ServiceJsonLd with practice area descriptions, BreadcrumbJsonLd for navigation

### Trucking & Logistics
- **Keywords:** Service type + lane combinations ("flatbed trucking NJ", "LTL freight Northeast"), equipment types, compliance terms
- **Content strategy:** Industry regulation explainers, equipment guides, safety/compliance content, lane-specific pages
- **Business context:** DOT compliance language, safety record emphasis, fleet capabilities
- **High-value pages:** Service/lane pages, equipment pages, careers/driver recruiting
- **JSON-LD:** ServiceJsonLd with fleet/service descriptions, BreadcrumbJsonLd

### Construction & Trades
- **Keywords:** Service type + location ("commercial roofing NJ", "steel erection contractor"), certifications, project types
- **Content strategy:** Project galleries with SEO-optimized descriptions, safety/certification content, market-specific pages
- **Business context:** Certifications (OSHA, union affiliations), bonding/insurance, project scale
- **High-value pages:** Service pages, project gallery, certifications, multi-location pages
- **JSON-LD:** ServiceJsonLd with construction service descriptions, BreadcrumbJsonLd

### Medical Practices
- **Keywords:** Specialty + location ("dermatologist Hopatcong NJ", "primary care doctor near me"), procedure/service names
- **Content strategy:** Patient education content, procedure explainers, provider profiles, health tips
- **Business context:** HIPAA-aware language, never diagnose, emphasize credentials and patient experience
- **High-value pages:** Provider profiles, service/procedure pages, patient portal integration, appointment scheduling
- **JSON-LD:** ServiceJsonLd with HIPAA-compliant descriptions, BreadcrumbJsonLd

---

## 8. Roadmap & Future Capabilities

### ✅ Completed
- [x] **Google Search Console integration** — live keyword rankings, page performance, tracked positions
- [x] **PageSpeed Insights integration** — Core Web Vitals, performance scores, optimization opportunities
- [x] **IndexNow instant indexing** — dual-endpoint ping, manual and auto-triggered
- [x] **AI SEO Advisor** — on-demand analysis with business context fusion
- [x] **AI Blog Writer** — outline + draft generation with keyword targeting
- [x] **5-tab admin dashboard** — Overview, Keywords, Audit, Insights, Strategy
- [x] **Health score snapshots** — weekly scoring with historical trends
- [x] **On-page crawler** — 15-page server-side HTML audit with issue severity
- [x] **AI insights engine** — stale content, cannibalization, linking gaps
- [x] **AI keyword discovery** — Claude-powered research from GSC data
- [x] **Weekly email reports** — automated via Resend with health + keyword movers
- [x] **Automated cron pipeline** — Vercel Cron: snapshot → crawl → insights → email
- [x] **Auto-IndexNow on blog publish** — search engines pinged automatically
- [x] **JSON-LD structured data** — LocalBusiness, Service, Article, FAQ, Breadcrumb
- [x] **Dynamic sitemap + robots.txt** — all routes + blog posts with last-modified dates
- [x] **Auth on all API routes** — every admin endpoint session-gated
- [x] **Business context editor** — admin modal for company profile, tone, custom instructions
- [x] **Tracked keyword strategy** — tiered keywords, tasks, content calendar

### Near-term (next 90 days)
- [ ] **DB-driven keyword strategy** — move TRACKED_KEYWORDS, SEO_TASKS, CONTENT_CALENDAR from static `seo-strategy.ts` to Prisma models with admin CRUD
- [ ] **Blog auto-scheduling** — generate a month of blog posts in one session, auto-publish on schedule
- [ ] **Competitor tracking** — monitor competitor keyword positions and content gaps
- [ ] **Rate limiting on AI endpoints** — protect Claude API costs from accidental/excessive usage

### Medium-term (6 months)
- [ ] **Multi-site dashboard** — central SeedTech admin to monitor all customer SEO performance from one view
- [ ] **Google Business Profile integration** — manage GBP posts, reviews, and Q&A from the admin panel
- [ ] **Backlink monitoring** — track new/lost backlinks using GSC link data
- [ ] **AI content refresh** — identify aging content and auto-generate updated versions

### Long-term
- [ ] **White-label mode** — customer sees their own branding on the SEO dashboard
- [ ] **Client-facing reports** — auto-generated PDF reports customers can share with stakeholders
- [ ] **API access** — let power users integrate SEO data into their own tools

---

## 9. File Reference

| Purpose | File Path |
|---|---|
| Google Search Console lib | `src/lib/google-search-console.ts` |
| PageSpeed Insights lib | `src/lib/pagespeed.ts` |
| IndexNow lib | `src/lib/indexnow.ts` |
| SEO Snapshot lib | `src/lib/seo-snapshot.ts` |
| On-Page Crawler lib | `src/lib/seo-crawler.ts` |
| Insights Engine lib | `src/lib/seo-insights.ts` |
| Email Reports lib | `src/lib/seo-reports.ts` |
| Business context lib | `src/lib/business-context.ts` |
| Auth options | `src/lib/auth-options.ts` |
| Auth helper | `src/lib/auth.ts` |
| SEO strategy data | `src/data/seo-strategy.ts` |
| JSON-LD component | `src/components/JsonLd.tsx` |
| Business context modal | `src/components/admin/BusinessContextModal.tsx` |
| GSC API route | `src/app/api/admin/seo/search-console/route.ts` |
| PageSpeed API route | `src/app/api/admin/seo/pagespeed/route.ts` |
| IndexNow API route | `src/app/api/admin/seo/indexnow/route.ts` |
| AI Advisor API route | `src/app/api/admin/seo/ai-advisor/route.ts` |
| Snapshot API route | `src/app/api/admin/seo/snapshot/route.ts` |
| Crawl API route | `src/app/api/admin/seo/crawl/route.ts` |
| Insights API route | `src/app/api/admin/seo/insights/route.ts` |
| Keyword Discovery API route | `src/app/api/admin/seo/keyword-discovery/route.ts` |
| Reports API route | `src/app/api/admin/seo/reports/route.ts` |
| Cron SEO route | `src/app/api/cron/seo/route.ts` |
| Blog API (with auto-IndexNow) | `src/app/api/blog/[id]/route.ts` |
| AI Blog Writer API route | `src/app/api/ai/generate-blog/route.ts` |
| SEO Dashboard (admin) | `src/app/admin/seo/page.tsx` |
| Blog Writer UI (admin) | `src/app/admin/blog/new/page.tsx` |
| Admin Settings (connections) | `src/app/admin/settings/page.tsx` |
| Dynamic Sitemap | `src/app/sitemap.ts` |
| Robots.txt | `src/app/robots.ts` |
| Vercel Cron config | `vercel.json` |
| IndexNow verification | `public/{INDEXNOW_API_KEY}.txt` |
| Business context storage | `content/business-context.json` |
| Prisma schema | `prisma/schema.prisma` |

---

## 10. Deployment Checklist (Per Customer)

### Infrastructure
- [ ] Customer's Next.js site built and deployed to Vercel
- [ ] Neon PostgreSQL database provisioned
- [ ] `DATABASE_URL` env var set
- [ ] Prisma migrations run (`npx prisma db push`)
- [ ] Admin user created in NextAuth

### Google Integration
- [ ] Google Search Console property verified and service account added
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_SEARCH_CONSOLE_SITE` env vars set

### AI & Indexing
- [ ] `CLAUDE_API_KEY` env var set
- [ ] `INDEXNOW_API_KEY` env var set + verification `.txt` file deployed to `public/`
- [ ] `PAGESPEED_API_KEY` env var set (optional)

### Automation
- [ ] `CRON_SECRET` env var set (Vercel auto-sends as auth header)
- [ ] `RESEND_API_KEY`, `REPORT_FROM_EMAIL`, `REPORT_TO_EMAIL` env vars set (optional)
- [ ] Verify cron is active in Vercel dashboard after deploy

### Customization
- [ ] `src/data/seo-strategy.ts` customized with customer-specific keywords, tasks, and content calendar
- [ ] `content/business-context.json` populated with customer company info (or done via admin modal)
- [ ] `src/components/JsonLd.tsx` constants updated: `SITE_URL`, `BUSINESS_NAME`, `LOGO_URL`
- [ ] `NEXT_PUBLIC_SITE_URL` env var set

### Verification
- [ ] Test: GSC connection → green in admin settings
- [ ] Test: AI Advisor → returns analysis with real data
- [ ] Test: AI Blog Writer → generates outline + draft
- [ ] Test: IndexNow → successful submission response
- [ ] Test: PageSpeed audit → returns scores for key pages
- [ ] Test: Snapshot → saves to database with health score
- [ ] Test: Crawler → audits pages and stores results
- [ ] Test: Insights → generates AI insights
- [ ] Test: Cron endpoint → runs full pipeline (use manual curl)
- [ ] Test: Blog publish → IndexNow auto-ping fires
- [ ] Walk customer through the 5-tab dashboard
