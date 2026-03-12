import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * POST /api/admin/settings/test-openai
 *
 * Sends a minimal request to OpenAI to verify the API key is valid.
 * Returns the model, remaining quota info if available, and latency.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // Check if key is present
  if (!apiKey || apiKey.startsWith("sk-replace")) {
    return NextResponse.json({
      status: "missing",
      message: "No OpenAI API key configured. Add OPENAI_API_KEY to .env.local",
    });
  }

  // Mask the key for display
  const maskedKey = apiKey.slice(0, 7) + "..." + apiKey.slice(-4);

  const start = Date.now();

  try {
    // Use a tiny, cheap call — list models — to validate the key
    const response = await fetch("https://api.openai.com/v1/models/gpt-4o", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const latency = Date.now() - start;

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: "connected",
        message: "API key is valid and working",
        model: data.id,
        maskedKey,
        latencyMs: latency,
      });
    }

    if (response.status === 401) {
      return NextResponse.json({
        status: "invalid",
        message: "API key is invalid or has been revoked",
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
