-- Phase 11: WordPress REST API integration
-- Idempotent: safe to re-run

-- Extend IntegrationType enum
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'wordpress'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'IntegrationType')
  ) THEN
    ALTER TYPE "IntegrationType" ADD VALUE 'wordpress';
  END IF;
END $$;

-- Add WordPress-specific fields to blog_posts
ALTER TABLE "blog_posts"
  ADD COLUMN IF NOT EXISTS "wordPressPostId" INTEGER,
  ADD COLUMN IF NOT EXISTS "wordPressSiteUrl" TEXT;

-- Index for fast reconciliation on sync
CREATE INDEX IF NOT EXISTS "blog_posts_siteId_wordPressPostId_idx"
  ON "blog_posts" ("siteId", "wordPressPostId");
