import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getPostById, updatePost, deletePost } from "@/lib/blog";
import { submitUrl, isIndexNowConfigured } from "@/lib/indexnow";
import { scoreAIVisibility } from "@/lib/ai-visibility";
import { getBusinessContextForSite } from "@/lib/business-context";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site-context";

/** GET /api/blog/[id] — get single post */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await getPostById(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(post);
}

/** PUT /api/blog/[id] — update post */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch current post to detect status changes
  const existing = await getPostById(params.id);
  const data = await req.json();
  const updated = await updatePost(params.id, data);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Auto-ping IndexNow when a post is published or content is updated while published
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE || "https://seedtechllc.com";
  const shouldPing =
    isIndexNowConfigured() &&
    updated.status === "published" &&
    (existing?.status !== "published" || data.body || data.title || data.slug);

  let indexNowResult = null;
  if (shouldPing) {
    try {
      indexNowResult = await submitUrl(`${siteUrl}/blog/${updated.slug}`);
    } catch {
      // Non-blocking — don't fail the update if IndexNow fails
    }
  }

  // Auto-score AI Visibility when a post is published or updated
  let aiVisibilityGrade = null;
  if (updated.status === "published" && updated.body) {
    try {
      const siteId = session?.user?.siteId || DEFAULT_SITE_ID;
      const businessCtx = await getBusinessContextForSite(siteId);
      const aiVis = scoreAIVisibility(updated.body, updated.targetKeyword || undefined, businessCtx.companyName);
      await prisma.aIVisibilityScore.create({
        data: {
          siteId,
          pageUrl: `/blog/${updated.slug}`,
          overallScore: aiVis.overall,
          citationReadiness: aiVis.citationReadiness,
          entityAuthority: aiVis.entityAuthority,
          structuredClarity: aiVis.structuredClarity,
          conversationalFit: aiVis.conversationalFit,
          multiEngineCoverage: aiVis.multiEngineCoverage,
          grade: aiVis.grade,
          failedChecks: aiVis.checks
            .filter((c) => !c.passed)
            .map((c) => ({ check: c.check, category: c.category, fix: c.fix })),
        },
      });
      aiVisibilityGrade = aiVis.grade;
    } catch {
      // Non-blocking
    }
  }

  return NextResponse.json({ ...updated, indexNow: indexNowResult, aiVisibilityGrade });
}

/** DELETE /api/blog/[id] — delete post */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await deletePost(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
