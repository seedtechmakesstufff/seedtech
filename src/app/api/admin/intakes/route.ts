import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// GET /api/admin/intakes — list all intakes
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const intakes = await prisma.clientIntake.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      token: true,
      companyName: true,
      contactEmail: true,
      assetDriveUrl: true,
      status: true,
      notes: true,
      siteId: true,
      createdAt: true,
      submittedAt: true,
      formType: true,
    },
  });

  return NextResponse.json(intakes);
}

// POST /api/admin/intakes — create a new intake link
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { companyName, contactEmail, assetDriveUrl, notes, siteId, formType } = body;

  if (!companyName?.trim()) {
    return NextResponse.json({ error: "companyName is required" }, { status: 400 });
  }

  const token = crypto.randomBytes(24).toString("hex");

  const intake = await prisma.clientIntake.create({
    data: {
      token,
      companyName: companyName.trim(),
      contactEmail: contactEmail?.trim() || null,
      assetDriveUrl: assetDriveUrl?.trim() || null,
      notes: notes?.trim() || null,
      siteId: siteId || null,
      formType: formType || "service",
    },
  });

  return NextResponse.json(intake, { status: 201 });
}
