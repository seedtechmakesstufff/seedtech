-- Phase 8 — Event Log
-- Append-only feed of meaningful changes per site, read by agents.
--
-- Run with: psql $DATABASE_URL -f prisma/migrations/manual/phase8-event-log.sql
-- Then: npx prisma generate

CREATE TABLE IF NOT EXISTS "events" (
  "id"         TEXT PRIMARY KEY,
  "siteId"     TEXT NOT NULL,
  "type"       TEXT NOT NULL,
  "severity"   TEXT NOT NULL DEFAULT 'info',
  "title"      TEXT NOT NULL,
  "body"       TEXT,
  "payload"    JSONB,
  "entityType" TEXT,
  "entityId"   TEXT,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "events_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "events_siteId_occurredAt_idx" ON "events"("siteId", "occurredAt" DESC);
CREATE INDEX IF NOT EXISTS "events_siteId_type_occurredAt_idx" ON "events"("siteId", "type", "occurredAt" DESC);
CREATE INDEX IF NOT EXISTS "events_siteId_severity_occurredAt_idx" ON "events"("siteId", "severity", "occurredAt" DESC);
CREATE INDEX IF NOT EXISTS "events_entityType_entityId_idx" ON "events"("entityType", "entityId");
