/* ── Claude API wrapper ────────────────────────────────────────────────────
 * Thin wrapper around Anthropic's /v1/messages endpoint that returns the
 * usage block alongside the text response. Use this from agents so the
 * AgentRun observability layer can record tokensIn / tokensOut / cost.
 * ───────────────────────────────────────────────────────────────────────── */

export interface ClaudeUsage {
  tokensIn: number;
  tokensOut: number;
}

export interface ClaudeResponse {
  text: string;
  usage: ClaudeUsage;
  model: string;
  stopReason?: string;
}

export interface CallClaudeOptions {
  model: string;
  maxTokens: number;
  prompt: string;
  apiKey?: string;
  /** Optional system prompt */
  system?: string;
  /** Override the API endpoint (mostly for tests). */
  endpoint?: string;
}

/**
 * Call Claude with a single user message. Throws on non-2xx.
 * Returns the assistant text plus token usage so callers can accumulate.
 */
export async function callClaude(opts: CallClaudeOptions): Promise<ClaudeResponse> {
  const apiKey = opts.apiKey ?? process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY not configured");

  const res = await fetch(opts.endpoint ?? "https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens,
      ...(opts.system ? { system: opts.system } : {}),
      messages: [{ role: "user", content: opts.prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[claude] error ${res.status} from model=${opts.model} promptLen=${opts.prompt.length}`, body);
    throw new Error(`Claude error ${res.status} (model=${opts.model}, promptLen=${opts.prompt.length}): ${body.slice(0, 1500)}`);
  }

  const data: {
    content?: Array<{ type: string; text?: string }>;
    usage?: { input_tokens?: number; output_tokens?: number };
    model?: string;
    stop_reason?: string;
  } = await res.json();

  const text = data.content?.[0]?.text ?? "";
  const usage: ClaudeUsage = {
    tokensIn: data.usage?.input_tokens ?? 0,
    tokensOut: data.usage?.output_tokens ?? 0,
  };

  return { text, usage, model: data.model ?? opts.model, stopReason: data.stop_reason };
}

export const ZERO_USAGE: ClaudeUsage = { tokensIn: 0, tokensOut: 0 };

export function addUsage(a: ClaudeUsage, b: ClaudeUsage): ClaudeUsage {
  return { tokensIn: a.tokensIn + b.tokensIn, tokensOut: a.tokensOut + b.tokensOut };
}

/** Strip ```json fences and surrounding whitespace from a Claude response. */
export function stripJsonFences(text: string): string {
  return text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
}
