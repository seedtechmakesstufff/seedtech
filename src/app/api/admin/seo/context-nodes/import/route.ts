import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * POST /api/admin/seo/context-nodes/import — AI-powered import
 * Accepts raw markdown/text describing a service and uses Claude to parse
 * it into structured ContextNode fields.
 */

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Claude API key not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { content, nodeType } = body as { content: string; nodeType?: string };

  if (!content || content.trim().length < 20) {
    return NextResponse.json(
      { error: "Please provide at least a short description of the service/offering" },
      { status: 400 },
    );
  }

  const prompt = `You are a data extraction assistant. Parse the following raw text about a business service/offering/product into structured fields.

RAW TEXT:
---
${content}
---

Extract and return ONLY valid JSON (no markdown fences) with these fields:
{
  "name": "The service/product name (concise, e.g. 'Managed IT Support')",
  "summary": "2-3 sentence elevator pitch of what this service is and why someone would want it",
  "audience": "Who this service is for (target customer profile)",
  "pricing": "Pricing model, range, or structure if mentioned (null if not mentioned)",
  "usps": ["unique selling point 1", "unique selling point 2", "..."],
  "messaging": "Key messaging guidelines — how to talk about this service",
  "doSay": ["terms and phrases TO use when writing about this service"],
  "dontSay": ["terms and phrases to AVOID when writing about this service"],
  "competitors": ["competitor names if mentioned"],
  "detailedContext": "Any additional context, features, technical details, or nuances in markdown format"
}

Rules:
- Extract ONLY what's in the text. Don't invent information.
- If a field has no data in the text, use null for strings, [] for arrays.
- usps should be concise bullet points, not paragraphs.
- doSay/dontSay should be specific terms, not generic advice.
- detailedContext should capture anything that doesn't fit the other fields.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[context-nodes/import] Claude error:", res.status, errText);
      return NextResponse.json(
        { error: `AI error (${res.status}): ${res.statusText}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || "";

    // Parse the JSON response
    let parsed: Record<string, unknown>;
    try {
      // Handle potential markdown fences
      const cleaned = text.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("[context-nodes/import] Failed to parse Claude response:", text);
      return NextResponse.json(
        { error: "AI returned invalid JSON. Try providing more structured text." },
        { status: 422 },
      );
    }

    // Generate slug
    const name = (parsed.name as string) || "Unnamed Service";
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existingSlug = await prisma.contextNode.findUnique({
      where: { siteId_slug: { siteId, slug } },
    });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Create the node
    const node = await prisma.contextNode.create({
      data: {
        siteId,
        name,
        slug,
        nodeType: nodeType || "service",
        summary: (parsed.summary as string) || name,
        audience: (parsed.audience as string) || null,
        pricing: (parsed.pricing as string) || null,
        usps: Array.isArray(parsed.usps) ? (parsed.usps as string[]) : [],
        messaging: (parsed.messaging as string) || null,
        doSay: Array.isArray(parsed.doSay) ? (parsed.doSay as string[]) : [],
        dontSay: Array.isArray(parsed.dontSay) ? (parsed.dontSay as string[]) : [],
        competitors: Array.isArray(parsed.competitors) ? (parsed.competitors as string[]) : [],
        detailedContext: (parsed.detailedContext as string) || null,
      },
      include: {
        linkedPages: {
          include: {
            pageContext: { select: { path: true, pageType: true } },
          },
        },
      },
    });

    return NextResponse.json({ node, parsed }, { status: 201 });
  } catch (err) {
    console.error("[context-nodes/import] Error:", err);
    return NextResponse.json(
      { error: "Failed to import service context" },
      { status: 500 },
    );
  }
}
