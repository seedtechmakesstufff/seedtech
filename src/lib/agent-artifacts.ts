/* ── Agent Artifacts ──
 * Helpers for the agent → human-review → publish lifecycle. Agents create
 * pending_review artifacts; admins approve/reject them in the Inbox; on
 * approval, a publisher function actually applies the change (e.g. replies
 * to a GBP review, publishes a blog post).
 *
 * Publishers are registered per `type`. When an artifact is approved, we look
 * up the publisher and run it. Failures move the artifact to state=failed
 * with publishError populated.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { EVENT_TYPES, logEvent } from "@/lib/events";
import { registerPublisher, getPublisher, type PublisherFn } from "@/lib/agent-publisher-registry";

// Re-export for callers that already import these from this module
export { registerPublisher, getPublisher };
export type { PublisherFn };

export type ArtifactState = "pending_review" | "approved" | "rejected" | "published" | "failed";

export interface CreateArtifactInput {
  siteId: string;
  agent: string;
  type: string;
  title: string;
  summary?: string;
  payload: Prisma.InputJsonValue;
  entityType?: string;
  entityId?: string;
}

export async function createArtifact(input: CreateArtifactInput) {
  const a = await prisma.agentArtifact.create({
    data: {
      siteId: input.siteId,
      agent: input.agent,
      type: input.type,
      state: "pending_review",
      title: input.title,
      summary: input.summary,
      payload: input.payload,
      entityType: input.entityType,
      entityId: input.entityId,
    },
  });
  await logEvent({
    siteId: input.siteId,
    type: EVENT_TYPES.AGENT_ARTIFACT_CREATED,
    title: `${input.agent}: ${input.title}`,
    payload: { artifact_id: a.id, agent: input.agent, type: input.type },
    entityType: "AgentArtifact",
    entityId: a.id,
  });
  return a;
}

/* ── State transitions ── */

export async function approveArtifact(artifactId: string, reviewer: string, notes?: string) {
  const artifact = await prisma.agentArtifact.findUnique({ where: { id: artifactId } });
  if (!artifact) throw new Error("Artifact not found");
  if (artifact.state !== "pending_review") {
    throw new Error(`Artifact is in state '${artifact.state}', cannot approve`);
  }

  await prisma.agentArtifact.update({
    where: { id: artifactId },
    data: { state: "approved", reviewedBy: reviewer, reviewedAt: new Date(), reviewNotes: notes },
  });

  // Try to publish if a publisher is registered for this type
  const publisher = getPublisher(artifact.type);
  if (!publisher) {
    return { state: "approved" as ArtifactState, published: false, reason: "no_publisher" };
  }

  try {
    await publisher({
      id: artifact.id,
      siteId: artifact.siteId,
      type: artifact.type,
      payload: artifact.payload,
      entityType: artifact.entityType,
      entityId: artifact.entityId,
    });
    await prisma.agentArtifact.update({
      where: { id: artifactId },
      data: { state: "published", publishedAt: new Date(), publishError: null },
    });
    return { state: "published" as ArtifactState, published: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await prisma.agentArtifact.update({
      where: { id: artifactId },
      data: { state: "failed", publishError: message },
    });
    return { state: "failed" as ArtifactState, published: false, error: message };
  }
}

export async function rejectArtifact(artifactId: string, reviewer: string, notes?: string) {
  const artifact = await prisma.agentArtifact.findUnique({ where: { id: artifactId } });
  if (!artifact) throw new Error("Artifact not found");
  if (artifact.state !== "pending_review") {
    throw new Error(`Artifact is in state '${artifact.state}', cannot reject`);
  }
  await prisma.agentArtifact.update({
    where: { id: artifactId },
    data: { state: "rejected", reviewedBy: reviewer, reviewedAt: new Date(), reviewNotes: notes },
  });
}

/* ── Queries ── */

export interface ListArtifactsInput {
  siteId: string;
  states?: ArtifactState[];
  types?: string[];
  agents?: string[];
  limit?: number;
  offset?: number;
}

export async function listArtifacts(input: ListArtifactsInput) {
  return prisma.agentArtifact.findMany({
    where: {
      siteId: input.siteId,
      state: input.states ? { in: input.states } : undefined,
      type: input.types ? { in: input.types } : undefined,
      agent: input.agents ? { in: input.agents } : undefined,
    },
    orderBy: [{ state: "asc" }, { createdAt: "desc" }],
    take: input.limit ?? 100,
    skip: input.offset ?? 0,
  });
}

/* ── Register publishers ──
 * These imports are intentionally side-effecting — calling registerPublisher
 * once at module load attaches the publisher to its artifact type.
 */
import "./agent-artifact-publishers";
