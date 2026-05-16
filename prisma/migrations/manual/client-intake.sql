-- Client Intake: Onboarding forms sent to new clients
-- Run with: psql $DATABASE_URL -f prisma/migrations/manual/client-intake.sql

CREATE TABLE IF NOT EXISTS client_intakes (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  token            TEXT UNIQUE NOT NULL,                     -- generated in API via crypto.randomBytes
  company_name     TEXT NOT NULL,
  contact_email    TEXT,
  asset_drive_url  TEXT,                          -- Google Drive link admin fills in
  status           TEXT NOT NULL DEFAULT 'sent',  -- sent | submitted | reviewed
  notes            TEXT,                          -- internal admin notes
  site_id          TEXT REFERENCES sites(id) ON DELETE SET NULL,
  submission_data  JSONB,                         -- full form answers on submit
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_client_intakes_token ON client_intakes(token);
CREATE INDEX IF NOT EXISTS idx_client_intakes_status ON client_intakes(status);
CREATE INDEX IF NOT EXISTS idx_client_intakes_site_id ON client_intakes(site_id);
