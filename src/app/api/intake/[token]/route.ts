import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/intake/[token] — public, returns just enough for the form to render
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const intake = await prisma.clientIntake.findUnique({
    where: { token: params.token },
    select: {
      id: true,
      companyName: true,
      assetDriveUrl: true,
      status: true,
      formType: true,
    },
  });

  if (!intake) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(intake);
}

// POST /api/intake/[token] — public submit
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const intake = await prisma.clientIntake.findUnique({
    where: { token: params.token },
    select: { id: true, status: true },
  });

  if (!intake) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (intake.status === "submitted") {
    return NextResponse.json({ error: "Already submitted" }, { status: 409 });
  }

  const body = await req.json();

  await prisma.clientIntake.update({
    where: { token: params.token },
    data: {
      submissionData: body,
      status: "submitted",
      submittedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
