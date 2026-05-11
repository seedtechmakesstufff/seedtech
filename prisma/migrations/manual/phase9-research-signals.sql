-- Phase 9: Research Signals (Industry Researcher Agent)
-- Run once against the live DB before deploying.

DO $$ BEGIN
  CREATE TYPE "ResearchSignalStatus" AS ENUM ('fresh', 'consumed', 'dismissed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "research_signals" (
  "id"            TEXT NOT NULL PRIMARY KEY,
  "siteId"        TEXT NOT NULL REFERENCES "sites"("id") ON DELETE CASCADE,
  "sourceUrl"     TEXT NOT NULL,
  "sourceDomain"  TEXT NOT NULL,
  "sourceTitle"   TEXT NOT NULL,
  "publishedAt"   TIMESTAMP(3),
  "industry"      TEXT NOT NULL,
  "headline"      TEXT NOT NULL,
  "insight"       TEXT NOT NULL,
  "contentAngle"  TEXT NOT NULL,
  "keywords"      TEXT[]  NOT NULL DEFAULT '{}',
  "shareScore"    INTEGER NOT NULL DEFAULT 50,
  "recencyScore"  INTEGER NOT NULL DEFAULT 50,
  "status"        "ResearchSignalStatus" NOT NULL DEFAULT 'fresh',
  "consumedBy"    TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "research_signals_siteId_status_idx"     ON "research_signals"("siteId", "status");
CREATE INDEX IF NOT EXISTS "research_signals_siteId_industry_idx"   ON "research_signals"("siteId", "industry");
CREATE INDEX IF NOT EXISTS "research_signals_siteId_shareScore_idx" ON "research_signals"("siteId", "shareScore");
