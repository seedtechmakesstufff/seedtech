-- AlterTable
ALTER TABLE "content_ideas" ADD COLUMN     "clusterId" TEXT;

-- AlterTable
ALTER TABLE "keyword_clusters" ADD COLUMN     "authorityScore" INTEGER,
ADD COLUMN     "avgAiVisScore" DOUBLE PRECISION,
ADD COLUMN     "avgContentScore" DOUBLE PRECISION,
ADD COLUMN     "coveragePercent" DOUBLE PRECISION,
ADD COLUMN     "lastScoredAt" TIMESTAMP(3),
ADD COLUMN     "linkDensity" DOUBLE PRECISION,
ADD COLUMN     "seedKeyword" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft';

-- CreateTable
CREATE TABLE "cluster_subtopics" (
    "id" TEXT NOT NULL,
    "clusterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "targetKeyword" TEXT NOT NULL,
    "searchIntent" TEXT NOT NULL DEFAULT 'informational',
    "contentStatus" TEXT NOT NULL DEFAULT 'missing',
    "matchedPageUrl" TEXT,
    "matchedBlogId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "wordCountTarget" INTEGER NOT NULL DEFAULT 1500,
    "briefNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cluster_subtopics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internal_link_suggestions" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "clusterId" TEXT,
    "sourcePageUrl" TEXT NOT NULL,
    "targetPageUrl" TEXT NOT NULL,
    "anchorText" TEXT NOT NULL,
    "context" TEXT,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "internal_link_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cluster_subtopics_clusterId_contentStatus_idx" ON "cluster_subtopics"("clusterId", "contentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "cluster_subtopics_clusterId_slug_key" ON "cluster_subtopics"("clusterId", "slug");

-- CreateIndex
CREATE INDEX "internal_link_suggestions_siteId_status_idx" ON "internal_link_suggestions"("siteId", "status");

-- CreateIndex
CREATE INDEX "internal_link_suggestions_clusterId_idx" ON "internal_link_suggestions"("clusterId");

-- CreateIndex
CREATE UNIQUE INDEX "internal_link_suggestions_siteId_sourcePageUrl_targetPageUr_key" ON "internal_link_suggestions"("siteId", "sourcePageUrl", "targetPageUrl");

-- CreateIndex
CREATE INDEX "content_ideas_clusterId_idx" ON "content_ideas"("clusterId");

-- AddForeignKey
ALTER TABLE "cluster_subtopics" ADD CONSTRAINT "cluster_subtopics_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "keyword_clusters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_link_suggestions" ADD CONSTRAINT "internal_link_suggestions_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "keyword_clusters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_link_suggestions" ADD CONSTRAINT "internal_link_suggestions_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_ideas" ADD CONSTRAINT "content_ideas_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "keyword_clusters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

