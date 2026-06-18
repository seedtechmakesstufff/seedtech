-- Artist + Comedian intake: first-class FormSource values
-- Run with: psql $DATABASE_URL -f prisma/migrations/manual/add-artist-comedian-intake-sources.sql
--
-- Adds two new FormSource enum values so artist & comedian website intakes are
-- stored as their own source (instead of riding on contact_page), making them
-- filterable in /admin/submissions. Also backfills the original "band" intakes
-- (which were stored as contact_page + service='band_intake') to the new
-- artist_intake source.
--
-- NOTE: run via psql (statement-level autocommit) — Postgres does not allow a
-- newly added enum value to be used in the same transaction it was added in.

ALTER TYPE "FormSource" ADD VALUE IF NOT EXISTS 'artist_intake';
ALTER TYPE "FormSource" ADD VALUE IF NOT EXISTS 'comedian_intake';

-- Backfill legacy band intakes → artist_intake (no-op if there are none).
UPDATE "form_submissions"
SET    "source"  = 'artist_intake',
       "service" = 'Artist Website Intake'
WHERE  "service" = 'band_intake';
