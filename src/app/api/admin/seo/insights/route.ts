import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import {
  generateAllInsights,
  getActiveInsights,
  updateInsightStatus,
} from "@/lib/seo-insights";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const insights = await getActiveInsights();
    return NextResponse.json({ insights });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  try {
    if (action === "generate") {
      const insights = await generateAllInsights();
      return NextResponse.json({ insights, count: insights.length });
    }

    if (action === "dismiss" || action === "resolve") {
      const body = await req.json();
      const id = (body as { id?: string }).id;
      if (!id) return NextResponse.json({ error: "Missing insight id" }, { status: 400 });
      const status = action === "dismiss" ? "dismissed" : "resolved";
      await updateInsightStatus(id, status);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid action. Use ?action=generate, ?action=dismiss, or ?action=resolve" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
