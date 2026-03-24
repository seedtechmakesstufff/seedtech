import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * GET  /api/admin/seo/competitors — List competitor domains
 * POST /api/admin/seo/competitors — Add a competitor domain
 */

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const competitors = await prisma.competitorDomain.findMany({
    where: { isActive: true },
    orderBy: { overlapKeywords: "desc" },
  });

  return NextResponse.json({ competitors });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { domain, name, notes } = body;

  if (!domain || !name) {
    return NextResponse.json(
      { error: "domain and name are required" },
      { status: 400 }
    );
  }

  const competitor = await prisma.competitorDomain.upsert({
    where: { domain },
    update: { name, notes, isActive: true },
    create: { domain, name, notes },
  });

  return NextResponse.json({ competitor });
}
