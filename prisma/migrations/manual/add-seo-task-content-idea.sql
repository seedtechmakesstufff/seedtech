-- Add SeoTask table
CREATE TABLE IF NOT EXISTS "seo_tasks" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid(),
    "siteId"    TEXT NOT NULL,
    "phase"     INTEGER NOT NULL DEFAULT 1,
    "title"     TEXT NOT NULL,
    "status"    TEXT NOT NULL DEFAULT 'not-started',
    "priority"  TEXT NOT NULL DEFAULT 'medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seo_tasks_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "seo_tasks_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "seo_tasks_siteId_status_idx" ON "seo_tasks"("siteId", "status");

-- Add ContentIdea table
CREATE TABLE IF NOT EXISTS "content_ideas" (
    "id"            TEXT NOT NULL DEFAULT gen_random_uuid(),
    "siteId"        TEXT NOT NULL,
    "title"         TEXT NOT NULL,
    "targetKeyword" TEXT NOT NULL,
    "wordCount"     INTEGER NOT NULL DEFAULT 1500,
    "funnelStage"   TEXT NOT NULL DEFAULT 'Top',
    "status"        TEXT NOT NULL DEFAULT 'idea',
    "slug"          TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_ideas_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "content_ideas_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "content_ideas_siteId_status_idx" ON "content_ideas"("siteId", "status");
