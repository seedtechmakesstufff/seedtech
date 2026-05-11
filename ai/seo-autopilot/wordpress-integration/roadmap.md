# WordPress + Client Management Roadmap

What's built, what's next, and in what order. Items are grouped by theme and sequenced by dependency and value.

---

## Current state (Phase 11 — shipped)

- [x] WordPress REST API client (`wordpress.ts`) — fetchWpPosts, fetchWpPages, testWpConnection
- [x] Read-only content sync (`wordpress-sync.ts`) — upserts BlogPost + SitePage, idempotent
- [x] Application Password auth — encrypted credential storage, same pattern as Google OAuth
- [x] Daily cron 06:00 UTC — iterates all sites, silently skips non-WP sites
- [x] Manual sync trigger via admin UI
- [x] WordPress connection panel in `/admin/seo/settings/integrations`
- [x] Yoast SEO field mapping (metaTitle, metaDescription, focusKeyword)
- [x] `wordPressPostId` + `wordPressSiteUrl` columns on `BlogPost`
- [x] `wordpress.sync_completed` + `wordpress.sync_failed` event types
- [x] All 10 agents work against WP-sourced content with zero agent changes

---

## WordPress — Near-term improvements

### WP-1: Incremental sync (by modified date)

**What:** Pass `?after={lastSyncAt}` to the WP REST API so only posts modified since last sync are fetched.

**Why:** Sites with 500+ posts hit 5+ API pages every daily cron run. Incremental sync reduces this to near-zero for unchanged posts.

**How:**
- Store `lastSyncAt` timestamp on `IntegrationCredential.updatedAt` (already exists)
- Pass it to `fetchWpPosts(creds, { since: lastSyncAt })`
- `fetchWpPosts` already accepts `opts.since` — just needs to be wired up in `syncWordPressForSite`

**Effort:** 1–2 hours. Low risk.

---

### WP-2: Write-back — publish approved drafts to WordPress

**What:** When a `blog_draft` artifact is approved for a WordPress client site, automatically create or update the post in WordPress via `POST /wp-json/wp/v2/posts`.

**Why:** Closes the copy-paste loop. The agency reviews and approves in SeedTech; WordPress gets the post automatically. The next sync reconciles it as published.

**How:**
- Add a `wordpressPublish` flag to `BlogDrafterOptions`
- Extend the `blog_draft` publisher in `agent-artifact-publishers.ts`:
  - If site has active WordPress credential and post has a `targetSlug`:
    - Convert Markdown body to HTML (`remark` or simple converter)
    - `POST /wp-json/wp/v2/posts` with `{ title, content, slug, status: "draft", meta: { _yoast_wpseo_focuskw } }`
    - Store the returned WP post ID in `BlogPost.wordPressPostId`
  - Otherwise: existing flow (create BlogPost with status=draft for manual copy)
- The inbox approval UI would need a toggle: "Publish to WordPress" vs. "Save as draft only"

**Dependencies:** WP-1 (so the published post is picked up on next sync)
**Effort:** 4–6 hours. Medium complexity (Markdown → HTML conversion edge cases).

---

### WP-3: Internal link write-back to WordPress

**What:** When `link_suggestions` artifacts are approved, apply the link insertions to the actual WordPress post body via the WP REST API (`PATCH /wp-json/wp/v2/posts/{id}`).

**Why:** Right now, approved link suggestions update `BlogPost.body` in SeedTech but the change never reaches WordPress. The value of the Internal Link Agent is wasted unless the links actually appear on the live site.

**How:**
- The `link_suggestions` publisher already calls `applyLinkSuggestions()` to edit `BlogPost.body`
- Add a second step: if `wordPressPostId` is set, PATCH the WP post with the updated HTML
- Must convert from Markdown (SeedTech body) back to HTML for WP, OR keep WP posts as HTML in body

**Note:** This is the most impactful write-back feature for existing WP clients. Internal link equity is immediate.

**Effort:** 3–4 hours. Requires WP-2 design decision (Markdown vs HTML body format).

---

### WP-4: WordPress.com OAuth support

**What:** Support wordpress.com hosted sites, which require OAuth2 via the Automattic API (`public-api.wordpress.com`).

**Why:** Some clients will be on wordpress.com managed hosting. Application Passwords only work for self-hosted.

**How:**
- Register a Jetpack/WordPress.com OAuth app at developer.wordpress.com
- Add `WORDPRESS_COM_CLIENT_ID` + `WORDPRESS_COM_CLIENT_SECRET` env vars
- New connect flow: `/api/integrations/wordpress-com/connect` → OAuth redirect → callback → store token
- `fetchWpPosts` detects `siteUrl.includes('wordpress.com')` and uses Bearer token instead of Basic auth

**Effort:** 6–8 hours. Low complexity but new OAuth flow to test.

---

### WP-5: WordPress category/tag → topic cluster mapping

**What:** When syncing WP posts, read their categories and tags and attempt to map them to existing `KeywordCluster` rows (by name similarity).

**Why:** Gives the Brief Generator and Internal Link Agent cluster context for WP-sourced posts — more precise cross-linking within topic areas.

**How:**
- Fetch category names from WP posts (`/wp-json/wp/v2/categories?include=1,2,3`)
- Fuzzy-match category names to `KeywordCluster.name` (TF-IDF or simple string match)
- Set `BlogPost.clusterId` when a match is found above a threshold

**Effort:** 3–4 hours.

---

### WP-6: Webhook listener for real-time sync

**What:** A webhook endpoint (`/api/webhooks/wordpress`) that WordPress calls on post publish/update, triggering an immediate single-post sync.

**Why:** Eliminates the 24-hour delay between publishing in WordPress and the post appearing in SeedTech. Important once write-back (WP-2) is live.

**How:**
- WordPress plugin (this one requires a small plugin — JSON POST to a webhook URL)
- Or: use the `publish_post` hook via the REST API's `after_insert_post` action if the site has WP Engine's webhook feature
- Add `POST /api/webhooks/wordpress?siteId={id}&secret={token}` route
- Verify HMAC signature, sync only the changed post by ID

**Effort:** 4–5 hours. Requires the one plugin use-case in this roadmap.

---

## Client Management — Near-term improvements

### CM-1: Agency clients list page

**What:** A dedicated `/admin/clients` page that shows all sites (clients) in a table: name, domain, last agent run, pending artifacts count, WordPress connected, Google connected.

**Why:** The site switcher dropdown works for 2–3 sites but becomes unwieldy at 10+. An overview page lets the agency see at a glance which clients need attention (pending inbox, last run, errors).

**Design:**
```
/admin/clients
┌─────────────────────┬────────────┬────────────┬──────────┬────────────┐
│ Client              │ Domain     │ Last Run   │ Pending  │ Connected  │
├─────────────────────┼────────────┼────────────┼──────────┼────────────┤
│ Acme Trucking       │ acme.com   │ 2h ago     │ 3 items  │ WP + GSC   │
│ Johnson Law Firm    │ jlaw.com   │ 5d ago     │ 0 items  │ GSC + GBP  │
│ SeedTech LLC        │ seedtech.. │ 1h ago     │ 7 items  │ GSC + GA4  │
└─────────────────────┴────────────┴────────────┴──────────┴────────────┘
```

Click a row → switches to that site and navigates to `/admin`.

**Effort:** 4–6 hours (new page + API endpoint aggregating per-site stats).

---

### CM-2: Per-client agent schedule customization

**What:** Let each site opt out of specific agents or change run frequency. For example, a small client may not need Blog Drafter to run daily if they can only review once a week.

**Why:** Reduces noise in the inbox for clients who don't need every agent. Prevents weekly digest fatigue.

**How:**
- Add `AgentConfig` table: `{ siteId, agentKey, enabled, cronOverride }`
- Cron endpoints check `AgentConfig.enabled` before running
- UI in `/admin/seo/settings` → Agent Schedule sub-page

**Effort:** 6–8 hours. Requires cron changes and a settings UI.

---

### CM-3: Client-facing read-only report view

**What:** A shareable read-only URL (`/reports/{siteSlug}?token={jwt}`) that shows the client a monthly SEO summary without giving them access to the admin.

**Why:** Right now the weekly digest email is the only client-visible output. A shareable link gives clients an on-demand view of rankings, content performance, and recent agent activity without a login.

**Contents:** keyword rankings, top traffic pages, pending artifacts, recent published content, AI visibility score trend.

**Effort:** 8–12 hours. New auth pattern (JWT-based read-only token).

---

### CM-4: Multi-user access per client

**What:** Invite a client (or a client's employee) to their specific site with a `viewer` role — read-only access to their site's data only.

**Why:** Some clients want to log in and see their own data. The Membership model already supports roles (owner/admin/editor/viewer) but there is no invite flow per site yet.

**Current state:** `UserInvite` model exists. `POST /api/admin/team` exists. No UI for inviting external users to a specific site (only the same tenant).

**How:**
- Extend invite to support cross-tenant view access (or create a "client" role that scopes to one site)
- Add invite UI to `/admin/settings` → Team

**Effort:** 8–12 hours. Auth model complexity.

---

### CM-5: Billing / subscription tracking

**What:** Track which sites are on which service tier (basic vs. pro), and surface this in the agency clients dashboard.

**Why:** As the number of client sites grows, the agency needs visibility into who is being billed for what — especially if different clients get different agent cadences or inbox depths.

**Note:** No Stripe integration is planned yet. This could start as a simple `Site.tier` string field (basic/pro/enterprise) and a display label in the clients list, without touching payments.

**Effort:** 2–3 hours for the field + UI label. Full billing: separate initiative.

---

## Priority order (recommended)

| Priority | Item | Why |
|---|---|---|
| 1 | WP-1: Incremental sync | Quick win — fixes performance for large WP sites immediately |
| 2 | CM-1: Agency clients list | Operational necessity once you have 5+ clients |
| 3 | WP-2: Write-back draft publish | Closes the biggest manual loop in the WP workflow |
| 4 | WP-3: Internal link write-back | Makes the Internal Link Agent actually change the WP site |
| 5 | CM-2: Per-client agent schedule | Reduces inbox noise for smaller clients |
| 6 | WP-5: Category → cluster mapping | Improves agent context quality for WP clients |
| 7 | CM-3: Client report view | Client-facing output beyond email digest |
| 8 | WP-4: WordPress.com OAuth | Unlocks a new hosting segment |
| 9 | WP-6: Webhook real-time sync | Only valuable after write-back is live |
| 10 | CM-4: Multi-user per site | Nice to have; complex auth work |
| 11 | CM-5: Billing tracking | Business operations, not product |
