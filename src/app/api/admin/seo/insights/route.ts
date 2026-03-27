import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import {
  generateAllInsights,
  getActiveInsights,
  updateInsightStatus,
} from "@/lib/seo-insights";

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const insights = await getActiveInsights(siteId);
    return NextResponse.json({ insights });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  try {
    if (action === "generate") {
      const insights = await generateAllInsights(siteId);
      return NextResponse.json({ insights, count: insights.length });
    }

    if (action === "dismiss" || action === "resolve") {
      const body = await req.json();
      const id = (body as { id?: string }).id;
      if (!id) return NextResponse.json({ error: "Missing insight id" }, { status: 400 });
      const status = action === "dismiss" ? "dismissed" : "resolved";
      await updateInsightStatus(id, status);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid action. Use ?action=generate, ?action=dismiss, or ?action=resolve" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
