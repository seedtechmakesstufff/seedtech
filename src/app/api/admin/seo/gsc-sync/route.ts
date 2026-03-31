/**
 * GET  /api/admin/seo/gsc-sync — returns sync status (last sync, staleness)
 * POST /api/admin/seo/gsc-sync — trigger a GSC sync (force=true to override staleness)
 */

import { NextResponse, NextRequest } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { getGscSyncStatus, syncGscData } from "@/lib/gsc-sync";
import { isSearchConsoleConfigured } from "@/lib/google-search-console";

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx;

  const configured = isSearchConsoleConfigured();
  const status = await getGscSyncStatus(siteId);

  return NextResponse.json({
    configured,
    ...status,
  });
}

export async function POST(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx;

  if (!isSearchConsoleConfigured()) {
    return NextResponse.json(
      { error: "GSC not configured. Set environment variables first." },
      { status: 400 }
    );
  }

  let force = false;
  try {
    const body = await req.json();
    force = body.force === true;
  } catch {
    // No body or invalid JSON — that's fine, use defaults
  }

  const result = await syncGscData(siteId, { force });

  return NextResponse.json(result);
}
