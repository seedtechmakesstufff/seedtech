/* ── Agent Registry ────────────────────────────────────────────────────────
 * Central map of agentKey → run function + extract function for AgentRun
 * observability. Routes call runRegisteredAgent(key, opts) instead of
 * importing the agent directly, so the registry is the single source of
 * truth for "which agents exist, what model they use, and how to map their
 * return shape to AgentRun accounting fields".
 * ───────────────────────────────────────────────────────────────────────── */

import { runAgent, type AgentTrigger, type AgentRunAccounting, type RunAgentResult } from "@/lib/agent-runner";

import { runIndustryResearcher } from "@/lib/agents/industry-researcher";
import { runStrategyAnalyst } from "@/lib/agents/strategy-analyst";
import { runBriefGenerator } from "@/lib/agents/brief-generator";
import { runBlogDrafter, type BlogDrafterOptions } from "@/lib/agents/blog-drafter";
import { runGbpPostDrafter } from "@/lib/agents/gbp-post-drafter";
import { runKeywordScout } from "@/lib/agents/keyword-scout";
import { runContentDecayWatcher } from "@/lib/agents/content-decay-watcher";
import { runInternalLinkAgent } from "@/lib/agents/internal-link-agent";
import { sendWeeklyDigest } from "@/lib/weekly-digest";

const SONNET = "claude-sonnet-4-20250514";

export type AgentKey =
  | "industry-researcher"
  | "strategy-analyst"
  | "brief-generator"
  | "blog-drafter"
  | "gbp-post-drafter"
  | "keyword-scout"
  | "content-decay-watcher"
  | "internal-link-agent"
  | "weekly-digest";

export const AGENT_KEYS: readonly AgentKey[] = [
  "industry-researcher",
  "strategy-analyst",
  "brief-generator",
  "blog-drafter",
  "gbp-post-drafter",
  "keyword-scout",
  "content-decay-watcher",
  "internal-link-agent",
  "weekly-digest",
] as const;

// Each agent declares its own runner signature; the registry stores closures
// over (siteId, opts?) so all callers share one entry point.

interface RegisteredAgent<R = unknown> {
  label: string;
  defaultModel: string | null;          // null for pure-heuristic agents
  run: (siteId: string, opts?: unknown) => Promise<R>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extract: (result: any, opts?: unknown) => AgentRunAccounting;
}

const REGISTRY: Record<AgentKey, RegisteredAgent> = {
  "industry-researcher": {
    label: "Industry Researcher",
    defaultModel: SONNET,
    run: (siteId) => runIndustryResearcher(siteId),
    extract: (r: Awaited<ReturnType<typeof runIndustryResearcher>>) => ({
      model: r.model,
      tokensIn: r.usage.tokensIn,
      tokensOut: r.usage.tokensOut,
      artifactsCreated: r.signalsCreated,
      resultSummary: `${r.signalsCreated} signals from ${r.sourcesChecked} sources${r.errors.length ? ` (${r.errors.length} errors)` : ""}`,
      metadata: { sourcesChecked: r.sourcesChecked, errors: r.errors, signalIds: r.signalIds },
    }),
  },

  "strategy-analyst": {
    label: "Strategy Analyst",
    defaultModel: SONNET,
    run: (siteId) => runStrategyAnalyst(siteId),
    extract: (r: Awaited<ReturnType<typeof runStrategyAnalyst>>) => ({
      model: r.model,
      tokensIn: r.usage.tokensIn,
      tokensOut: r.usage.tokensOut,
      artifactsCreated: 0,
      resultSummary: `${r.priorities} priorities`,
      metadata: { docId: r.docId, priorities: r.priorities },
    }),
  },

  "brief-generator": {
    label: "Brief Generator",
    defaultModel: SONNET,
    run: (siteId) => runBriefGenerator(siteId),
    extract: (r: Awaited<ReturnType<typeof runBriefGenerator>>) => ({
      model: r.model,
      tokensIn: r.usage.tokensIn,
      tokensOut: r.usage.tokensOut,
      artifactIds: r.artifactIds,
      artifactsCreated: r.briefsCreated,
      resultSummary: `${r.briefsCreated} briefs`,
    }),
  },

  "blog-drafter": {
    label: "Blog Drafter",
    defaultModel: SONNET,
    run: (siteId, opts) => runBlogDrafter(siteId, (opts as BlogDrafterOptions) ?? {}),
    extract: (r: Awaited<ReturnType<typeof runBlogDrafter>>) => ({
      model: r.model,
      tokensIn: r.usage.tokensIn,
      tokensOut: r.usage.tokensOut,
      artifactIds: r.artifactIds,
      artifactsCreated: r.draftsCreated,
      resultSummary: `${r.draftsCreated} drafts${r.errors.length ? ` (${r.errors.length} errors)` : ""}`,
      metadata: { errors: r.errors },
    }),
  },

  "gbp-post-drafter": {
    label: "GBP Post Drafter",
    defaultModel: SONNET,
    run: (siteId) => runGbpPostDrafter(siteId),
    extract: (r: Awaited<ReturnType<typeof runGbpPostDrafter>>) => ({
      model: r.model,
      tokensIn: r.usage.tokensIn,
      tokensOut: r.usage.tokensOut,
      artifactIds: r.artifactIds,
      artifactsCreated: r.postsDrafted,
      resultSummary: `${r.postsDrafted} posts${r.errors.length ? ` (${r.errors.length} errors)` : ""}`,
      metadata: { errors: r.errors },
    }),
  },

  "keyword-scout": {
    label: "Keyword Scout",
    defaultModel: null,
    run: (siteId) => runKeywordScout(siteId),
    extract: (r: Awaited<ReturnType<typeof runKeywordScout>>) => ({
      artifactIds: r.artifactIds,
      artifactsCreated: r.artifactsQueued,
      resultSummary: `${r.candidatesFound} candidates, ${r.artifactsQueued} queued, ${r.skippedExisting} skipped`,
      metadata: { candidatesFound: r.candidatesFound, skippedExisting: r.skippedExisting },
    }),
  },

  "content-decay-watcher": {
    label: "Content Decay Watcher",
    defaultModel: SONNET,
    run: (siteId) => runContentDecayWatcher(siteId),
    extract: (r: Awaited<ReturnType<typeof runContentDecayWatcher>>) => ({
      model: r.model,
      tokensIn: r.usage.tokensIn,
      tokensOut: r.usage.tokensOut,
      artifactIds: r.artifactIds,
      artifactsCreated: r.briefsQueued,
      resultSummary: `${r.candidatesFound} decaying, ${r.briefsQueued} briefs queued`,
      metadata: { candidatesFound: r.candidatesFound, errors: r.errors },
    }),
  },

  "internal-link-agent": {
    label: "Internal Link Agent",
    defaultModel: null,
    run: (siteId, opts) =>
      runInternalLinkAgent(
        siteId,
        (opts as { mode: "post"; postId: string } | { mode: "daily" }) ?? { mode: "daily" },
      ),
    extract: (r: Awaited<ReturnType<typeof runInternalLinkAgent>>) => ({
      artifactIds: r.artifactIds,
      artifactsCreated: r.artifactsQueued,
      resultSummary: `${r.posts} posts, ${r.suggestionsCreated} suggestions, ${r.artifactsQueued} artifacts`,
      metadata: { posts: r.posts, suggestionsCreated: r.suggestionsCreated },
    }),
  },

  "weekly-digest": {
    label: "Weekly Digest",
    defaultModel: null,
    run: (siteId, opts) => {
      const recipient = (opts as { recipient?: string } | undefined)?.recipient;
      return sendWeeklyDigest({ siteId, recipient });
    },
    extract: (r: Awaited<ReturnType<typeof sendWeeklyDigest>>) => ({
      artifactsCreated: 0,
      resultSummary:
        r && typeof r === "object" && "sent" in r
          ? `sent=${(r as { sent?: boolean }).sent}`
          : "weekly digest dispatched",
      metadata: r as unknown as Record<string, unknown> | undefined,
    }),
  },
};

export function getRegisteredAgent(key: AgentKey): RegisteredAgent {
  const a = REGISTRY[key];
  if (!a) throw new Error(`Unknown agent key: ${key}`);
  return a;
}

export interface RunRegisteredOptions {
  siteId: string;
  trigger?: AgentTrigger;
  /** Forwarded to the agent runner (e.g. BlogDrafterOptions) */
  params?: unknown;
}

export async function runRegisteredAgent<R = unknown>(
  key: AgentKey,
  opts: RunRegisteredOptions,
): Promise<RunAgentResult<R>> {
  const agent = getRegisteredAgent(key) as RegisteredAgent<R>;
  return runAgent<R>({
    siteId: opts.siteId,
    agentKey: key,
    trigger: opts.trigger,
    fn: () => agent.run(opts.siteId, opts.params),
    extract: (result) => agent.extract(result, opts.params),
  });
}
