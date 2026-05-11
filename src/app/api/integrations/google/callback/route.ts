import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { decodeState, exchangeCode, type GoogleOAuthIntegrationType } from "@/lib/google-oauth";
import { encryptCredential } from "@/lib/credential-encryption";
import { prisma } from "@/lib/prisma";
import type { IntegrationType } from "@prisma/client";

export const dynamic = "force-dynamic";

const TYPE_TO_INTEGRATION: Record<GoogleOAuthIntegrationType, IntegrationType> = {
  google_search_console: "google_search_console",
  google_analytics: "google_analytics",
  google_business_profile: "google_business_profile",
};

/**
 * GET /api/integrations/google/callback?code=...&state=...
 *
 * Google redirects here after consent. We:
 *   1. Verify the user is signed in and the state nonce matches our cookie
 *   2. Exchange the code for tokens
 *   3. Encrypt the refresh token and upsert one IntegrationCredential per requested type
 *   4. Redirect back to the admin integrations page
 */
export async function GET(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const dest = new URL("/admin/seo/settings/integrations", url.origin);

  const fail = (reason: string) => {
    dest.searchParams.set("oauth_error", reason);
    const r = NextResponse.redirect(dest);
    r.cookies.delete("google_oauth_nonce");
    return r;
  };

  if (oauthError) return fail(oauthError);
  if (!code || !stateParam) return fail("missing_params");

  let state;
  try {
    state = decodeState(stateParam);
  } catch {
    return fail("bad_state");
  }

  const cookieNonce = req.cookies.get("google_oauth_nonce")?.value;
  if (!cookieNonce || cookieNonce !== state.nonce) return fail("csrf");
  if (state.siteId !== ctx.siteId) return fail("site_mismatch");

  let tokens;
  try {
    tokens = await exchangeCode(code);
  } catch (e) {
    console.error("[oauth] exchange failed", e);
    return fail("exchange_failed");
  }

  const encrypted = encryptCredential(
    JSON.stringify({
      refresh_token: tokens.refreshToken,
      scope: tokens.scope,
      granted_at: new Date().toISOString(),
    })
  );

  for (const type of state.types) {
    const integrationType = TYPE_TO_INTEGRATION[type];
    await prisma.integrationCredential.upsert({
      where: { siteId_type: { siteId: ctx.siteId, type: integrationType } },
      update: {
        authType: "oauth",
        encryptedCredentials: encrypted,
        isActive: true,
      },
      create: {
        siteId: ctx.siteId,
        type: integrationType,
        authType: "oauth",
        encryptedCredentials: encrypted,
        property: "",
      },
    });
  }

  dest.searchParams.set("oauth_success", state.types.join(","));
  const res = NextResponse.redirect(dest);
  res.cookies.delete("google_oauth_nonce");
  return res;
}
