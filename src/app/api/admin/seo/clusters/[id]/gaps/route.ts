/**
 * GET  /api/admin/seo/clusters/[id]/gaps — Run gap analysis on a cluster
 * POST /api/admin/seo/clusters/[id]/gaps — Force re-analysis
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { analyzeClusterGaps } from "@/lib/topic-clusters";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const gaps = await analyzeClusterGaps(siteId, params.id);
    return NextResponse.json(gaps);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gap analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const gaps = await analyzeClusterGaps(siteId, params.id);
    return NextResponse.json(gaps);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gap analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
