import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * POST /api/admin/settings/test-openai
 *
 * Tests the Claude API key by sending a minimal request.
 * Returns connection status, model, and latency.
 */
export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      status: "missing",
      message: "No Claude API key configured. Add CLAUDE_API_KEY to .env.local",
    });
  }

  const maskedKey = apiKey.slice(0, 10) + "..." + apiKey.slice(-4);
  const start = Date.now();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 10,
        messages: [{ role: "user", content: "Hi" }],
      }),
    });

    const latency = Date.now() - start;

    if (response.ok) {
      return NextResponse.json({
        status: "connected",
        message: "Claude API key is valid and working",
        model: "claude-opus-4-6",
        maskedKey,
        latencyMs: latency,
      });
    }

    if (response.status === 401) {
      return NextResponse.json({
        status: "invalid",
        message: "Claude API key is invalid or has been revoked",
        maskedKey,
        latencyMs: latency,
      });
    }

    if (response.status === 429) {
      return NextResponse.json({
        status: "rate_limited",
        message: "API key is valid but you've hit the rate limit. Try again in a minute.",
        maskedKey,
        latencyMs: latency,
      });
    }

    const err = await response.json().catch(() => ({}));
    return NextResponse.json({
      status: "error",
      message: err.error?.message || `Unexpected status ${response.status}`,
      maskedKey,
      latencyMs: latency,
    });
  } catch (err: any) {
    return NextResponse.json({
      status: "error",
      message: `Connection failed: ${err.message}`,
      maskedKey,
      latencyMs: Date.now() - start,
    });
  }
}
