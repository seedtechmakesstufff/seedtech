import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";

/**
 * GET  /api/admin/seo/context-nodes — List all context nodes with linked page counts
 *      Auto-seeds a "business" node from BusinessProfile if none exists.
 * POST /api/admin/seo/context-nodes — Create a new context node
 */

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Seed the root "business" context node from the existing BusinessProfile.
 * This is the single source of truth for company identity / AI voice.
 */
async function ensureBusinessNode(siteId: string) {
  const existing = await prisma.contextNode.findFirst({
    where: { siteId, nodeType: "business" },
  });
  if (existing) return;

  // Read from BusinessProfile
  const profile = await prisma.businessProfile.findUnique({
    where: { siteId },
  });

  // Build structured fields from BusinessProfile data
  const name = profile?.companyName || "Business Profile";
  const summary = [
    profile?.tagline,
    profile?.primaryService ? `Primary service: ${profile.primaryService}` : null,
  ].filter(Boolean).join(". ") || "Configure your business identity and AI voice.";

  // Pack business-specific fields into detailedContext as structured YAML-ish block
  const detailedParts: string[] = [];
  if (profile?.location) detailedParts.push(`Location: ${profile.location}`);
  if (profile?.domain) detailedParts.push(`Domain: ${profile.domain}`);
  if (profile?.primaryService) detailedParts.push(`Primary Service: ${profile.primaryService}`);
  if (profile?.secondaryServices?.length) detailedParts.push(`Secondary Services:\n${profile.secondaryServices.map((s) => `  - ${s}`).join("\n")}`);
  if (profile?.customInstructions) detailedParts.push(`\nCustom AI Instructions:\n${profile.customInstructions}`);

  await prisma.contextNode.create({
    data: {
      siteId,
      name,
      slug: "business",
      nodeType: "business",
      color: "#6366f1", // indigo for business
      icon: "Building2",
      summary,
      audience: profile?.targetAudience || null,
      pricing: null,
      usps: profile?.uniqueSellingPoints || [],
      messaging: profile?.toneOfVoice || null,
      doSay: [],
      dontSay: [],
      competitors: [],
      detailedContext: detailedParts.length > 0 ? detailedParts.join("\n") : null,
    },
  });
}

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  // Auto-seed business node if it doesn't exist
  await ensureBusinessNode(siteId);

  const nodes = await prisma.contextNode.findMany({
    where: { siteId },
    include: {
      linkedPages: {
        include: {
          pageContext: { select: { path: true, pageType: true } },
        },
      },
    },
    orderBy: [{ nodeType: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ nodes });
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { name, nodeType, color, icon, summary, audience, pricing, usps, messaging, doSay, dontSay, competitors, detailedContext } = body;

  if (!name || !summary) {
    return NextResponse.json({ error: "Name and summary are required" }, { status: 400 });
  }

  // Generate slug, handle collisions
  let slug = slugify(name);
  const existing = await prisma.contextNode.findUnique({
    where: { siteId_slug: { siteId, slug } },
  });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const node = await prisma.contextNode.create({
    data: {
      siteId,
      name,
      slug,
      nodeType: nodeType || "service",
      color: color || "#a855f7",
      icon: icon || "Briefcase",
      summary,
      audience: audience || null,
      pricing: pricing || null,
      usps: usps || [],
      messaging: messaging || null,
      doSay: doSay || [],
      dontSay: dontSay || [],
      competitors: competitors || [],
      detailedContext: detailedContext || null,
    },
    include: {
      linkedPages: {
        include: {
          pageContext: { select: { path: true, pageType: true } },
        },
      },
    },
  });

  return NextResponse.json({ node }, { status: 201 });
}
