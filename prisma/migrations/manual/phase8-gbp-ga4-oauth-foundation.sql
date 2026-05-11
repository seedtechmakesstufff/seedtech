-- Phase 8 — GBP / GA4 / OAuth Foundation
-- Adds google_business_profile to IntegrationType, plus tables for
-- GBP locations/posts/reviews/metrics and GA4 PageMetrics.
--
-- Run with: psql $DATABASE_URL -f prisma/migrations/manual/phase8-gbp-ga4-oauth-foundation.sql
-- Then: npx prisma generate

BEGIN;

-- 1. Extend IntegrationType enum (Postgres requires ALTER TYPE outside a tx for some servers;
--    wrap in DO block to be idempotent across re-runs)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'google_business_profile'
      AND enumtypid = 'public."IntegrationType"'::regtype
  ) THEN
    ALTER TYPE "IntegrationType" ADD VALUE 'google_business_profile';
  END IF;
END $$;

COMMIT;

-- 2. GBP Locations
CREATE TABLE IF NOT EXISTS "gbp_locations" (
  "id"                TEXT PRIMARY KEY,
  "siteId"            TEXT NOT NULL,
  "accountId"         TEXT NOT NULL,
  "locationId"        TEXT NOT NULL,
  "title"             TEXT NOT NULL,
  "primaryCategory"   TEXT,
  "storefrontAddress" TEXT,
  "primaryPhone"      TEXT,
  "websiteUri"        TEXT,
  "serviceArea"       TEXT,
  "labels"            TEXT,
  "metadata"          TEXT,
  "isPrimary"         BOOLEAN NOT NULL DEFAULT false,
  "lastSyncedAt"      TIMESTAMP(3),
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3) NOT NULL,
  CONSTRAINT "gbp_locations_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "gbp_locations_siteId_locationId_key" ON "gbp_locations"("siteId", "locationId");
CREATE INDEX IF NOT EXISTS "gbp_locations_siteId_isPrimary_idx" ON "gbp_locations"("siteId", "isPrimary");

-- 3. GBP Posts
CREATE TABLE IF NOT EXISTS "gbp_posts" (
  "id"           TEXT PRIMARY KEY,
  "locationId"   TEXT NOT NULL,
  "postName"     TEXT,
  "topicType"    TEXT NOT NULL,
  "summary"      TEXT NOT NULL,
  "ctaType"      TEXT,
  "ctaUrl"       TEXT,
  "mediaUrl"     TEXT,
  "state"        TEXT NOT NULL DEFAULT 'draft',
  "publishedAt"  TIMESTAMP(3),
  "searchUrl"    TEXT,
  "errorMessage" TEXT,
  "metadata"     TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL,
  CONSTRAINT "gbp_posts_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "gbp_locations"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "gbp_posts_locationId_state_idx" ON "gbp_posts"("locationId", "state");
CREATE INDEX IF NOT EXISTS "gbp_posts_locationId_publishedAt_idx" ON "gbp_posts"("locationId", "publishedAt");

-- 4. GBP Reviews
CREATE TABLE IF NOT EXISTS "gbp_reviews" (
  "id"           TEXT PRIMARY KEY,
  "locationId"   TEXT NOT NULL,
  "reviewName"   TEXT NOT NULL,
  "reviewerName" TEXT,
  "rating"       INTEGER NOT NULL,
  "comment"      TEXT,
  "reply"        TEXT,
  "replyAt"      TIMESTAMP(3),
  "createTime"   TIMESTAMP(3) NOT NULL,
  "updateTime"   TIMESTAMP(3) NOT NULL,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL,
  CONSTRAINT "gbp_reviews_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "gbp_locations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "gbp_reviews_locationId_reviewName_key" ON "gbp_reviews"("locationId", "reviewName");
CREATE INDEX IF NOT EXISTS "gbp_reviews_locationId_createTime_idx" ON "gbp_reviews"("locationId", "createTime");
CREATE INDEX IF NOT EXISTS "gbp_reviews_locationId_rating_idx" ON "gbp_reviews"("locationId", "rating");

-- 5. GBP Daily Metrics
CREATE TABLE IF NOT EXISTS "gbp_metrics_daily" (
  "id"                              TEXT PRIMARY KEY,
  "locationId"                      TEXT NOT NULL,
  "date"                            DATE NOT NULL,
  "businessImpressionsDesktopMaps"  INTEGER NOT NULL DEFAULT 0,
  "businessImpressionsDesktopSearch" INTEGER NOT NULL DEFAULT 0,
  "businessImpressionsMobileMaps"   INTEGER NOT NULL DEFAULT 0,
  "businessImpressionsMobileSearch" INTEGER NOT NULL DEFAULT 0,
  "callClicks"                      INTEGER NOT NULL DEFAULT 0,
  "websiteClicks"                   INTEGER NOT NULL DEFAULT 0,
  "drivingDirections"               INTEGER NOT NULL DEFAULT 0,
  "businessBookings"                INTEGER NOT NULL DEFAULT 0,
  "businessConversations"           INTEGER NOT NULL DEFAULT 0,
  "businessFoodOrders"              INTEGER NOT NULL DEFAULT 0,
  "businessFoodMenuClicks"          INTEGER NOT NULL DEFAULT 0,
  "createdAt"                       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "gbp_metrics_daily_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "gbp_locations"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "gbp_metrics_daily_locationId_date_key" ON "gbp_metrics_daily"("locationId", "date");
CREATE INDEX IF NOT EXISTS "gbp_metrics_daily_locationId_date_idx" ON "gbp_metrics_daily"("locationId", "date");

-- 6. GA4 Page Metrics
CREATE TABLE IF NOT EXISTS "page_metrics" (
  "id"                    TEXT PRIMARY KEY,
  "siteId"                TEXT NOT NULL,
  "url"                   TEXT NOT NULL,
  "date"                  DATE NOT NULL,
  "sessions"              INTEGER NOT NULL DEFAULT 0,
  "users"                 INTEGER NOT NULL DEFAULT 0,
  "engagedSessions"       INTEGER NOT NULL DEFAULT 0,
  "engagementRate"        DOUBLE PRECISION NOT NULL DEFAULT 0,
  "averageEngagementTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "bounceRate"            DOUBLE PRECISION NOT NULL DEFAULT 0,
  "conversions"           INTEGER NOT NULL DEFAULT 0,
  "revenue"               DOUBLE PRECISION NOT NULL DEFAULT 0,
  "source"                TEXT NOT NULL DEFAULT 'ga4',
  "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "page_metrics_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "page_metrics_siteId_url_date_source_key" ON "page_metrics"("siteId", "url", "date", "source");
CREATE INDEX IF NOT EXISTS "page_metrics_siteId_date_idx" ON "page_metrics"("siteId", "date");
CREATE INDEX IF NOT EXISTS "page_metrics_siteId_url_idx" ON "page_metrics"("siteId", "url");
