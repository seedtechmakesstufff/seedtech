import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getTemplate, applyTemplateVars } from "@/lib/templates";
import { SITE_COOKIE } from "@/lib/site-context";

/**
 * POST /api/admin/sites/new — Create a new site with optional template seeding.
 *
 * Body: {
 *   name: string;
 *   domain: string;
 *   siteUrl: string;
 *   template?: string;          // template slug, e.g. "msp" or "blank"
 *   region?: string;            // for {region} variable substitution
 *   companyName?: string;
 *   serviceArea?: string;
 *   primaryServices?: string;
 *   usp?: string;
 * }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.userId || !session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, domain, siteUrl, template: templateSlug, region, companyName, serviceArea, primaryServices, usp } = body;

  if (!name || !domain) {
    return NextResponse.json({ error: "name and domain are required" }, { status: 400 });
  }

  const tenantId = session.user.tenantId;
  const slug = domain.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const url = siteUrl || `https://${domain}`;

  // Check for duplicate slug
  const existing = await prisma.site.findFirst({
    where: { tenantId, slug },
  });
  if (existing) {
    return NextResponse.json({ error: "A site with this domain already exists in your organization" }, { status: 409 });
  }

  // Create the site
  const site = await prisma.site.create({
    data: {
      tenantId,
      name,
      slug,
      domain,
      siteUrl: url,
    },
  });

  // Create business profile
  if (companyName) {
    await prisma.businessProfile.create({
      data: {
        siteId: site.id,
        companyName: companyName || name,
        domain,
        location: serviceArea || "",
        primaryService: primaryServices || "",
        secondaryServices: [],
        uniqueSellingPoints: usp ? [usp] : [],
        toneOfVoice: "professional",
        targetAudience: "",
        brandEntities: [],
        customInstructions: "",
      },
    });
  }

  // Seed from template if provided
  const tmpl = getTemplate(templateSlug || "blank");
  if (tmpl) {
    const applied = applyTemplateVars(tmpl, {
      region: region || serviceArea || "",
      year: new Date().getFullYear().toString(),
    });

    // Seed tracked keywords
    if (applied.keywords.length > 0) {
      await prisma.trackedKeyword.createMany({
        data: applied.keywords.map((k) => ({
          siteId: site.id,
          keyword: k.keyword,
          tier: k.tier,
          volume: k.volume,
          competition: k.competition,
          intent: k.intent,
          targetPage: k.targetPage,
        })),
        skipDuplicates: true,
      });
    }

    // Seed tasks
    if (applied.tasks.length > 0) {
      await prisma.seoTask.createMany({
        data: applied.tasks.map((t) => ({
          siteId: site.id,
          phase: t.phase,
          title: t.title,
          status: t.status,
          priority: t.priority,
        })),
      });
    }

    // Seed content ideas
    if (applied.contentIdeas.length > 0) {
      await prisma.contentIdea.createMany({
        data: applied.contentIdeas.map((i) => ({
          siteId: site.id,
          title: i.title,
          targetKeyword: i.targetKeyword,
          wordCount: i.wordCount,
          funnelStage: i.funnelStage,
        })),
      });
    }

    // Seed pages
    if (applied.pages.length > 0) {
      await prisma.sitePage.createMany({
        data: applied.pages.map((p) => ({
          siteId: site.id,
          path: p.path,
          kind: p.kind,
          title: p.title,
          source: p.source,
          status: "active",
        })),
        skipDuplicates: true,
      });
    }
  }

  // Auto-switch to the new site
  const response = NextResponse.json({
    success: true,
    site: {
      id: site.id,
      name: site.name,
      domain: site.domain,
      slug: site.slug,
    },
  });

  response.cookies.set(SITE_COOKIE, site.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
