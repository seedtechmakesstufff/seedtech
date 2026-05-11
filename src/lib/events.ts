/* ── Event Log ──
 * Append-only feed of meaningful changes per site. Agents read this to
 * understand "what's different since last run" — the memory layer that
 * lets weekly recommendations be specific instead of generic.
 *
 * Conventions:
 *   - `type` uses dotted hierarchy (domain.action). Use the constants below.
 *   - `severity` is info | warn | critical. Critical events should also
 *     appear in the weekly digest email.
 *   - `payload` holds structured data. Keep keys snake_case for stability
 *     when agents parse it. Don't put PII in payload — it's logged forever.
 *   - `entityType` + `entityId` link back to the source row when applicable
 *     (BlogPost, TrackedKeyword, AICitation, GbpReview, etc.).
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const EVENT_TYPES = {
  // Content lifecycle
  CONTENT_PUBLISHED: "content.published",
  CONTENT_UPDATED: "content.updated",
  CONTENT_UNPUBLISHED: "content.unpublished",

  // Keyword movements
  KEYWORD_MOVED: "keyword.moved",
  KEYWORD_NEW_RANKING: "keyword.new_ranking",
  KEYWORD_LOST: "keyword.lost",

  // GA4 / traffic / conversions
  METRICS_CONVERSION_SPIKE: "metrics.conversion_spike",
  METRICS_CONVERSION_DROP: "metrics.conversion_drop",
  METRICS_TRAFFIC_SPIKE: "metrics.traffic_spike",
  METRICS_TRAFFIC_DROP: "metrics.traffic_drop",

  // AI citations
  CITATION_GAINED: "citation.gained",
  CITATION_LOST: "citation.lost",

  // Site audit
  AUDIT_ISSUE_DETECTED: "audit.issue_detected",
  AUDIT_ISSUE_RESOLVED: "audit.issue_resolved",

  // Google Business Profile
  GBP_REVIEW_RECEIVED: "gbp.review_received",
  GBP_POST_PUBLISHED: "gbp.post_published",

  // WordPress sync
  WORDPRESS_SYNC_COMPLETED: "wordpress.sync_completed",
  WORDPRESS_SYNC_FAILED: "wordpress.sync_failed",

  // Agent runs
  AGENT_RUN_COMPLETED: "agent.run_completed",
  AGENT_ARTIFACT_CREATED: "agent.artifact_created",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];
export type EventSeverity = "info" | "warn" | "critical";

export interface LogEventInput {
  siteId: string;
  type: EventType | string;
  title: string;
  body?: string;
  severity?: EventSeverity;
  payload?: Prisma.InputJsonValue;
  entityType?: string;
  entityId?: string;
  occurredAt?: Date;
}

/** Write a single event. Always returns; never throws (logs to console on error). */
export async function logEvent(input: LogEventInput): Promise<void> {
  try {
    await prisma.event.create({
      data: {
        siteId: input.siteId,
        type: input.type,
        title: input.title,
        body: input.body,
        severity: input.severity ?? "info",
        payload: input.payload,
        entityType: input.entityType,
        entityId: input.entityId,
        occurredAt: input.occurredAt,
      },
    });
  } catch (e) {
    // Event logging must never break the caller — it's observational.
    console.error("[events] failed to log event", input.type, e);
  }
}

export interface QueryEventsInput {
  siteId: string;
  types?: string[];
  severities?: EventSeverity[];
  since?: Date;
  until?: Date;
  entityType?: string;
  entityId?: string;
  limit?: number;
  offset?: number;
}

export async function queryEvents(input: QueryEventsInput) {
  return prisma.event.findMany({
    where: {
      siteId: input.siteId,
      type: input.types ? { in: input.types } : undefined,
      severity: input.severities ? { in: input.severities } : undefined,
      occurredAt: {
        ...(input.since ? { gte: input.since } : {}),
        ...(input.until ? { lte: input.until } : {}),
      },
      entityType: input.entityType,
      entityId: input.entityId,
    },
    orderBy: { occurredAt: "desc" },
    take: input.limit ?? 100,
    skip: input.offset ?? 0,
  });
}
