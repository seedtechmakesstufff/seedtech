/* ── Unread Submissions Count ──
 * GET /api/admin/submissions/unread — Returns count of submissions with status "new"
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const count = await prisma.formSubmission.count({
    where: { status: "new" },
  });

  return NextResponse.json({ count });
}
