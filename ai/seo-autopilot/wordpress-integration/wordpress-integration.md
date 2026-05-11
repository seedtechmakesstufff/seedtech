# WordPress Integration Guide

How to connect a WordPress client site to SEO Autopilot so agents can analyze their existing content, surface decay signals, suggest internal links, generate new content briefs, and run the full weekly intelligence pipeline.

---

## Does the client need to install a plugin?

**No plugin required.** The integration uses the WordPress REST API, which has been built into every WordPress install since version 4.7 (2016). Any self-hosted WordPress site running 5.6 or higher supports Application Passwords — the auth mechanism this integration uses — out of the box, with no plugin needed.

**Yoast SEO plugin (optional).** If the client has Yoast installed, the sync automatically picks up their focus keyword and meta title/description fields from the Yoast sidecar. Without Yoast, `targetKeyword` is derived from the post slug and `metaTitle`/`metaDescription` are left blank until agents fill them in.

---

## How it works (architecture overview)

```
WordPress Site                 SEO Autopilot
──────────────────             ────────────────────────────────────────
GET /wp-json/wp/v2/posts   →   BlogPost rows (upserted by slug)
GET /wp-json/wp/v2/pages   →   SitePage rows (upserted by path)
                           →   syncBlogPostsToSitePages()
                           →   All 10 agents run on real content
```

Sync is **one-way: WordPress → SeedTech**. WordPress is still the client's CMS. SEO Autopilot is the intelligence layer that reads it, analyzes it, and generates artifacts (briefs, drafts, link suggestions) for human review. The client never needs to log into SeedTech — that is the agency's workspace.

---

## Auth — Application Password

WordPress Application Passwords were added in WordPress 5.6 (December 2020). They are separate from the account password, scoped to API access, and can be revoked independently.

**Where to create one:**
1. WordPress admin → **Users** → **Profile** (or any user's edit page)
2. Scroll to **Application Passwords**
3. Enter a name: `SeedTech SEO Autopilot`
4. Click **Add New Application Password**
5. Copy the password shown — it is only shown once

The password looks like: `AbCd EfGh IjKl MnOp QrSt UvWx`

**What permission level is needed?** The Application Password inherits the user's role. An **Editor** role is sufficient for read-only access to posts and pages. Admin credentials are not required.

**Security:**
- Credentials are encrypted with AES-256-GCM before being stored in the database (`CREDENTIAL_ENCRYPTION_KEY` env var)
- The password is never logged or returned in API responses after the initial connect
- Revoke the password from WordPress at any time without affecting the client's login

---

## Setup walkthrough

### Step 1 — Create the client site in SeedTech

1. Open the **site switcher** (top of the left sidebar in `/admin`) → **Add new site**
2. Complete the 4-step wizard: site name, domain, business profile, template
3. After creation, the new site is automatically selected

The site switcher is the entry point for all client management. Each client = one `Site` in the platform. You switch between clients using this dropdown. See [Client Management](#client-management) below for full details.

### Step 2 — Connect WordPress

Navigate to: **SEO → SEO Settings → Integrations → WordPress panel**
Path: `/admin/seo/settings/integrations`

Fill in:

| Field | Example | Notes |
|---|---|---|
| Site URL | `https://clientsite.com` | No trailing slash |
| WordPress username | `admin` | The WP user who created the Application Password |
| Application Password | `AbCd EfGh IjKl...` | Spaces are fine |
| Blog path prefix | `/blog` | How posts map to SitePage paths — see below |

Click **Connect & Test**. The platform calls `/wp-json` to verify credentials before saving. If the test fails, check: (1) the site URL is publicly reachable, (2) the Application Password belongs to the specified user, (3) the REST API is not blocked by a security plugin (Wordfence, iThemes, etc.).

### Step 3 — Run the first sync

Click **Sync now** in the WordPress panel. This:
- Fetches all published posts (paginated, 100 per page)
- Upserts each into `BlogPost` matched by `(siteId, slug)`
- Fetches all published pages → upserts into `SitePage`
- Calls `syncBlogPostsToSitePages()` to complete the path inventory
- Logs a `wordpress.sync_completed` event

A site with 200+ posts may take 30–90 seconds on the first sync.

**Verify:**
```sql
SELECT COUNT(*) FROM blog_posts WHERE "wordPressSiteUrl" IS NOT NULL AND "siteId" = '<id>';
SELECT COUNT(*) FROM site_pages WHERE source = 'wordpress' AND "siteId" = '<id>';
```

### Step 4 — Connect Google (recommended)

For decay detection and keyword tracking to work, also connect at `/admin/seo/settings/integrations`:
- **Google Search Console** — keyword position data, joined to posts by `/blog/{slug}` URL
- **Google Analytics 4** — session and conversion data, same URL join key

The WordPress `slug` must match the URL path that GSC/GA4 reports. See [Path prefix](#path-prefix--critical-for-gscga4-alignment) below.

### Step 5 — Run the agent pipeline

From `/admin/seo/agents` → **Run all weekly agents** (or individually):

1. **Industry Researcher** — RSS signals for the client's vertical
2. **Strategy Analyst** — keywords + GBP + citations → strategy brief
3. **Brief Generator** — deduplicates against all synced WP posts, generates new content briefs
4. **Content Decay Watcher** — finds WP posts losing traffic or position
5. **Internal Link Agent** — TF-IDF over all WP post bodies → cross-link suggestions
6. **Keyword Scout** — surfaces GSC queries not currently tracked
7. **Blog Drafter** — turns approved briefs into full draft posts

All artifacts queue in `/admin/inbox`. Review and approve. Approved `blog_draft` artifacts create a `BlogPost` in SeedTech with `status=draft` — ready to copy into WordPress and publish.

---

## What syncs

| WordPress field | BlogPost field | Notes |
|---|---|---|
| `slug` | `slug` | Match key — must be stable |
| `title.rendered` | `title` | HTML-decoded |
| `content.rendered` | `body` | Full HTML stored as-is |
| `excerpt.rendered` | `excerpt` | HTML-decoded |
| `date` | `publishedAt` | ISO date |
| `modified` | `updatedAt` | Skip-if-unchanged idempotency key |
| `yoast_head_json.title` | `metaTitle` | Yoast only; blank otherwise |
| `yoast_head_json.description` | `metaDescription` | Yoast only; blank otherwise |
| `meta._yoast_wpseo_focuskw` | `targetKeyword` | Yoast focus keyword; slug-derived fallback |
| `id` | `wordPressPostId` | Reconciliation key |
| (computed) | `wordCount` | Stripped from HTML |
| (constant) | `status` | Always `"published"` |
| (constant) | `category` | Set to `"wordpress"` on creation |

**What does NOT sync:**
- WordPress categories and tags
- WordPress author (left blank; set manually in SeedTech if needed)
- Scheduled or draft posts (only `status=publish` fetched)
- Media / images (URLs remain in body HTML; not downloaded)

---

## Path prefix — critical for GSC/GA4 alignment

SEO Autopilot joins GSC and GA4 data to `BlogPost` rows using the URL path pattern `/blog/{slug}`. The **blog path prefix** setting controls how WP slugs become `SitePage.path` entries.

| WordPress permalink structure | Path prefix setting | SitePage.path result |
|---|---|---|
| `https://client.com/blog/post-slug` | `/blog` (default) | `/blog/post-slug` |
| `https://client.com/post-slug` | `` (empty) | `/post-slug` |
| `https://client.com/resources/post-slug` | `/resources` | `/resources/post-slug` |

If this is wrong, decay detection and GSC metrics will not surface for any WP posts. Fix: disconnect → reconnect with correct prefix → sync again (idempotent).

---

## Ongoing sync

| Trigger | Schedule | What happens |
|---|---|---|
| Cron | Daily 06:00 UTC | Fetches all posts; skips unchanged posts (wordPressPostId + modifiedAt match) |
| Manual | Any time | Full sync via Sync now button |

Sites without a WordPress credential are silently skipped by the cron — no errors for Google-only clients.

---

## Agent compatibility

| Agent | WordPress benefit | Notes |
|---|---|---|
| Industry Researcher | None — reads RSS feeds | — |
| Strategy Analyst | Indirect — reads GSC/GA4/GBP | GSC + GA4 needed |
| Brief Generator | Deduplicates against all WP posts | Posts must be synced |
| Blog Drafter | Aware of existing posts via brief context | — |
| GBP Post Drafter | Unrelated to WordPress | GBP needed |
| GBP Review Reply | Unrelated to WordPress | GBP needed |
| Keyword Scout | Mines GSC for untracked queries | GSC needed |
| Content Decay Watcher | **Finds decaying WP posts** — biggest immediate win | Posts + GSC + GA4 |
| Internal Link Agent | **TF-IDF over all WP post bodies** — systematic cross-linking | Posts synced (full body) |
| Weekly Digest | Summarizes all pending artifacts for the week | — |

**Highest value for WordPress clients:** Content Decay Watcher (existing post health) and Internal Link Agent (cross-linking an existing corpus that has never been linked systematically).

---

## Client management

All client management lives inside the **SeedTech admin dashboard** (`/admin`). There is no separate client portal — the agency operates the platform on behalf of clients.

### How clients map to the data model

```
Tenant (your agency account)
  └─ Site 1 (Client A — clienta.com)
  └─ Site 2 (Client B — clientb.com)
  └─ Site 3 (your own site — seedtechllc.com)
```

Every piece of data (keywords, posts, agents, artifacts, GBP, GSC, GA4) is scoped to a `Site`. Switching between clients switches the data context for every page in the admin.

### Adding a new client

**Path:** `/admin/sites/new` or site switcher → **Add new site**

4-step wizard:
1. **Site Info** — name, domain, site URL
2. **Business Profile** — company name, service area, primary services, USP (powers all AI prompts)
3. **Template** — pre-fills tracked keywords, content ideas, and page inventory by industry (MSP, law, restaurant, trucking, blank)
4. **Create** → redirects to the SEO dashboard for the new site

After creation, go immediately to `/admin/seo/settings/integrations` to connect Google and/or WordPress.

### Switching between clients

The **SiteSwitcher** dropdown sits at the top of the left sidebar, always visible in `/admin`. Click it to see all your sites, then click to switch. The page refreshes and all data (keywords, artifacts, agents, blog posts) reflects the selected client.

### Editing a client's business profile

`/admin/settings` (while the client site is active) — company name, tone of voice, services, USP, custom AI instructions, logo. This profile is injected into every agent prompt, so keeping it accurate for each client is important.

### Per-client SEO settings

`/admin/seo/settings` has sub-pages:
- **Integrations** — Google (GSC + GA4 + GBP) and WordPress
- **Business Profile** — same as Settings, accessible from the SEO context
- **Industry Config** — credential keywords, geographic terms, authority domains for scoring
- **Digest Recipients** — who receives the weekly digest email for this client

### Current limitations in client management

There is no dedicated **Clients List** page yet. You manage clients via the site switcher dropdown. The roadmap includes a proper agency clients dashboard — see [roadmap.md](roadmap.md).

---

## Limitations (current phase)

- **Read-only sync.** Approved blog drafts create a `BlogPost` in SeedTech with `status=draft`. You must manually copy content into WordPress and publish. The next sync imports it back as published (matched by slug).
- **No webhook / real-time push.** WP changes take up to 24 hours to appear in SeedTech (or sync manually).
- **Self-hosted only.** WordPress.com hosted sites require a different OAuth2 flow not yet built.
- **HTML body, not Markdown.** WP posts are stored as HTML. Agents handle TF-IDF over HTML fine, but the Blog Drafter writes Markdown. Convert before pasting into Gutenberg, or paste into the HTML block.
- **No incremental sync.** Each sync refetches all posts and skips unchanged ones by comparing IDs. On large sites (500+ posts), this makes every cron run do 5+ API pages. Incremental sync using `?after=modified_date` is a near-term improvement.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "Connection failed: 401" | Wrong username or wrong Application Password | Re-check — Application Password must belong to the specified username |
| "Connection failed: 403" | Security plugin blocking REST API | Whitelist the SeedTech IP in Wordfence or iThemes Security |
| "Connection failed: 404" | REST API disabled or wrong site URL | Visit `https://client.com/wp-json` in browser — should return JSON |
| Posts synced but no keyword/GSC data | Path prefix mismatch | Reconnect with correct `pathPrefix`, re-sync |
| `targetKeyword` blank after sync | Yoast not installed, slug too short | Manually set on important posts in `/admin/blog` |
| Sync shows 0 posts | Site is WordPress.com hosted | Not supported yet — self-hosted only |
| Posts missing from sync | Posts are drafts or scheduled, not published | Only `status=publish` is fetched |

---

## File map

```
src/lib/
  wordpress.ts               REST API client
  wordpress-sync.ts          Sync orchestrator

src/app/api/
  admin/integrations/wordpress/connect/route.ts   GET | POST | DELETE
  admin/integrations/wordpress/sync/route.ts      POST (manual trigger)
  cron/wordpress-sync/route.ts                    GET (daily 06:00 UTC)

src/app/admin/seo/settings/integrations/
  WordPressPanel.tsx          Connection form + connected state UI

prisma/migrations/manual/
  phase11-wordpress.sql       Schema additions (idempotent)
```
