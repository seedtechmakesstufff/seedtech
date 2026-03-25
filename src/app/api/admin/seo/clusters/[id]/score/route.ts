/**
 * POST /api/admin/seo/clusters/[id]/score — Score cluster authority
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { scoreClusterAuthority } from "@/lib/topic-clusters";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  try {
    const result = await scoreClusterAuthority(siteId, params.id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scoring failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
