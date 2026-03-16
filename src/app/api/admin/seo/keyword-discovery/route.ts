import { NextResponse } from "next/server";
import { discoverKeywords } from "@/lib/seo-insights";

export async function POST() {
  try {
    const result = await discoverKeywords();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
