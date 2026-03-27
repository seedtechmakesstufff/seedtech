---
alwaysApply: true
---

# Architecture

## Multi-Tenant Model
Tenant → Site → all data. Every model has `siteId` with `onDelete: Cascade`.

**Auth pattern:**
- API routes: `const { siteId } = await requireSiteContext()` (returns siteId from JWT)
- Admin pages: `await requireAdmin()` (redirects to login if no session)
- Role check: `hasRole(session, 'admin')` or `requireRole(session, 'editor')`

**Site context:** Cookie `selectedSiteId` for multi-site switching. `DEFAULT_SITE_ID = "site_seedtech"`.

## Key Prisma Patterns
- Composite uniques: `@@unique([siteId, slug])`, `@@unique([siteId, url])`
- All queries filter by siteId: `prisma.blogPost.findMany({ where: { siteId } })`
- Cascade deletes from Site down to all child models

## Scoring Config
`src/lib/site-scoring-config.ts` loads IndustryConfig + BusinessProfile + Authors from DB, builds compiled regex patterns. Cached 5 minutes. Pass `siteConfig` to scoring functions when available.

## Cron Jobs
Use `runTrackedJob(siteId, jobType, fn)` from `cron-runner.ts`. Creates `CronJobRun` records. Authenticate with `authenticateCron()`. Weekly cron at `/api/cron/seo` (Monday 6 AM UTC via Vercel).
