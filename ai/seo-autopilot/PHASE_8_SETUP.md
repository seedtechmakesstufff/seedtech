# Phase 8 — Agentic Foundation Setup

This is the first PR in the agentic-autopilot roadmap. It adds:

- New `google_business_profile` integration type
- DB tables: `gbp_locations`, `gbp_posts`, `gbp_reviews`, `gbp_metrics_daily`, `page_metrics`
- AES-256-GCM encryption helper for stored credentials
- Google OAuth user-consent flow (one consent screen for GSC + GA4 + GBP)
- API routes: `/api/integrations/google/{connect,callback,disconnect}`

No data sync agents yet — that's the next PR. This unlocks the auth foundation everything else depends on.

## 1. Run the migration

```bash
psql $DATABASE_URL -f prisma/migrations/manual/phase8-gbp-ga4-oauth-foundation.sql
npx prisma generate
```

## 2. Generate the credential encryption key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env.local` and to Vercel:

```
CREDENTIAL_ENCRYPTION_KEY=<the 64-hex-char output>
```

> ⚠️ Treat this like a password. Losing it means every stored OAuth refresh token becomes unreadable and every site has to reconnect.

## 3. Configure the Google OAuth client

In Google Cloud Console (the same project that hosts the existing GSC service account):

1. **APIs & Services → Library** — enable each of:
   - Google Search Console API
   - Google Analytics Data API (GA4)
   - Google My Business Account Management API
   - Google My Business Business Information API
   - Google Business Profile Performance API
   - My Business Q&A API *(if you want Q&A management later)*

2. **APIs & Services → OAuth consent screen** — configure for "External" user type, add the three scopes:
   - `https://www.googleapis.com/auth/webmasters.readonly`
   - `https://www.googleapis.com/auth/analytics.readonly`
   - `https://www.googleapis.com/auth/business.manage`

   While in dev/testing, add yourself (`sswaynos@seedtechllc.com`) as a test user. Production verification with Google is required before non-test users can grant the `business.manage` scope — start that process early; it can take 2–6 weeks.

3. **APIs & Services → Credentials → Create Credentials → OAuth client ID** — type "Web application":
   - Authorized redirect URI (production): `https://seedtechllc.com/api/integrations/google/callback`
   - Authorized redirect URI (local): `http://localhost:3000/api/integrations/google/callback`
   - Add additional URIs for any other client domains you serve.

4. Copy the Client ID and Secret into env:

```
GOOGLE_OAUTH_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REDIRECT_URI=https://seedtechllc.com/api/integrations/google/callback
```

## 4. Apply for GBP API access

The Business Profile APIs are gated. Submit the access form: https://developers.google.com/my-business/content/prereqs#request-access

Approval is usually 1–2 weeks. You can wire and test GSC + GA4 OAuth before approval lands; GBP calls will 403 until approved.

## 5. Smoke test the OAuth flow

Once env vars are set and you have a signed-in admin session:

```
GET /api/integrations/google/connect?types=google_search_console,google_analytics,google_business_profile
```

Browser will redirect through Google's consent screen and back to `/admin/settings/integrations?oauth_success=...`. Verify in the DB:

```sql
SELECT "siteId", "type", "authType", "isActive", LENGTH("encryptedCredentials") AS cred_len
FROM "integration_credentials"
WHERE "authType" = 'oauth';
```

You should see one row per requested type, all with non-null `encryptedCredentials`.

To disconnect:

```bash
curl -X POST http://localhost:3000/api/integrations/google/disconnect \
  -H 'Content-Type: application/json' \
  --cookie 'next-auth.session-token=...' \
  -d '{"type":"google_business_profile"}'
```

## 6. What's next (PR 2)

- Build the admin UI at `/admin/settings/integrations` (currently just the redirect target — needs a real page with connect/disconnect buttons and per-integration status)
- GBP daily sync agent: pulls `accounts.locations.list`, reviews, posts, and Performance metrics into the new tables
- GA4 daily sync agent: pulls `runReport` page-level data into `page_metrics`
- Backfill GSC's existing service-account flow to also accept OAuth tokens (so a single client onboarding flow covers all three)

## Files added in this PR

- [prisma/schema.prisma](../../prisma/schema.prisma) — `google_business_profile` enum value, 5 new models, 2 new Site relations
- [prisma/migrations/manual/phase8-gbp-ga4-oauth-foundation.sql](../../prisma/migrations/manual/phase8-gbp-ga4-oauth-foundation.sql)
- [src/lib/credential-encryption.ts](../../src/lib/credential-encryption.ts)
- [src/lib/google-oauth.ts](../../src/lib/google-oauth.ts)
- [src/app/api/integrations/google/connect/route.ts](../../src/app/api/integrations/google/connect/route.ts)
- [src/app/api/integrations/google/callback/route.ts](../../src/app/api/integrations/google/callback/route.ts)
- [src/app/api/integrations/google/disconnect/route.ts](../../src/app/api/integrations/google/disconnect/route.ts)
