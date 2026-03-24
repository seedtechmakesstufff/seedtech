-- ============================================================
-- Multi-Tenant Migration: Add tenant/user/site/membership
-- then backfill existing rows with default SeedTech site
-- ============================================================

-- 1. Create new multi-tenant tables
CREATE TABLE IF NOT EXISTS "tenants" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_slug_key" ON "tenants"("slug");

CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

CREATE TYPE "MemberRole" AS ENUM ('owner', 'admin', 'editor', 'viewer');

CREATE TABLE IF NOT EXISTS "memberships" (
  "userId" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "role" "MemberRole" NOT NULL DEFAULT 'editor',
  CONSTRAINT "memberships_pkey" PRIMARY KEY ("userId","tenantId"),
  CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "memberships_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "sites" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "domain" TEXT NOT NULL,
  "siteUrl" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sites_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sites_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "sites_tenantId_slug_key" ON "sites"("tenantId","slug");

CREATE TABLE IF NOT EXISTS "site_pages" (
  "id" TEXT NOT NULL,
  "siteId" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "title" TEXT,
  "source" TEXT NOT NULL DEFAULT 'manual',
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "site_pages_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "site_pages_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "site_pages_siteId_path_key" ON "site_pages"("siteId","path");
CREATE INDEX IF NOT EXISTS "site_pages_siteId_kind_idx" ON "site_pages"("siteId","kind");

CREATE TABLE IF NOT EXISTS "business_profiles" (
  "id" TEXT NOT NULL,
  "siteId" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "tagline" TEXT NOT NULL DEFAULT '',
  "location" TEXT NOT NULL DEFAULT '',
  "domain" TEXT NOT NULL DEFAULT '',
  "primaryService" TEXT NOT NULL DEFAULT '',
  "secondaryServices" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "targetAudience" TEXT NOT NULL DEFAULT '',
  "uniqueSellingPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "toneOfVoice" TEXT NOT NULL DEFAULT '',
  "customInstructions" TEXT NOT NULL DEFAULT '',
  "serviceCategories" JSONB,
  "brandEntities" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "ctaDefaults" JSONB,
  "internalLinkTargets" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "business_profiles_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "business_profiles_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "business_profiles_siteId_key" ON "business_profiles"("siteId");

CREATE TYPE "IntegrationType" AS ENUM ('google_search_console', 'google_analytics', 'google_pagespeed');

CREATE TABLE IF NOT EXISTS "integration_credentials" (
  "id" TEXT NOT NULL,
  "siteId" TEXT NOT NULL,
  "type" "IntegrationType" NOT NULL,
  "property" TEXT NOT NULL DEFAULT '',
  "authType" TEXT NOT NULL DEFAULT 'service-account',
  "encryptedCredentials" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "integration_credentials_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "integration_credentials_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "integration_credentials_siteId_type_key" ON "integration_credentials"("siteId","type");

-- 2. Add siteId columns (nullable first) to existing tables
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "seo_snapshots" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "seo_page_audits" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "seo_insights" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "tracked_keywords" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "keyword_clusters" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "content_scores" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "competitor_domains" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "seo_lead_events" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "ai_citations" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "ai_visibility_scores" ADD COLUMN IF NOT EXISTS "siteId" TEXT;

-- 3. Insert default SeedTech tenant + site
-- Uses deterministic cuid-like IDs so the seed script can reference them
INSERT INTO "tenants" ("id", "name", "slug", "createdAt", "updatedAt")
VALUES ('tenant_seedtech', 'SeedTech LLC', 'seedtech', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "sites" ("id", "tenantId", "name", "slug", "domain", "siteUrl", "createdAt", "updatedAt")
VALUES ('site_seedtech', 'tenant_seedtech', 'SeedTech', 'seedtech', 'seedtechllc.com', 'https://seedtechllc.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- 4. Backfill all existing rows with the default site
UPDATE "blog_posts" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "contacts" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "form_submissions" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "seo_snapshots" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "seo_page_audits" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "seo_insights" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "tracked_keywords" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "keyword_clusters" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "content_scores" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "competitor_domains" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "seo_lead_events" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "ai_citations" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;
UPDATE "ai_visibility_scores" SET "siteId" = 'site_seedtech' WHERE "siteId" IS NULL;

-- 5. Make siteId NOT NULL now that all rows are backfilled
ALTER TABLE "blog_posts" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "contacts" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "form_submissions" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "seo_snapshots" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "seo_page_audits" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "seo_insights" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "tracked_keywords" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "keyword_clusters" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "content_scores" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "competitor_domains" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "seo_lead_events" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "ai_citations" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "ai_visibility_scores" ALTER COLUMN "siteId" SET NOT NULL;

-- 6. Add foreign keys for siteId
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seo_snapshots" ADD CONSTRAINT "seo_snapshots_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seo_page_audits" ADD CONSTRAINT "seo_page_audits_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seo_insights" ADD CONSTRAINT "seo_insights_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tracked_keywords" ADD CONSTRAINT "tracked_keywords_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "keyword_clusters" ADD CONSTRAINT "keyword_clusters_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "content_scores" ADD CONSTRAINT "content_scores_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "competitor_domains" ADD CONSTRAINT "competitor_domains_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seo_lead_events" ADD CONSTRAINT "seo_lead_events_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_citations" ADD CONSTRAINT "ai_citations_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_visibility_scores" ADD CONSTRAINT "ai_visibility_scores_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 7. Drop old unique constraints and add composite ones
-- BlogPost: slug was globally unique, now unique per site
ALTER TABLE "blog_posts" DROP CONSTRAINT IF EXISTS "blog_posts_slug_key";
CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_siteId_slug_key" ON "blog_posts"("siteId","slug");

-- TrackedKeyword: keyword was globally unique, now unique per site
ALTER TABLE "tracked_keywords" DROP CONSTRAINT IF EXISTS "tracked_keywords_keyword_key";
CREATE UNIQUE INDEX IF NOT EXISTS "tracked_keywords_siteId_keyword_key" ON "tracked_keywords"("siteId","keyword");

-- KeywordCluster: name was globally unique, now unique per site
ALTER TABLE "keyword_clusters" DROP CONSTRAINT IF EXISTS "keyword_clusters_name_key";
CREATE UNIQUE INDEX IF NOT EXISTS "keyword_clusters_siteId_name_key" ON "keyword_clusters"("siteId","name");

-- ContentScore: pageUrl was globally unique, now unique per site
ALTER TABLE "content_scores" DROP CONSTRAINT IF EXISTS "content_scores_pageUrl_key";
CREATE UNIQUE INDEX IF NOT EXISTS "content_scores_siteId_pageUrl_key" ON "content_scores"("siteId","pageUrl");

-- CompetitorDomain: domain was globally unique, now unique per site
ALTER TABLE "competitor_domains" DROP CONSTRAINT IF EXISTS "competitor_domains_domain_key";
CREATE UNIQUE INDEX IF NOT EXISTS "competitor_domains_siteId_domain_key" ON "competitor_domains"("siteId","domain");

-- 8. Add new composite indexes for performance
CREATE INDEX IF NOT EXISTS "blog_posts_siteId_status_idx" ON "blog_posts"("siteId","status");
CREATE INDEX IF NOT EXISTS "contacts_siteId_email_idx" ON "contacts"("siteId","email");
CREATE INDEX IF NOT EXISTS "form_submissions_siteId_status_idx" ON "form_submissions"("siteId","status");
CREATE INDEX IF NOT EXISTS "seo_snapshots_siteId_date_idx" ON "seo_snapshots"("siteId","date");
CREATE INDEX IF NOT EXISTS "seo_page_audits_siteId_runId_idx" ON "seo_page_audits"("siteId","runId");
CREATE INDEX IF NOT EXISTS "seo_insights_siteId_type_idx" ON "seo_insights"("siteId","type");
CREATE INDEX IF NOT EXISTS "seo_insights_siteId_status_idx" ON "seo_insights"("siteId","status");
CREATE INDEX IF NOT EXISTS "tracked_keywords_siteId_tier_idx" ON "tracked_keywords"("siteId","tier");
CREATE INDEX IF NOT EXISTS "tracked_keywords_siteId_isActive_idx" ON "tracked_keywords"("siteId","isActive");
CREATE INDEX IF NOT EXISTS "content_scores_siteId_overallScore_idx" ON "content_scores"("siteId","overallScore");
CREATE INDEX IF NOT EXISTS "competitor_domains_siteId_isActive_idx" ON "competitor_domains"("siteId","isActive");
CREATE INDEX IF NOT EXISTS "seo_lead_events_siteId_eventType_idx" ON "seo_lead_events"("siteId","eventType");
CREATE INDEX IF NOT EXISTS "seo_lead_events_siteId_landingPage_idx" ON "seo_lead_events"("siteId","landingPage");
CREATE INDEX IF NOT EXISTS "ai_citations_siteId_platform_idx" ON "ai_citations"("siteId","platform");
CREATE INDEX IF NOT EXISTS "ai_citations_siteId_brandMentioned_idx" ON "ai_citations"("siteId","brandMentioned");
CREATE INDEX IF NOT EXISTS "ai_visibility_scores_siteId_pageUrl_idx" ON "ai_visibility_scores"("siteId","pageUrl");

-- Done! Run `npx prisma db push` after this to reconcile Prisma's shadow state.
