-- AlterTable
ALTER TABLE "content_ideas" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "seo_crawl_runs" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "seo_tasks" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "canonicalUrl" TEXT NOT NULL DEFAULT '',
    "sameAs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "expertise" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "credentials" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experience" TEXT NOT NULL DEFAULT '',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_evidence" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experience_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_configs" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "industry" TEXT NOT NULL DEFAULT 'general',
    "credentialKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "geographicTerms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "knownEntities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorityDomains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitor_analyses" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "pageTitle" TEXT,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "aiVisScore" INTEGER NOT NULL DEFAULT 0,
    "eeatScore" INTEGER NOT NULL DEFAULT 0,
    "topicsDetected" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hasSchema" BOOLEAN NOT NULL DEFAULT false,
    "hasFaq" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competitor_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cron_job_runs" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "resultSummary" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cron_job_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_invites" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'editor',
    "invitedBy" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "authors_siteId_isDefault_idx" ON "authors"("siteId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "authors_siteId_slug_key" ON "authors"("siteId", "slug");

-- CreateIndex
CREATE INDEX "experience_evidence_siteId_type_idx" ON "experience_evidence"("siteId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "industry_configs_siteId_key" ON "industry_configs"("siteId");

-- CreateIndex
CREATE INDEX "competitor_analyses_siteId_competitorId_idx" ON "competitor_analyses"("siteId", "competitorId");

-- CreateIndex
CREATE INDEX "competitor_analyses_analyzedAt_idx" ON "competitor_analyses"("analyzedAt");

-- CreateIndex
CREATE INDEX "cron_job_runs_siteId_jobType_idx" ON "cron_job_runs"("siteId", "jobType");

-- CreateIndex
CREATE INDEX "cron_job_runs_startedAt_idx" ON "cron_job_runs"("startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_invites_token_key" ON "user_invites"("token");

-- CreateIndex
CREATE INDEX "user_invites_tenantId_email_idx" ON "user_invites"("tenantId", "email");

-- CreateIndex
CREATE INDEX "user_invites_token_idx" ON "user_invites"("token");

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_evidence" ADD CONSTRAINT "experience_evidence_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_configs" ADD CONSTRAINT "industry_configs_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_analyses" ADD CONSTRAINT "competitor_analyses_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "competitor_domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_analyses" ADD CONSTRAINT "competitor_analyses_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cron_job_runs" ADD CONSTRAINT "cron_job_runs_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

