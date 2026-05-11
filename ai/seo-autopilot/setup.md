# SEO Autopilot — Setup

What to configure to bring a new environment (or a new client site) online.

---

## 1. Environment variables

Add to `.env.local` and to Vercel project settings.

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `DIRECT_DATABASE_URL` | Neon direct (for migrations) |
| `CLAUDE_API_KEY` | Anthropic API — every agent uses this |
| `CREDENTIAL_ENCRYPTION_KEY` | 32 bytes hex. Encrypts stored OAuth refresh tokens. **Never lose this.** |
| `GOOGLE_OAUTH_CLIENT_ID` | OAuth web client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | OAuth web client secret |
| `GOOGLE_OAUTH_REDIRECT_URI` | e.g. `https://seedtechllc.com/api/integrations/google/callback` |
| `RESEND_API_KEY` | Weekly digest email |
| `RESEND_FROM_EMAIL` | Verified sender |
| `DIGEST_RECIPIENTS` | Comma-separated fallback when no per-tenant `EmailConfig` exists |
| `WEEKLY_DIGEST_BASE_URL` | Base URL embedded in digest links. **Prefer this over `NEXTAUTH_URL`** — dev servers capture the wrong port |
| `NEXTAUTH_URL` | Auth callbacks |
| `NEXTAUTH_SECRET` | JWT signing |
| `CRON_SECRET` | Validates `/api/cron/*` requests (`authenticateCron()`) |

Generate the encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 2. Database migrations

Phase 8 migrations are manual SQL files (idempotent — they use `IF NOT EXISTS`):

```bash
export DATABASE_URL=$(grep ^DATABASE_URL .env.local | cut -d= -f2- | sed 's/^"//;s/"$//')
psql "$DATABASE_URL" -f prisma/migrations/manual/phase8-gbp-ga4-oauth-foundation.sql
psql "$DATABASE_URL" -f prisma/migrations/manual/phase8-event-log.sql
psql "$DATABASE_URL" -f prisma/migrations/manual/phase8-agent-artifacts.sql
psql "$DATABASE_URL" -f prisma/migrations/manual/phase9-research-signals.sql
psql "$DATABASE_URL" -f prisma/migrations/manual/phase10-agent-runs.sql
psql "$DATABASE_URL" -f prisma/migrations/manual/phase11-wordpress.sql
npx prisma generate
```

All manual migrations are idempotent (`IF NOT EXISTS`). Safe to re-run.

---

## 3. Google Cloud — OAuth client + APIs

Enable in **APIs & Services → Library**:
- Google Search Console API
- Google Analytics Admin API
- Google Analytics Data API (GA4)
- Google My Business Account Management API
- Google My Business Business Information API
- Google Business Profile Performance API

**OAuth consent screen.** External, with scopes:
- `https://www.googleapis.com/auth/webmasters.readonly`
- `https://www.googleapis.com/auth/analytics.readonly`
- `https://www.googleapis.com/auth/business.manage`

Add the admin email as a test user while in dev. Production verification with Google can take 2–6 weeks for `business.manage` — start early.

**Credentials → Create OAuth client ID (Web application).** Authorized **redirect URIs** (not "JavaScript origins"):
- `https://seedtechllc.com/api/integrations/google/callback`
- `http://localhost:3000/api/integrations/google/callback`
- Add one per client domain.

**Apply for GBP API access.** https://developers.google.com/my-business/content/prereqs#request-access — 1–2 week approval. GSC + GA4 work without it; GBP calls will 403 until approved.

> ⚠️ **STATUS (May 2026): GBP Posts API access is PENDING REVIEW.**
> Application submitted 2026-05-10 for Google Cloud project `109976704072` (SeedTech SEO Autopilot).
> The legacy `mybusiness.googleapis.com/v4` API was deprecated by Google and is no longer available in the API Library.
> All GBP post publishing will fail with 403 until Google approves access.
> **GSC, GA4, GBP sync (read), and review replies are unaffected — only post publishing is blocked.**
> Once approved, re-approve any `failed` gbp_post_draft artifacts from the Inbox to publish them.

---

## 4. Connect a WordPress site (optional)

For clients with an existing WordPress site:

1. In WordPress admin: **Users → Profile → Application Passwords** → create a password named "SeedTech SEO Autopilot".
2. In SeedTech: `/admin/seo/settings/integrations` → **WordPress** panel → enter Site URL, username, and Application Password → **Connect & Test**.
3. Click **Sync now** to pull posts immediately, or wait for the daily cron (06:00 UTC).
4. Verify: `SELECT COUNT(*) FROM blog_posts WHERE "wordPressSiteUrl" IS NOT NULL AND "siteId" = '<id>';`

**Path prefix:** If the client's WordPress posts live at `/slug` (not `/blog/slug`), set path prefix to empty string in the connect form.

**Yoast SEO:** If the client has Yoast, focus keywords and meta fields sync automatically. Otherwise, `targetKeyword` is derived from the post slug.

---

## 5. Connect a site (Google integrations)

1. Sign in as admin, switch to the target site.
2. `/admin/seo/settings/integrations` → click **Connect Google** → consent screen → redirect back with success.
3. Verify: `SELECT "siteId", "type", "authType", "isActive" FROM "integration_credentials" WHERE "authType"='oauth';`
4. Pick a GA4 property (if multiple) → saves to `Site.ga4PropertyId`.
5. Pick a GBP location → creates a `GbpLocation` row.
6. Smoke test: trigger manual syncs from the same page (`/api/admin/integrations/ga4/sync`, `/api/admin/integrations/gbp/sync`).

---

## 6. Smoke-test the agent pipeline

From `/admin/seo/agents`:

1. **Run Industry Researcher** → should write a handful of `ResearchSignal` rows (status=fresh).
2. **Run Strategy Analyst** → writes a `SeoStrategyDoc` (source=`ai-strategy-analyst`).
3. **Run Brief Generator** → 2–3 `content_brief` artifacts in `/admin/inbox/[week]`.
4. Approve a brief → **Run Blog Drafter** → `blog_draft` artifact appears.
5. Approve the draft → `BlogPost` row created with `status="draft"`.
6. **Run Weekly Digest** → check the email lands at `DIGEST_RECIPIENTS` (or the tenant's `EmailConfig.notifyRecipients`).

Or hit **Run all weekly agents** to chain steps 1–6 in dependency order.

---

## 7. Configure per-tenant digest recipients

`/admin/seo/agents` → **Digest** tab → Recipients. Backed by `EmailConfig.notifyRecipients` (comma-separated). Without DB config, falls back to the `DIGEST_RECIPIENTS` env var.

---

## 8. Local development

```bash
npm install
npx prisma generate
npm run dev        # http://localhost:3000
npm test           # vitest (41 tests)
npm run lint
```

If you see `"Cannot read properties of undefined (reading 'findMany')"` after a schema change, the dev server cached a stale Prisma client: stop the server, run `npx prisma generate`, restart.

If Next.js complains about deleted routes, clear cache: `rm -rf .next/types`.
