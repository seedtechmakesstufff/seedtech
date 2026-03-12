import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getBusinessContext, saveBusinessContext, BusinessContext } from "@/lib/business-context";

/**
 * GET /api/admin/settings/business-context
 * Returns the current business context used by the AI.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ctx = getBusinessContext();
  return NextResponse.json(ctx);
}

/**
 * PUT /api/admin/settings/business-context
 * Updates the business context.
 */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<BusinessContext>;

  // Merge with existing context (so partial updates work)
  const existing = getBusinessContext();
  const updated: BusinessContext = {
    ...existing,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  saveBusinessContext(updated);
  return NextResponse.json(updated);
}
