-- Phase 8 — Agent Artifacts
-- Items produced by agents that need human approval before publishing.
--
-- Run with: psql $DATABASE_URL -f prisma/migrations/manual/phase8-agent-artifacts.sql

CREATE TABLE IF NOT EXISTS "agent_artifacts" (
  "id"           TEXT PRIMARY KEY,
  "siteId"       TEXT NOT NULL,
  "agent"        TEXT NOT NULL,
  "type"         TEXT NOT NULL,
  "state"        TEXT NOT NULL DEFAULT 'pending_review',
  "title"        TEXT NOT NULL,
  "summary"      TEXT,
  "payload"      JSONB NOT NULL,
  "entityType"   TEXT,
  "entityId"     TEXT,
  "reviewedBy"   TEXT,
  "reviewedAt"   TIMESTAMP(3),
  "reviewNotes"  TEXT,
  "publishedAt"  TIMESTAMP(3),
  "publishError" TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL,
  CONSTRAINT "agent_artifacts_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "agent_artifacts_siteId_state_idx" ON "agent_artifacts"("siteId", "state");
CREATE INDEX IF NOT EXISTS "agent_artifacts_siteId_agent_idx" ON "agent_artifacts"("siteId", "agent");
CREATE INDEX IF NOT EXISTS "agent_artifacts_siteId_type_idx" ON "agent_artifacts"("siteId", "type");
CREATE INDEX IF NOT EXISTS "agent_artifacts_entityType_entityId_idx" ON "agent_artifacts"("entityType", "entityId");
