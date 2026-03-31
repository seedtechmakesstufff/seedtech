# SEO Autopilot — Client Onboarding Guide

Step-by-step setup for deploying SEO Autopilot on a new client site. Complete each phase in order — later phases depend on earlier ones.

---

## Quick Reference

```
Tenant → Site → all data (cascade deletes)
Auth: JWT with userId/tenantId/siteId/role
Roles: owner > admin > editor > viewer
Cron: Monday 6 AM UTC → snapshot, crawl, insights, citations, report
```

---

## Phase 1: Tenant & Site

Create the multi-tenant container. Every piece of data hangs off a Site.

```sql
-- Or use Prisma Studio / seed script
INSERT INTO tenants (id, name, slug) VALUES ('tenant_clientx', 'Client X LLC', 'clientx');

INSERT INTO sites (id, tenant_id, name, slug, domain, site_url)
VALUES ('site_clientx', 'tenant_clientx', 'Client X', 'clientx', 'clientx.com', 'https://clientx.com');
```

- [ ] Tenant created with name + slug
- [ ] Site created with domain + siteUrl
- [ ] Site ID noted for all subsequent steps

---

## Phase 2: Admin User & Team

Create the first admin user and invite the client.

```sql
INSERT INTO users (id, email, password_hash) VALUES ('user_xxx', 'admin@clientx.com', '<bcrypt hash>');

INSERT INTO memberships (id, user_id, tenant_id, role) VALUES ('mem_xxx', 'user_xxx', 'tenant_clientx', 'owner');
```

- [ ] Admin user created (or invite via `/admin/settings/team`)
- [ ] Membership assigned with role `owner` (client) or `admin` (agency staff)
- [ ] Client can log in at `/admin/login`

**Role guide:**
| Role | Dashboard | Edit Content | Settings | Team |
|------|-----------|-------------|----------|------|
| viewer | Read only | No | No | No |
| editor | Read only | Yes | No | No |
| admin | Full | Yes | Yes | No |
| owner | Full | Yes | Yes | Yes |

---

## Phase 3: Business Profile

This drives all AI prompts, email branding, scoring context, and blog generation. **Most important step.**

Go to **Settings > Business Profile** in the admin panel, or populate directly:

| Field | Required | Example |
|-------|----------|---------|
| companyName | Yes | "Smith & Associates Law" |
| tagline | Recommended | "Personal injury attorneys serving the greater Chicago area" |
| location | Yes (for local SEO) | "Chicago, IL (Cook County)" |
| domain | Yes | "smithlaw.com" |
| primaryService | Yes | "Personal injury litigation" |
| secondaryServices | Recommended | ["Workers' comp", "Medical malpractice", "Car accidents"] |
| targetAudience | Recommended | "Individuals and families in the Chicago metro area who have been injured..." |
| uniqueSellingPoints | Recommended | ["No fee unless we win", "35+ years experience", "Free consultation"] |
| toneOfVoice | Recommended | "Authoritative and empathetic. Avoid legal jargon where possible." |
| customInstructions | Optional | "Always mention our free consultation. Link to /practice-areas when relevant." |
| logoUrl | Optional | Upload via Settings > Branding |

- [ ] Company name, domain, location filled in
- [ ] Primary service and target audience defined
- [ ] Tone of voice set (affects all AI-generated content)
- [ ] Logo uploaded via branding settings

---

## Phase 4: Site Pages

Register the site's key pages so the crawler, PageSpeed auditor, and link suggester know what exists.

| Field | Example |
|-------|---------|
| path | "/practice-areas/personal-injury" |
| kind | "service" / "home" / "landing" / "blog" / "location" |
| title | "Personal Injury Attorney Chicago" |
| source | "manual" |
| status | "active" |

**Minimum pages to register:**
- [ ] Homepage (`/`, kind: `home`)
- [ ] Contact page (`/contact`, kind: `landing`)
- [ ] About page (`/about`, kind: `landing`)
- [ ] Blog index (`/blog`, kind: `blog`)
- [ ] Each primary service page (kind: `service`)
- [ ] Location pages if applicable (kind: `location`)

Blog posts are auto-synced to SitePage when published — no manual entry needed.

---

## Phase 5: Industry Configuration

Customizes the scoring engine for the client's vertical. Without this, generic defaults are used (still functional, but less precise).

| Field | Purpose | Examples by Industry |
|-------|---------|---------------------|
| industry | Vertical identifier | "legal", "hvac", "dental", "saas", "construction" |
| credentialKeywords | E-E-A-T credential detection | **Legal:** "JD", "Bar Association", "Esq", "admitted" / **Medical:** "MD", "Board Certified", "HIPAA" / **Trade:** "EPA Certified", "Master Electrician", "Licensed Contractor" |
| geographicTerms | Local authority scoring | "Chicago", "Cook County", "Illinois", "Chicagoland" |
| knownEntities | Entity relationship scoring | **Legal:** "ABA", "Westlaw", "SCOTUS" / **HVAC:** "EPA", "ENERGY STAR", "Carrier", "Trane" / **SaaS:** "AWS", "Stripe", "Gartner" |
| authorityDomains | Outbound link quality | **Legal:** "courts.gov", "law.cornell.edu" / **Medical:** "nih.gov", "cdc.gov" / **Trade:** "osha.gov", "epa.gov" |

- [ ] Industry vertical set
- [ ] Credential keywords added (5-15 relevant terms)
- [ ] Geographic terms added (city, county, state, region)
- [ ] Known entities listed (5-20 industry authorities)
- [ ] Authority domains listed (3-10 trusted sources)

---

## Phase 6: Authors

Authors power E-E-A-T scoring, blog attribution, and Person schema markup.

| Field | Required | Example |
|-------|----------|---------|
| name | Yes | "Jane Smith" |
| slug | Yes | "jane-smith" |
| jobTitle | Recommended | "Managing Partner" |
| bio | Recommended | "Jane Smith is a personal injury attorney with 20+ years of trial experience..." |
| credentials | Recommended | ["JD, Northwestern Law", "Illinois State Bar", "Super Lawyers 2024"] |
| experience | Recommended | "20+ years in personal injury litigation" |
| expertise | Optional | ["personal injury", "workers compensation", "medical malpractice"] |
| canonicalUrl | Optional | "/about#jane-smith" or "/team/jane-smith" |
| sameAs | Optional | ["https://linkedin.com/in/janesmith", "https://avvo.com/..."] |
| isDefault | Yes (one) | true for the primary author |

- [ ] At least one author created with `isDefault: true`
- [ ] Credentials and experience filled in (drives E-E-A-T scoring)
- [ ] LinkedIn / professional profiles added to `sameAs`

---

## Phase 7: Tracked Keywords

The keywords the platform monitors for position tracking, content gap analysis, and AI advisor context.

**Tier strategy:**
| Tier | Count | Purpose | Example |
|------|-------|---------|---------|
| tier1 | 5-10 | Money keywords (highest conversion intent) | "personal injury lawyer chicago" |
| tier2 | 7-15 | Secondary commercial keywords | "workers comp attorney near me" |
| tier3 | 10-20 | Long-tail / blog targets | "how long does a personal injury case take" |

**For each keyword, set:**
- `keyword` — the search phrase
- `tier` — tier1 / tier2 / tier3
- `intent` — transactional / commercial / informational / navigational
- `targetPage` — which page should rank (e.g., "/practice-areas/personal-injury")
- `volume` — search volume estimate ("500-1K", "1K-5K", etc.)
- `competition` — low / medium / high

- [ ] 5-10 tier1 money keywords added
- [ ] 7-15 tier2 secondary keywords added
- [ ] 10-20 tier3 long-tail keywords added
- [ ] Each keyword mapped to a target page
- [ ] Intent correctly categorized

---

## Phase 8: Keyword Clusters

Group keywords into pillar/spoke topic clusters for authority scoring.

| Field | Example |
|-------|---------|
| name | "Personal Injury" |
| pillarPage | "/practice-areas/personal-injury" |
| seedKeyword | "personal injury lawyer chicago" |

Subtopics can be auto-generated via the Topic Clusters tab (uses Claude to generate 8-15 subtopics from the seed keyword).

- [ ] 3-6 keyword clusters created
- [ ] Each cluster has a pillar page assigned
- [ ] Tracked keywords assigned to their cluster via `clusterId`
- [ ] Run "Generate Subtopics" from the dashboard to populate cluster content map

---

## Phase 9: Competitors

Track 3-5 competitors for content gap analysis and benchmarking.

| Field | Example |
|-------|---------|
| domain | "competitor-lawfirm.com" |
| name | "Johnson & Partners" |
| isActive | true |

- [ ] 3-5 competitor domains added
- [ ] Marked as active
- [ ] Run initial competitor analysis from the Competitors tab

---

## Phase 10: Integrations

### Google Search Console (Required for position tracking)

**Option A: Environment variables (single-tenant)**
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=seo-bot@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY=-----BEGIN PRIVATE KEY-----\n...
GOOGLE_SEARCH_CONSOLE_SITE=sc-domain:clientx.com
```

**Option B: Database credentials (multi-tenant)**
Create an `IntegrationCredential` record:
- type: `google_search_console`
- property: `sc-domain:clientx.com`
- authType: `service-account`
- encryptedCredentials: service account JSON

**Setup steps:**
1. Create a GCP project and enable Search Console API
2. Create a service account and download the JSON key
3. Add the service account email as a user in Search Console (Full permission)
4. Store credentials via env vars or DB

- [ ] Service account created in GCP
- [ ] Search Console API enabled
- [ ] Service account added as user in GSC property
- [ ] Credentials stored (env or DB)
- [ ] Test connection from Settings > SEO > Search Console

### PageSpeed Insights (Optional but recommended)

```env
PAGESPEED_API_KEY=AIzaSy...
```

- [ ] API key created in GCP Console (PageSpeed Insights API)
- [ ] Key added to environment

### Email — Resend (Required for reports & notifications)

```env
RESEND_API_KEY=re_...
```

- [ ] Resend account created
- [ ] Domain verified in Resend
- [ ] API key added to environment

---

## Phase 11: Email Configuration

Configure who sends and receives emails for this site.

| Field | Purpose | Example |
|-------|---------|---------|
| fromAddress | Sender for all transactional email | "Smith & Associates \<hello@smithlaw.com\>" |
| notifyRecipients | Receives contact/quote form alerts | "jane@smithlaw.com, intake@smithlaw.com" |
| reportFromEmail | Sender for SEO digest reports | "seo@smithlaw.com" |
| reportToEmail | Receives weekly SEO reports | "jane@smithlaw.com" |

- [ ] From address set (must match verified Resend domain)
- [ ] Notification recipients configured
- [ ] Report recipients configured
- [ ] Test email sent successfully from Settings

---

## Phase 12: First Run & Verification

Run each system manually to verify everything works before the weekly cron takes over.

1. **Crawl** — SEO Dashboard > Site Audit > Run Crawl
   - [ ] Crawl completes without errors
   - [ ] Pages are discovered and scored

2. **Snapshot** — SEO Dashboard > Overview > Take Snapshot
   - [ ] Health score calculated
   - [ ] GSC data pulls correctly (if configured)

3. **Insights** — SEO Dashboard > Insights > Generate
   - [ ] Insights generated (freshness, linking, E-E-A-T gaps)

4. **AI Visibility** — SEO Dashboard > AI Visibility > Score a page
   - [ ] Page scored with correct brand name and geographic terms

5. **Citations** — SEO Dashboard > Citations > Run Check
   - [ ] Citation queries built from business context
   - [ ] Results returned from at least one AI platform

6. **Report** — SEO Dashboard > Overview > Preview Report
   - [ ] Report renders with correct company branding
   - [ ] Send test report to verify email delivery

---

## Post-Onboarding

Once all phases are complete:

- The **weekly cron** (Monday 6 AM UTC) handles: snapshot, crawl, insights, citation checks, email report
- The **AI Advisor** uses all configured context for recommendations
- **Blog generation** uses business profile, author, and keywords for AI-first content
- **Topic Clusters** can be generated and scored automatically
- **Competitor analysis** runs on-demand from the dashboard

### Ongoing maintenance:
- Update tracked keywords quarterly (add new, archive stale)
- Review and act on weekly insights
- Add new competitors as they emerge
- Update business profile when services/locations change
- Add new authors as team grows

---

## Data Model Reference

```
Tenant
  +-- Membership (userId + role)
  +-- Site
       +-- BusinessProfile (1:1)
       +-- IndustryConfig (1:1)
       +-- EmailConfig (1:1)
       +-- Author (1:many)
       +-- ExperienceEvidence (1:many)
       +-- SitePage (1:many)
       +-- TrackedKeyword (1:many)
       |    +-- KeywordCluster (1:many)
       |         +-- ClusterSubtopic (1:many)
       +-- CompetitorDomain (1:many)
       |    +-- CompetitorAnalysis (1:many)
       +-- IntegrationCredential (1:many)
       +-- BlogPost (1:many)
       +-- [Auto-generated SEO data]
            +-- SeoSnapshot, SeoCrawlRun, SeoPageAudit
            +-- AIVisibilityScore, SeoInsight
            +-- AICitation, InternalLinkSuggestion
```

All child models cascade delete when a Site is removed.
