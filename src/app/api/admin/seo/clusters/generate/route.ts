/**
 * POST /api/admin/seo/clusters/generate — AI-generate a topic cluster from a seed keyword
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { generateTopicCluster, saveGeneratedCluster } from "@/lib/topic-clusters";

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { seedKeyword } = body;

  if (!seedKeyword || typeof seedKeyword !== "string" || seedKeyword.trim().length < 2) {
    return NextResponse.json(
      { error: "seedKeyword is required (min 2 characters)" },
      { status: 400 }
    );
  }

  try {
    const generated = await generateTopicCluster(siteId, seedKeyword.trim());
    const clusterId = await saveGeneratedCluster(siteId, seedKeyword.trim(), generated);

    return NextResponse.json({
      clusterId,
      cluster: generated,
      message: `Generated cluster "${generated.name}" with ${generated.subtopics.length} subtopics`,
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate cluster";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
