import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { AGENT_CONFIGS } from "@/lib/agent-configs";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { key: string } }) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "CLAUDE_API_KEY not configured" }, { status: 500 });

  const body = await req.json() as { request: string };
  if (!body.request?.trim()) return NextResponse.json({ error: "No request provided" }, { status: 400 });

  const config = AGENT_CONFIGS[params.key];
  if (!config) return NextResponse.json({ error: "Unknown agent" }, { status: 404 });

  const prompt = `You are a senior AI engineer helping tune an SEO autopilot agent. The user wants to adjust the agent's behaviour.

═══ AGENT: ${config.label} ═══
${config.tuningContext}

═══ USER REQUEST ═══
${body.request}

═══ TASK ═══
Respond with:
1. A clear explanation of what should change and why it's a good idea (or why it might not be)
2. The specific prompt text / configuration value to change — quote the EXACT current text and the EXACT replacement
3. Any edge cases or tradeoffs to be aware of

Be direct and specific. If the request is vague, ask one clarifying question before suggesting a change.
Format your response in clear sections with headers.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) return NextResponse.json({ error: `Claude error: ${res.status}` }, { status: 500 });
  const data = await res.json();
  const suggestion = data.content?.[0]?.text ?? "";

  return NextResponse.json({ suggestion });
}
