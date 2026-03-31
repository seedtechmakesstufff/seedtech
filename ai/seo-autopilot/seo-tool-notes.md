 Your own SEO_AUTOPILOT.md also frames this as an internal system built into each site, not central SaaS product.


The real refactor order

1) prisma/schema.prisma — do this first

Right now the schema has a lot of SEO tables, but no User, Site, Organization, tenant, or workspace model. BlogPost.slug is globally unique, TrackedKeyword.keyword is globally unique, and records like SeoSnapshot, AICitation, and AIVisibilityScore have no site relation at all. That means the database itself is enforcing a one-site worldview. Start by adding Tenant, User, Membership, Site, SitePage, BusinessProfile, and IntegrationCredential, then add siteId to every SEO-facing model and change uniqueness to composite keys like @@unique([siteId, slug]) and @@unique([siteId, keyword]).  ￼

A good first schema shape is:
model Tenant {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  memberships Membership[]
  sites       Site[]
  createdAt   DateTime     @default(now())
}

model User {
  id           String       @id @default(cuid())
  email        String       @unique
  passwordHash String
  name         String?
  memberships  Membership[]
  createdAt    DateTime     @default(now())
}

model Membership {
  userId   String
  tenantId String
  role     String
  user     User   @relation(fields: [userId], references: [id])
  tenant   Tenant @relation(fields: [tenantId], references: [id])

  @@id([userId, tenantId])
}

model Site {
  id          String                @id @default(cuid())
  tenantId    String
  name        String
  slug        String
  domain      String
  siteUrl     String
  businessProfile BusinessProfile?
  pages       SitePage[]
  integrations IntegrationCredential[]
  tenant      Tenant                @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, slug])
}

model SitePage {
  id        String   @id @default(cuid())
  siteId    String
  path      String
  kind      String   // home, service, location, blog, landing
  title     String?
  source    String   // cms, blog, manual, discovered
  status    String
  site      Site     @relation(fields: [siteId], references: [id])

  @@unique([siteId, path])
}

Migration strategy: create one default Tenant + Site for SeedTech, backfill all existing rows to that siteId, switch reads to require siteId, then make siteId non-null everywhere.

2) src/lib/auth-options.ts — replace global admin auth with site-aware auth

Today auth is one credentials provider, checked against ADMIN_EMAILS and one shared ADMIN_PASSWORD, with no user table or membership model. Keep NextAuth if you want, but stop using global env allowlists as the product boundary. Change auth to validate against the new User table, load memberships, and put userId, tenantIds, and currentSiteId into the JWT/session. Then add a new helper like src/lib/site-context.ts or src/lib/access.ts that every admin route calls to resolve “who is this?” and “which site are they operating on?”  ￼

3) src/lib/business-context.ts — move business context into the database

This file is still filesystem-backed and ships with SeedTech/Northern NJ/MSP-specific defaults and internal-link instructions. For a product, this should become a DB-backed BusinessProfile keyed by siteId. Keep buildStrategyPrompt, but make it pure: it should accept a profile object, not read/write content/business-context.json.  ￼

What belongs in BusinessProfile:
	•	company name, domain, service area, primary/secondary services
	•	tone of voice, USPs, CTA defaults
	•	preferred internal link targets
	•	service categories and money pages
	•	brand entities to mention
	•	custom AI instructions

That one model becomes the input for prompts, internal linking, reporting, and local SEO defaults.

4) src/data/seo-strategy.ts — stop using this as runtime truth

This file explicitly says it is the “single source of truth” for the dashboard and AI blog generator, and its tracked keywords are MSP/NJ-specific. That is fine as a template, but it cannot remain runtime state in a multi-tenant app. Move it to something like src/lib/templates/msp-seed.ts, and seed new sites from templates during onboarding. The runtime source of truth should be DB tables like TrackedKeyword, KeywordCluster, SeoTask, and ContentIdea/calendar rows.  ￼

5) src/app/api/admin/seo/search-console/route.ts + src/lib/google-search-console.ts

The route currently imports TRACKED_KEYWORDS from the static strategy file, and the GSC lib reads one global service-account identity and one global property from env vars. Also, getSearchConsoleSummary() is not a true full-property summary right now; it builds totals from the top 25 keywords and top 15 pages, and tracked keyword positions are found by exact lowercase match in the top 500 queries. For a product, refactor this into getSearchConsoleClient(siteIntegration) and getSearchConsoleSummary(siteId, days), with keywords loaded from DB and credentials/property loaded from site config.  ￼

I would change the signatures roughly like this:
type SearchConsoleIntegration = {
  property: string;
  authType: "service-account" | "oauth";
  encryptedCredentials: string;
};

getSearchConsoleSummary(integration: SearchConsoleIntegration, days: number)
getTrackedKeywordPositions(
  integration: SearchConsoleIntegration,
  keywords: Array<{ keyword: string; targetPage?: string }>,
  days: number
)

Also: stop exact-string matching as the only lookup. Keep exact match first, but add normalized variants and optional target-page hints.

6) src/lib/pagespeed.ts + src/app/api/admin/seo/pagespeed/route.ts

auditSite() still defaults to MSP-specific paths like /services/managed-it and /pricing/it-support. And the UI expects d.results from the PageSpeed endpoint, while the route currently returns the summary object directly. Fix both at once: make paths come from SitePage or site settings, and standardize the response contract. Either return { summary } from the route and update the client, or return { results: summary } to match the existing page.  ￼

7) src/lib/seo-snapshot.ts — make snapshots site-scoped and inventory-driven

This service still pulls tracked keywords from the static array, and for PageSpeed it only audits the homepage path ["/"]. The health-score comment says 40/20/30/10 weighting, but the implementation uses 35/15/35/15. Refactor this to takeSnapshot(siteId) so it loads keywords from DB, uses the site’s key pages from SitePage, and stores siteId on every snapshot. Also either fix the comment or fix the math so the metric definition is trustworthy.  ￼

8) src/lib/seo-crawler.ts — replace hard-coded page lists with a page inventory

The crawler currently has a baked-in DEFAULT_PATHS list with SeedTech pages such as /services/managed-it, /pricing/it-support, and specific industries. This file wants a real SitePage inventory model. Once you have that, the crawler should run against:
	1.	core manually configured pages,
	2.	published blog posts,
	3.	discovered sitemap URLs,
	4.	optionally high-priority landing pages.  ￼

I would also add a new SeoCrawlRun table. Right now SeoPageAudit has runId, url, checkType, and severity, but no site relation and no crawl-run metadata table. A SeoCrawlRun record gives you clean run history, duration, counts, and site scoping.  ￼

9) src/lib/seo-insights.ts — remove MSP-specific heuristics

Your insights engine is currently suggesting internal links based on keyword fragments like it, support, managed, web, and security, with defaults like /services/managed-it, /pricing/it-support, and /contact. That logic is useful for SeedTech, but it is not product-safe. Refactor it to use actual SitePage inventory plus page types, clusters, and service taxonomy from the current site.  ￼

The replacement pattern should be:
	•	look up the current page’s cluster/service/category
	•	suggest sibling pages in the same cluster
	•	suggest nearby money pages
	•	suggest one relevant supporting blog
	•	never hard-code route names in the engine

10) src/lib/ai-visibility.ts + src/app/api/admin/seo/ai-visibility/route.ts

This scorer is a real content rubric, but it is still a heuristic rubric: it scores markdown for things like entity mentions, headings, definitions, lists, FAQ blocks, query-pattern coverage, and source citations. Keep it, but present it as an AI visibility readiness score, not as measured citation probability. Then make it site-aware by passing site profile, page type, and service vocabulary into the scorer. On the API side, keep the current separation where GET reads and POST stores, but add siteId and ideally sitePageId so scores attach to actual page records, not just bare URLs.  ￼

11) src/app/api/admin/seo/ai-citations/route.ts — treat this as manual logging unless you build collectors

Right now this API aggregates rows already in AICitation and lets you create new rows via POST; it does not itself fetch results from ChatGPT, Gemini, Perplexity, or Google AIO. That means it is currently a manual or externally-fed logging endpoint. For productization, add siteId first. Then later, if you want automated collection, build a separate worker/check system rather than overloading this route.  ￼

12) src/lib/seo-reports.ts + src/app/api/admin/seo/reports/route.ts

Reports still default to SeedTech’s site URL and SeedTech-style from/to emails. Those need to move into site settings immediately. The report generator should become buildSeoReport(siteId, period) and sendSeoReport(siteId, period), with branding, recipients, domain, and CTA links all coming from the active site.  ￼

13) src/app/admin/seo/page.tsx — split the monolith after the data model is fixed

This page still imports TRACKED_KEYWORDS, SEO_TASKS, and CONTENT_CALENDAR from static data, and it hard-codes SeedTech URLs in the IndexNow payload. It also assumes the PageSpeed endpoint returns d.results. After the schema/auth/context refactor, split this into site-scoped tabs/components and move all data fetching into hooks keyed by siteId. Route shape should become something like /admin/sites/[siteId]/seo or /app/(dashboard)/sites/[siteId]/seo.  ￼

14) src/lib/prisma.ts — mostly leave this alone

This file is already a clean Prisma singleton around the Neon adapter. I would not spend meaningful time here beyond maybe adding a thin site-context helper layer nearby. The architectural work is above it, not inside it.  ￼

The best sequence to actually build this

Pass 1:
	•	schema.prisma
	•	auth-options.ts
	•	new site-context.ts
	•	business-context.ts
	•	create one default SeedTech tenant/site and backfill all rows

Pass 2:
	•	replace src/data/seo-strategy.ts runtime usage
	•	refactor search-console, pagespeed, and seo-snapshot
	•	add SitePage inventory
	•	fix the PageSpeed response mismatch

Pass 3:
	•	refactor crawler, insights, reports, AI visibility, AI citations to require siteId
	•	add SeoCrawlRun
	•	move report recipients and integration config to DB

Pass 4:
	•	split src/app/admin/seo/page.tsx
	•	add site switcher and onboarding
	•	convert MSP/SeedTech strategy files into reusable templates for plumbing, HVAC, MSP, etc.

The important thing is this: do not start by polishing prompts or adding more automations. Until siteId exists everywhere, every new feature will just harden the one-site architecture you are trying to escape.

The highest-leverage next artifact is the Phase 1 schema diff plus the SiteContext helper contract.