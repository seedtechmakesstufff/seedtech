import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireSiteContext } from "@/lib/site-context";
import {
  buildAuthUrl,
  isGoogleOAuthConfigured,
  isGoogleOAuthIntegrationType,
  GOOGLE_OAUTH_SCOPES,
  type GoogleOAuthIntegrationType,
} from "@/lib/google-oauth";

export const dynamic = "force-dynamic";

/**
 * GET /api/integrations/google/connect?types=google_business_profile,google_analytics
 *
 * Redirects the signed-in admin to Google's consent screen for the requested
 * integration types. On consent, Google redirects back to /callback.
 */
export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  if (!isGoogleOAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Google OAuth not configured. Set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, and GOOGLE_OAUTH_REDIRECT_URI.",
      },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const typesParam = url.searchParams.get("types") ?? url.searchParams.get("type") ?? "";
  const requested = typesParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!requested.length) {
    return NextResponse.json(
      {
        error:
          "Missing 'types' query param. Use comma-separated values from: " +
          Object.keys(GOOGLE_OAUTH_SCOPES).join(", "),
      },
      { status: 400 }
    );
  }

  const invalid = requested.filter((t) => !isGoogleOAuthIntegrationType(t));
  if (invalid.length) {
    return NextResponse.json(
      { error: `Invalid integration type(s): ${invalid.join(", ")}` },
      { status: 400 }
    );
  }
  const types = requested as GoogleOAuthIntegrationType[];

  const nonce = crypto.randomBytes(16).toString("hex");
  const authUrl = buildAuthUrl(types, { siteId: ctx.siteId, types, nonce });

  const res = NextResponse.redirect(authUrl);
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600, // 10 minutes
  };
  res.cookies.set("google_oauth_nonce", nonce, cookieOpts);
  return res;
}
