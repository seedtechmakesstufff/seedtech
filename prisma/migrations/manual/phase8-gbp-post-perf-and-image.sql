-- Phase 8 — GBP post per-post performance columns + image tracking
-- Adds viewCount and clickCount to gbp_posts so the GBP Post Drafter
-- agent can read past post performance (impressions, CTA clicks) and
-- avoid repeating low-performers. uploadedImageUrl lives on the
-- AgentArtifact payload (JSON), not here, so no column needed there.

ALTER TABLE gbp_posts
  ADD COLUMN IF NOT EXISTS view_count  INTEGER,
  ADD COLUMN IF NOT EXISTS click_count INTEGER;

COMMENT ON COLUMN gbp_posts.view_count  IS 'Per-post impressions from GBP Local Post Insights API. NULL until first sync.';
COMMENT ON COLUMN gbp_posts.click_count IS 'Per-post CTA clicks from GBP Local Post Insights API. NULL until first sync.';
