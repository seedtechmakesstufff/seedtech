/* ── Agent Runner ──────────────────────────────────────────────────────────
 * Wraps every agent invocation in an AgentRun row for observability.
 * Captures: status, duration, model, token usage, artifacts created,
 * cost estimate, and free-form metadata.
 *
 * Use this in addition to (not instead of) runTrackedJob — that one tracks
 * the cron-level lifecycle; this tracks per-agent semantics.
 * ───────────────────────────────────────────────────────────────────────── */

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type AgentTrigger = "cron" | "manual" | "run_all" | "chained";

export interface AgentRunAccounting {
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  artifactIds?: string[];
  artifactsCreated?: number;
  resultSummary?: string;
  inputSnapshotHash?: string;
  metadata?: Record<string, unknown>;
}

// Per-1M-token pricing in USD. Used to compute costEstimateUsd.
// Update when Anthropic changes prices.
const MODEL_PRICING: Record<string, { in: number; out: number }> = {
  "claude-sonnet-4-6":     { in: 3.0,  out: 15.0 },
  "claude-haiku-4-5-20251001":    { in: 1.0,  out: 5.0 },
  "claude-opus-4-7":              { in: 15.0, out: 75.0 },
};

export function estimateCostUsd(
  model: string | undefined,
  tokensIn: number | undefined,
  tokensOut: number | undefined,
): number | undefined {
  if (!model || tokensIn == null || tokensOut == null) return undefined;
  const p = MODEL_PRICING[model];
  if (!p) return undefined;
  return (tokensIn / 1_000_000) * p.in + (tokensOut / 1_000_000) * p.out;
}

interface RunAgentOptions<T> {
  siteId: string;
  agentKey: string;
  trigger?: AgentTrigger;
  fn: () => Promise<T>;
  /** Optional mapper from result to AgentRun accounting fields. */
  extract?: (result: T) => AgentRunAccounting;
}

export interface RunAgentResult<T> {
  runId: string;
  success: boolean;
  durationMs: number;
  result?: T;
  error?: string;
}

export async function runAgent<T>(opts: RunAgentOptions<T>): Promise<RunAgentResult<T>> {
  const { siteId, agentKey, trigger = "cron", fn, extract } = opts;
  const startedAt = new Date();

  const run = await prisma.agentRun.create({
    data: {
      siteId,
      agentKey,
      trigger,
      status: "running",
      startedAt,
    },
  });

  try {
    const result = await fn();
    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();

    const acc: AgentRunAccounting = extract ? extract(result) : {};
    const cost = estimateCostUsd(acc.model, acc.tokensIn, acc.tokensOut);

    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "completed",
        completedAt,
        durationMs,
        model: acc.model,
        tokensIn: acc.tokensIn,
        tokensOut: acc.tokensOut,
        costEstimateUsd: cost != null ? new Prisma.Decimal(cost.toFixed(6)) : null,
        artifactsCreated: acc.artifactsCreated ?? acc.artifactIds?.length ?? 0,
        artifactIds: acc.artifactIds ?? [],
        resultSummary: acc.resultSummary ?? summarise(result),
        inputSnapshotHash: acc.inputSnapshotHash,
        metadata: acc.metadata as Prisma.InputJsonValue | undefined,
      },
    });

    return { runId: run.id, success: true, result, durationMs };
  } catch (e) {
    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();
    const errorMessage = e instanceof Error ? e.message : String(e);

    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        completedAt,
        durationMs,
        error: errorMessage.slice(0, 4000),
      },
    });

    return { runId: run.id, success: false, durationMs, error: errorMessage };
  }
}

function summarise(result: unknown): string | undefined {
  if (result == null) return undefined;
  if (typeof result === "string") return result.slice(0, 500);
  try {
    return JSON.stringify(result).slice(0, 500);
  } catch {
    return undefined;
  }
}

