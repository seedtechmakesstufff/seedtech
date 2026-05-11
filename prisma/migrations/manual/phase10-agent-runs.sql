-- ── AgentRun observability table ─────────────────────────────────────────
-- One row per agent invocation. Tracks status, duration, LLM spend, and
-- artifacts produced. Idempotent — uses IF NOT EXISTS so re-running is safe.

DO $$ BEGIN
  CREATE TYPE "AgentRunStatus" AS ENUM ('running', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "AgentRunTrigger" AS ENUM ('cron', 'manual', 'run_all', 'chained');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "agent_runs" (
  "id"                 TEXT PRIMARY KEY,
  "siteId"             TEXT NOT NULL,
  "agentKey"           TEXT NOT NULL,
  "trigger"            "AgentRunTrigger" NOT NULL DEFAULT 'cron',
  "status"             "AgentRunStatus" NOT NULL DEFAULT 'running',
  "startedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt"        TIMESTAMP(3),
  "durationMs"         INTEGER,
  "inputSnapshotHash"  TEXT,
  "model"              TEXT,
  "tokensIn"           INTEGER,
  "tokensOut"          INTEGER,
  "costEstimateUsd"    DECIMAL(10, 6),
  "artifactsCreated"   INTEGER NOT NULL DEFAULT 0,
  "artifactIds"        TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "resultSummary"      TEXT,
  "error"              TEXT,
  "metadata"           JSONB,
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agent_runs_siteId_fkey"
    FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "agent_runs_siteId_agentKey_idx"  ON "agent_runs" ("siteId", "agentKey");
CREATE INDEX IF NOT EXISTS "agent_runs_siteId_startedAt_idx" ON "agent_runs" ("siteId", "startedAt");
CREATE INDEX IF NOT EXISTS "agent_runs_startedAt_idx"        ON "agent_runs" ("startedAt");
CREATE INDEX IF NOT EXISTS "agent_runs_agentKey_status_idx"  ON "agent_runs" ("agentKey", "status");
