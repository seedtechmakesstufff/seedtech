import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { takeSnapshot, getSnapshotHistory, getKeywordTrends } from "@/lib/seo-snapshot";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  try {
    if (action === "history") {
      const limit = parseInt(searchParams.get("limit") || "12", 10);
      const history = await getSnapshotHistory(limit);
      return NextResponse.json({ history });
    }

    if (action === "keyword-trends") {
      const limit = parseInt(searchParams.get("limit") || "12", 10);
      const trends = await getKeywordTrends(limit);
      return NextResponse.json({ trends });
    }

    return NextResponse.json({ error: "Invalid action. Use ?action=history or ?action=keyword-trends" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await takeSnapshot();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
