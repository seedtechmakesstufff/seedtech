-- Add hourOfDay column to report_preferences
ALTER TABLE "report_preferences" ADD COLUMN IF NOT EXISTS "hourOfDay" INTEGER NOT NULL DEFAULT 8;

-- Migrate any existing quarterly/yearly rows to monthly before altering enum
UPDATE "report_preferences" SET "frequency" = 'monthly' WHERE "frequency" IN ('quarterly', 'yearly');

-- Rename existing enum, create new one without quarterly/yearly, update column, drop old enum
ALTER TYPE "ReportFrequency" RENAME TO "ReportFrequency_old";
CREATE TYPE "ReportFrequency" AS ENUM ('weekly', 'monthly');
ALTER TABLE "report_preferences" ALTER COLUMN "frequency" TYPE "ReportFrequency" USING "frequency"::text::"ReportFrequency";
DROP TYPE "ReportFrequency_old";
