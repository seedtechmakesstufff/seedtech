import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET  /api/admin/seo/strategy — Returns tasks, content calendar, and site info
 * POST /api/admin/seo/strategy — Create / update tasks or content ideas
 */

export async function GET(_req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const [tasks, contentIdeas, site] = await Promise.all([
    prisma.seoTask.findMany({
      where: { siteId },
      orderBy: [{ phase: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        phase: true,
        title: true,
        status: true,
        priority: true,
        sourceType: true,
        sourceUrl: true,
        sourceCheckType: true,
        autoResolved: true,
        createdAt: true,
      },
    }),
    prisma.contentIdea.findMany({
      where: { siteId },
      orderBy: [{ status: "asc" }, { createdAt: "asc" }],
    }),
    prisma.site.findUnique({
      where: { id: siteId },
      select: { id: true, name: true, domain: true, siteUrl: true },
    }),
  ]);

  return NextResponse.json({ tasks, contentIdeas, site });
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { action } = body;

  // Update a task status
  if (action === "update-task") {
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "id and status required" }, { status: 400 });
    }
    const task = await prisma.seoTask.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ task });
  }

  // Create a task
  if (action === "create-task") {
    const { title, phase, priority } = body;
    if (!title) {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }
    const task = await prisma.seoTask.create({
      data: {
        siteId,
        title,
        phase: phase || 1,
        priority: priority || "medium",
      },
    });
    return NextResponse.json({ task });
  }

  // Create a content idea
  if (action === "create-idea") {
    const { title, targetKeyword, wordCount, funnelStage, status: ideaStatus } = body;
    if (!title || !targetKeyword) {
      return NextResponse.json({ error: "title and targetKeyword required" }, { status: 400 });
    }
    const idea = await prisma.contentIdea.create({
      data: {
        siteId,
        title,
        targetKeyword,
        wordCount: wordCount || 1500,
        funnelStage: funnelStage || "Top",
        status: ideaStatus || "idea",
      },
    });
    return NextResponse.json({ idea });
  }

  // Update a content idea status
  if (action === "update-idea") {
    const { id, status: ideaStatus, slug } = body;
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const idea = await prisma.contentIdea.update({
      where: { id },
      data: {
        ...(ideaStatus && { status: ideaStatus }),
        ...(slug && { slug }),
      },
    });
    return NextResponse.json({ idea });
  }

  // Bulk import tasks
  if (action === "import-tasks" && Array.isArray(body.tasks)) {
    const results = await Promise.allSettled(
      body.tasks.map((t: { title: string; phase?: number; status?: string; priority?: string }) =>
        prisma.seoTask.create({
          data: {
            siteId,
            title: t.title,
            phase: t.phase || 1,
            status: t.status || "not-started",
            priority: t.priority || "medium",
          },
        })
      )
    );
    const created = results.filter((r) => r.status === "fulfilled").length;
    return NextResponse.json({ imported: created, total: body.tasks.length });
  }

  // Bulk import content ideas
  if (action === "import-ideas" && Array.isArray(body.ideas)) {
    const results = await Promise.allSettled(
      body.ideas.map((i: { title: string; targetKeyword: string; wordCount?: number; funnelStage?: string; status?: string }) =>
        prisma.contentIdea.create({
          data: {
            siteId,
            title: i.title,
            targetKeyword: i.targetKeyword,
            wordCount: i.wordCount || 1500,
            funnelStage: i.funnelStage || "Top",
            status: i.status || "idea",
          },
        })
      )
    );
    const created = results.filter((r) => r.status === "fulfilled").length;
    return NextResponse.json({ imported: created, total: body.ideas.length });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
