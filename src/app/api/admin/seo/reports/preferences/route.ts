import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/** GET /api/admin/seo/reports/preferences — list report preferences for current site */
export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const prefs = await prisma.reportPreference.findMany({
    where: { siteId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ preferences: prefs });
}

/** POST /api/admin/seo/reports/preferences — create or update a report preference */
export async function POST(req: Request) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Look up the user
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();
  const { frequency, email, dayOfWeek, dayOfMonth, enabled } = body as {
    frequency?: string;
    email?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    enabled?: boolean;
  };

  const validFreqs = ["weekly", "monthly", "quarterly", "yearly"];

  const pref = await prisma.reportPreference.upsert({
    where: { siteId_userId: { siteId, userId: user.id } },
    update: {
      ...(frequency && validFreqs.includes(frequency) && { frequency: frequency as "weekly" | "monthly" | "quarterly" | "yearly" }),
      ...(email && { email }),
      ...(dayOfWeek !== undefined && { dayOfWeek }),
      ...(dayOfMonth !== undefined && { dayOfMonth }),
      ...(enabled !== undefined && { enabled }),
    },
    create: {
      siteId,
      userId: user.id,
      email: email || session.user.email,
      frequency: (frequency && validFreqs.includes(frequency) ? frequency : "monthly") as "weekly" | "monthly" | "quarterly" | "yearly",
      dayOfWeek: dayOfWeek ?? 1,
      dayOfMonth: dayOfMonth ?? 1,
      enabled: enabled ?? true,
    },
  });

  return NextResponse.json({ preference: pref });
}

/** DELETE /api/admin/seo/reports/preferences — remove current user's preference */
export async function DELETE() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    await prisma.reportPreference.delete({
      where: { siteId_userId: { siteId, userId: user.id } },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No preference found" }, { status: 404 });
  }
}
