-- Phase 10: Add page_opportunity to InsightType enum
ALTER TYPE "InsightType" ADD VALUE IF NOT EXISTS 'page_opportunity';
