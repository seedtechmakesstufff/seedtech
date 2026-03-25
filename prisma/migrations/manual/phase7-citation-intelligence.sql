-- AlterTable
ALTER TABLE "ai_citations" ADD COLUMN     "checkRunId" TEXT,
ADD COLUMN     "competitorId" TEXT,
ADD COLUMN     "position" INTEGER,
ADD COLUMN     "responseLength" INTEGER;

-- CreateTable
CREATE TABLE "citation_check_runs" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "totalQueries" INTEGER NOT NULL DEFAULT 0,
    "totalPlatforms" INTEGER NOT NULL DEFAULT 0,
    "brandMentions" INTEGER NOT NULL DEFAULT 0,
    "urlCitations" INTEGER NOT NULL DEFAULT 0,
    "mentionRate" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "citation_check_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "citation_check_runs_siteId_createdAt_idx" ON "citation_check_runs"("siteId", "createdAt");

-- CreateIndex
CREATE INDEX "ai_citations_siteId_checkRunId_idx" ON "ai_citations"("siteId", "checkRunId");

-- AddForeignKey
ALTER TABLE "ai_citations" ADD CONSTRAINT "ai_citations_checkRunId_fkey" FOREIGN KEY ("checkRunId") REFERENCES "citation_check_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citation_check_runs" ADD CONSTRAINT "citation_check_runs_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

