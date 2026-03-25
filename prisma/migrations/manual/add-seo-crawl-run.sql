-- Pass 3: Add SeoCrawlRun table for crawl execution metadata
-- Run against Neon: psql $DATABASE_URL -f prisma/migrations/manual/add-seo-crawl-run.sql

CREATE TABLE IF NOT EXISTS "seo_crawl_runs" (
    "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "siteId"         TEXT NOT NULL,
    "runId"          TEXT NOT NULL,
    "status"         TEXT NOT NULL DEFAULT 'running',
    "pagesScanned"   INTEGER NOT NULL DEFAULT 0,
    "criticalCount"  INTEGER NOT NULL DEFAULT 0,
    "warningCount"   INTEGER NOT NULL DEFAULT 0,
    "infoCount"      INTEGER NOT NULL DEFAULT 0,
    "passCount"      INTEGER NOT NULL DEFAULT 0,
    "eeatScore"      INTEGER,
    "startedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt"    TIMESTAMP(3),
    "errorMessage"   TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seo_crawl_runs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "seo_crawl_runs_runId_key" UNIQUE ("runId"),
    CONSTRAINT "seo_crawl_runs_siteId_fkey"
        FOREIGN KEY ("siteId") REFERENCES "sites"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "seo_crawl_runs_siteId_createdAt_idx"
    ON "seo_crawl_runs"("siteId", "createdAt");
