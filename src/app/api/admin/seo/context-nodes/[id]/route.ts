import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET    /api/admin/seo/context-nodes/[id] — Get single node with all relations
 * PATCH  /api/admin/seo/context-nodes/[id] — Update node fields
 * DELETE /api/admin/seo/context-nodes/[id] — Delete node and all links
 */

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id } = await params;

  const node = await prisma.contextNode.findFirst({
    where: { id, siteId },
    include: {
      linkedPages: {
        include: {
          pageContext: { select: { id: true, path: true, pageType: true, description: true } },
        },
      },
    },
  });

  if (!node) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  }

  return NextResponse.json({ node });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id } = await params;

  // Verify ownership
  const existing = await prisma.contextNode.findFirst({
    where: { id, siteId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  }

  const body = await req.json();
  const allowedFields = [
    "name", "nodeType", "color", "icon",
    "summary", "audience", "pricing", "usps",
    "messaging", "doSay", "dontSay", "competitors", "detailedContext",
    "posX", "posY",
  ] as const;

  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      data[field] = body[field];
    }
  }

  // If name changed, update slug too
  if (data.name && typeof data.name === "string") {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    // Check uniqueness
    const slugExists = await prisma.contextNode.findFirst({
      where: { siteId, slug, NOT: { id } },
    });
    data.slug = slugExists ? `${slug}-${Date.now().toString(36)}` : slug;
  }

  const node = await prisma.contextNode.update({
    where: { id },
    data,
    include: {
      linkedPages: {
        include: {
          pageContext: { select: { id: true, path: true, pageType: true } },
        },
      },
    },
  });

  // ── Sync business node changes back to BusinessProfile ──
  // This keeps all existing consumers (blog gen, AI advisor, etc.) working
  if (node.nodeType === "business") {
    try {
      // Parse detailedContext for structured business fields
      const dc = node.detailedContext || "";
      const extract = (label: string): string => {
        const match = dc.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
        return match?.[1]?.trim() || "";
      };
      const extractList = (label: string): string[] => {
        const blockMatch = dc.match(new RegExp(`^${label}:\\n([\\s\\S]*?)(?=\\n\\S|$)`, "m"));
        if (blockMatch) {
          return blockMatch[1].split("\n").map((l) => l.replace(/^\s*-\s*/, "").trim()).filter(Boolean);
        }
        return [];
      };

      await prisma.businessProfile.upsert({
        where: { siteId },
        create: {
          siteId,
          companyName: node.name,
          tagline: node.summary,
          location: extract("Location"),
          domain: extract("Domain"),
          primaryService: extract("Primary Service"),
          secondaryServices: extractList("Secondary Services"),
          targetAudience: node.audience || "",
          uniqueSellingPoints: node.usps,
          toneOfVoice: node.messaging || "",
          customInstructions: extract("Custom AI Instructions") ||
            (dc.match(/Custom AI Instructions:\n([\s\S]*)$/)?.[1]?.trim() || ""),
        },
        update: {
          companyName: node.name,
          tagline: node.summary,
          location: extract("Location"),
          domain: extract("Domain"),
          primaryService: extract("Primary Service"),
          secondaryServices: extractList("Secondary Services"),
          targetAudience: node.audience || "",
          uniqueSellingPoints: node.usps,
          toneOfVoice: node.messaging || "",
          customInstructions: extract("Custom AI Instructions") ||
            (dc.match(/Custom AI Instructions:\n([\s\S]*)$/)?.[1]?.trim() || ""),
        },
      });
    } catch (err) {
      console.error("[context-nodes] Failed to sync business node to BusinessProfile:", err);
      // Non-fatal — the node itself was saved successfully
    }
  }

  return NextResponse.json({ node });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;
  const { id } = await params;

  // Verify ownership
  const existing = await prisma.contextNode.findFirst({
    where: { id, siteId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  }

  // Prevent deletion of the business node
  if (existing.nodeType === "business") {
    return NextResponse.json({ error: "The business profile node cannot be deleted" }, { status: 403 });
  }

  await prisma.contextNode.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
