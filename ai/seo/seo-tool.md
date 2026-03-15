# SeedTech SEO Autopilot — Product & Deployment Guide

> **Internal document** — Defines the SEO automation platform SeedTech has built, how it works, how to deploy it per-customer, and how to position it as a service add-on.

---

## 1. Executive Summary

SeedTech has built a fully integrated, AI-powered SEO management system that runs inside every Next.js website we build. It is **not** a third-party plugin or a SaaS subscription the customer buys — it is a proprietary backend built into the site itself.

This system gives customers a self-service SEO command center inside their admin panel, powered by:
- **Live Google Search Console data** — real keyword rankings, click data, page performance
- **Google PageSpeed Insights** — Core Web Vitals, performance scores, actionable optimization opportunities
- **IndexNow instant indexing** — ping Bing, Yandex, and other search engines the moment content is published or updated
- **AI SEO Advisor (Claude)** — on-demand strategic analysis that combines all live data with the customer's business context to produce specific, prioritized recommendations
- **AI Blog Writer (Claude)** — a guided wizard that generates full SEO-optimized blog posts targeting specific keywords, with proper internal linking and metadata
- **Tracked Keyword Strategy** — tiered keyword list with volumes, competition, intent, and target pages — monitored against live GSC positions
- **Content Calendar** — blog pipeline with keyword targets, word counts, funnel stages, and publication status
- **Editable Business Context** — customers can update their company profile, tone of voice, and custom instructions that feed into every AI-generated output

### What makes this different
This isn't "we'll do your SEO for you" — this is **"we built the tool that does your SEO, and it lives inside your website."** The customer has full visibility and control. The AI does the analysis and content generation. SeedTech provides the infrastructure, setup, and ongoing support.

---

## 2. Complete Capabilities Inventory

### 2.1 Google Search Console Integration
**File:** `src/lib/google-search-console.ts`  
**API Route:** `GET /api/admin/seo/search-console`

| Capability | Description |
|---|---|
| Connection test | Verify service account access to the customer's GSC property |
| Keyword performance | Top 100 keywords with clicks, impressions, CTR, and average position (configurable date range) |
| Page performance | Top 50 pages with clicks, impressions, CTR, and position |
| Full summary | Aggregated overview — total clicks, total impressions, avg CTR, avg position, top keywords, top pages |
| Tracked keyword positions | Cross-reference the customer's target keyword list against real GSC data to show actual ranking positions |
| Site listing | List all properties the service account has access to (useful for debugging) |

**Auth method:** Google Service Account (JWT) with `webmasters.readonly` scope.

### 2.2 PageSpeed Insights
**File:** `src/lib/pagespeed.ts`  
**API Route:** `GET /api/admin/seo/pagespeed`

| Capability | Description |
|---|---|
| Single URL analysis | Performance, Accessibility, Best Practices, and SEO scores + Core Web Vitals (LCP, CLS, FCP, TBT, TTI, Speed Index) |
| Multi-page site audit | Audit up to N key pages at once — returns per-page scores and site-wide averages |
| Optimization opportunities | Ranked list of specific improvements with estimated time savings in milliseconds |
| Strategy toggle | Mobile or desktop analysis |

**Auth method:** Public API (free), optional `PAGESPEED_API_KEY` for higher rate limits.

### 2.3 IndexNow Instant Indexing
**File:** `src/lib/indexnow.ts`  
**API Route:** `POST /api/admin/seo/indexnow`

| Capability | Description |
|---|---|
| Single URL submission | Notify Bing + IndexNow consortium that a specific URL has been created/updated |
| Batch URL submission | Submit multiple URLs at once (e.g., after a sitemap update or blog publishing session) |
| Dual endpoint ping | Submits to both `api.indexnow.org` and `bing.com/indexnow` for maximum coverage |
| Configuration check | `GET` endpoint returns whether IndexNow is properly configured |

**Auth method:** Self-generated API key served as a `.txt` file at the site root.

### 2.4 AI SEO Advisor
**File:** `src/app/api/admin/seo/ai-advisor/route.ts`  
**API Route:** `POST /api/admin/seo/ai-advisor`

| Capability | Description |
|---|---|
| Full analysis | Executive summary, top 3 priorities, keyword opportunities, content gaps, technical issues, competitive insights |
| Custom questions | Ask specific SEO questions — "How do I rank for [keyword]?", "What should my next blog post be about?" |
| Data fusion | Combines GSC live data + PageSpeed data + keyword strategy + content calendar + business context into a single analysis prompt |
| Actionable output | References real numbers, real keywords, real pages — not generic advice |

**AI model:** Claude (Anthropic) via `CLAUDE_API_KEY`.

### 2.5 AI Blog Writer
**File:** `src/app/api/ai/generate-blog/route.ts`  
**Admin UI:** `src/app/admin/blog/new/page.tsx`

| Capability | Description |
|---|---|
| Outline generation | Takes topic + keyword → produces structured outline with headings, key points, word count estimates, slug, excerpt, meta tags, internal links, categories, and tags |
| Full draft generation | Takes approved outline → produces complete Markdown blog post with proper SEO keyword placement (3-5 natural mentions), internal links, H2/H3 structure, and CTA |
| Meta generation | Generates optimized meta title (< 60 chars) and meta description (< 160 chars) |
| Business context injection | Every generation uses the customer's editable business profile, tone of voice, and keyword strategy |
| Content calendar integration | Pulls from the tracked keyword list and content calendar to inform topic suggestions |

### 2.6 Admin Dashboard
**File:** `src/app/admin/seo/page.tsx`

| Panel | Description |
|---|---|
| Strategy score cards | Tracked keyword count (by tier), task completion %, content calendar progress, avg keyword position (live from GSC) |
| Search Console overview | Top 10 keywords + top 8 pages with clicks, impressions, CTR, and position — refreshable live |
| Keyword tracking table | Full keyword list with tier, volume, competition, intent, target page, and live position from GSC |
| PageSpeed audit panel | Run on-demand mobile/desktop audits — shows per-page scores for Performance, Accessibility, SEO, plus Core Web Vitals |
| Implementation roadmap | Phased SEO task list with status tracking (done / in-progress / not-started) and priority flags |
| Content calendar | Blog pipeline with keyword targets, word counts, funnel stages, and publication status |
| AI SEO Advisor | Chat interface — run full analysis or ask specific questions, with quick-prompt suggestions |
| IndexNow button | One-click batch submission of key URLs to search engines |
| Business Context modal | Edit company profile, tagline, services, tone of voice, and custom AI instructions |

### 2.7 Editable Business Context
**File:** `src/lib/business-context.ts`  
**Storage:** `content/business-context.json`

The business context is the "personality file" that feeds every AI output. It includes:
- Company name, tagline, location, domain
- Primary and secondary services
- Target audience
- Unique selling points
- Tone of voice
- Custom instructions (e.g., "always link back to /pricing", "never mention competitor X")

This is editable from the admin dashboard via a modal — changes take effect immediately on the next AI generation.

---

## 3. Technical Architecture

```
┌─────────────────────────────────────────────────┐
│                  Admin Dashboard                 │
│           /admin/seo  +  /admin/blog            │
├──────────┬──────────┬──────────┬────────────────┤
│  GSC     │ PageSpeed│ IndexNow │  AI Advisor    │
│  Panel   │  Panel   │  Button  │  + Blog Writer │
└────┬─────┴────┬─────┴────┬─────┴───────┬────────┘
     │          │          │             │
     ▼          ▼          ▼             ▼
┌──────────┐ ┌────────┐ ┌────────┐ ┌───────────┐
│ GSC API  │ │ PSI API│ │IndexNow│ │Claude API │
│ (Google) │ │(Google)│ │ (Bing) │ │(Anthropic)│
└──────────┘ └────────┘ └────────┘ └───────────┘
     ▲                                    ▲
     │                                    │
     └──── business-context.json ─────────┘
           seo-strategy.ts (keywords, tasks, calendar)
```

### Stack
- **Framework:** Next.js 14 (App Router, Server Components)
- **Auth:** NextAuth.js — admin routes are session-gated
- **AI:** Claude (Anthropic API) — `claude-opus-4-6`
- **Google APIs:** `googleapis` npm package (Search Console), PageSpeed REST API
- **Database:** Neon PostgreSQL + Prisma 7 (blog posts, settings)
- **Hosting:** Vercel (recommended) or any Node.js host

---

## 4. Per-Customer Deployment Guide

### 4.1 Environment Variables Required

Each customer deployment needs these environment variables configured:

```env
# ── Google Search Console ──
GOOGLE_SERVICE_ACCOUNT_EMAIL=seo@customer-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"..."}
GOOGLE_SEARCH_CONSOLE_SITE=sc-domain:customerdomain.com
# Can also be https://customerdomain.com

# ── AI (Claude) ──
CLAUDE_API_KEY=sk-ant-...

# ── IndexNow ──
INDEXNOW_API_KEY=a-random-string-you-generate
# Also serve https://customerdomain.com/{INDEXNOW_API_KEY}.txt

# ── PageSpeed (optional — increases rate limits) ──
PAGESPEED_API_KEY=AIzaSy...

# ── Auth ──
NEXTAUTH_SECRET=random-secret
NEXTAUTH_URL=https://customerdomain.com
```

### 4.2 Google Search Console Setup (Per Customer)

1. **Create a GCP project** (or reuse SeedTech's central project)
2. **Create a service account** — name it something like `seo-bot@project.iam.gserviceaccount.com`
3. **Generate a JSON key** for the service account
4. **Add the service account as a user** in the customer's Google Search Console property (Settings → Users and permissions → Add user → Full access)
5. **Verify the property** in GSC if not already (DNS TXT record or HTML file method)
6. **Set the env vars** — paste the full JSON key or just the private_key PEM string

### 4.3 IndexNow Setup (Per Customer)

1. **Generate a random API key** — any alphanumeric string (e.g., `a1b2c3d4e5f6`)
2. **Create the verification file** — `public/{INDEXNOW_API_KEY}.txt` containing just the API key string
3. **Set the env var** — `INDEXNOW_API_KEY=a1b2c3d4e5f6`
4. IndexNow will verify ownership by fetching `https://customerdomain.com/{key}.txt`

### 4.4 SEO Strategy Customization (Per Customer)

The file `src/data/seo-strategy.ts` must be customized per customer:

1. **TRACKED_KEYWORDS** — Research and define tiered keywords specific to the customer's industry, location, and services
   - Tier 1: Primary money keywords (highest intent, highest value)
   - Tier 2: Secondary commercial keywords (supporting pages)
   - Tier 3: Long-tail / informational keywords (blog targets)
2. **SEO_TASKS** — Customize the implementation roadmap based on where the customer is starting from
3. **CONTENT_CALENDAR** — Plan initial blog posts targeting Tier 3 keywords

### 4.5 Business Context Customization

Edit `content/business-context.json` or use the admin dashboard modal:
- Company name, tagline, domain
- Primary and secondary services
- Target audience (geography, company size, industry)
- Unique selling points
- Tone of voice
- Custom AI instructions

### 4.6 Blog Infrastructure

The blog system stores posts in the Neon PostgreSQL database via Prisma. Per customer:
1. Run Prisma migrations to create blog tables
2. Configure the admin user (NextAuth)
3. The AI blog writer is immediately available from the dashboard

---

## 5. Customer Value Proposition

### What the customer gets

| Capability | Without SeedTech SEO Autopilot | With SeedTech SEO Autopilot |
|---|---|---|
| **Keyword tracking** | Pay $100–300/mo for Ahrefs, SEMrush, or Moz | Built into your dashboard — free, live data from Google |
| **SEO audits** | Hire an agency for $500–2,000/audit | One-click audit from your admin panel, anytime |
| **Content creation** | Pay $200–500 per blog post from a freelancer | AI-generated, SEO-optimized posts in minutes |
| **Technical SEO monitoring** | Requires an SEO specialist ($3–5k/mo retainer) | PageSpeed, Core Web Vitals, and indexing monitored from one panel |
| **Strategic recommendations** | Quarterly agency reports (if you're lucky) | On-demand AI analysis using YOUR real data, not generic advice |
| **Search engine notifications** | Manual sitemap submissions, wait for crawlers | Instant IndexNow pings — search engines know about new content in seconds |
| **Business context control** | Agency may not understand your business deeply | You control the AI's understanding of your company — editable anytime |

### How to talk about it

> "Every SeedTech website comes with a built-in SEO command center. You get live keyword rankings from Google, automated performance audits, an AI advisor that actually knows your business, and a blog writer that produces SEO-optimized content in minutes — not weeks. No extra subscriptions. No agency retainers. It's all built into your site."

### Customer-facing feature bullets

- **Live Keyword Rankings** — See exactly where you rank on Google for every keyword that matters to your business, updated in real time from Search Console.
- **One-Click Performance Audits** — Run PageSpeed and Core Web Vitals audits on any page, anytime. Know exactly what's fast, what's slow, and what to fix.
- **AI SEO Advisor** — Ask any SEO question and get specific, data-backed answers using your real rankings, traffic data, and business context.
- **AI Blog Writer** — Generate full, SEO-optimized blog posts from a keyword. Outlines, drafts, and metadata — all in one guided workflow.
- **Instant Search Engine Indexing** — New blog post? Updated service page? One click notifies Bing, Yandex, and others instantly via IndexNow.
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
| Claude API (AI Advisor + Blog Writer) | ~$0.01–0.05 per analysis, ~$0.05–0.15 per blog post |
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

---

## 7. Per-Industry Deployment Notes

### Law Firms
- **Keywords:** Practice area + location combinations ("personal injury lawyer NJ", "family law attorney Hopatcong")
- **Content strategy:** Case result summaries, legal guides, FAQ-style posts answering common legal questions
- **Business context:** Bar-compliant language, never guarantee outcomes, emphasize credentials and experience
- **High-value pages:** Practice area pages, attorney profiles, "results" or "case studies" pages

### Trucking & Logistics
- **Keywords:** Service type + lane combinations ("flatbed trucking NJ", "LTL freight Northeast"), equipment types, compliance terms
- **Content strategy:** Industry regulation explainers, equipment guides, safety/compliance content, lane-specific pages
- **Business context:** DOT compliance language, safety record emphasis, fleet capabilities
- **High-value pages:** Service/lane pages, equipment pages, careers/driver recruiting

### Construction & Trades
- **Keywords:** Service type + location ("commercial roofing NJ", "steel erection contractor"), certifications, project types
- **Content strategy:** Project galleries with SEO-optimized descriptions, safety/certification content, market-specific pages
- **Business context:** Certifications (OSHA, union affiliations), bonding/insurance, project scale
- **High-value pages:** Service pages, project gallery, certifications, multi-location pages

### Medical Practices
- **Keywords:** Specialty + location ("dermatologist Hopatcong NJ", "primary care doctor near me"), procedure/service names
- **Content strategy:** Patient education content, procedure explainers, provider profiles, health tips
- **Business context:** HIPAA-aware language, never diagnose, emphasize credentials and patient experience
- **High-value pages:** Provider profiles, service/procedure pages, patient portal integration, appointment scheduling

---

## 8. Roadmap & Future Capabilities

### Near-term (next 90 days)
- [ ] **Automated weekly SEO reports** — email digest with ranking changes, traffic trends, and AI recommendations
- [ ] **Blog auto-scheduling** — generate a month of blog posts in one session, auto-publish on schedule
- [ ] **Competitor tracking** — monitor competitor keyword positions and content gaps
- [ ] **Schema markup automation** — auto-generate JSON-LD structured data for every page type

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
| Business context lib | `src/lib/business-context.ts` |
| SEO strategy data | `src/data/seo-strategy.ts` |
| GSC API route | `src/app/api/admin/seo/search-console/route.ts` |
| PageSpeed API route | `src/app/api/admin/seo/pagespeed/route.ts` |
| IndexNow API route | `src/app/api/admin/seo/indexnow/route.ts` |
| AI Advisor API route | `src/app/api/admin/seo/ai-advisor/route.ts` |
| AI Blog Writer API route | `src/app/api/ai/generate-blog/route.ts` |
| SEO Dashboard (admin) | `src/app/admin/seo/page.tsx` |
| Blog Writer UI (admin) | `src/app/admin/blog/new/page.tsx` |
| Business Context modal | `src/components/admin/BusinessContextModal.tsx` |
| Admin Settings (connections) | `src/app/admin/settings/page.tsx` |
| Business context storage | `content/business-context.json` |

---

## 10. Deployment Checklist (Per Customer)

- [ ] Customer's Next.js site built and deployed
- [ ] Google Search Console property verified and service account added
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_SEARCH_CONSOLE_SITE` env vars set
- [ ] `CLAUDE_API_KEY` env var set
- [ ] `INDEXNOW_API_KEY` env var set + verification `.txt` file deployed
- [ ] `PAGESPEED_API_KEY` env var set (optional)
- [ ] `src/data/seo-strategy.ts` customized with customer-specific keywords, tasks, and content calendar
- [ ] `content/business-context.json` populated with customer company info (or done via admin modal)
- [ ] Admin user created in NextAuth
- [ ] Prisma migrations run (blog tables)
- [ ] Test: GSC connection → green in admin settings
- [ ] Test: AI Advisor → returns analysis with real data
- [ ] Test: AI Blog Writer → generates outline + draft
- [ ] Test: IndexNow → successful submission response
- [ ] Test: PageSpeed audit → returns scores for key pages
- [ ] Walk customer through the dashboard
