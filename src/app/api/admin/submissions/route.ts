/* ── Admin Submissions API ──
 * GET  /api/admin/submissions        — list all submissions (with optional filters)
 * PATCH /api/admin/submissions       — update submission status
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const source = url.searchParams.get("source"); // "contact_page" | "quote_it" | "quote_web"
  const status = url.searchParams.get("status"); // "new" | "read" | "replied" | "archived"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (source) where.source = source;
  if (status) where.status = status;

  const submissions = await prisma.formSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { contact: true },
  });

  return NextResponse.json(submissions);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  const validStatuses = ["new", "read", "replied", "archived"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.formSubmission.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}
