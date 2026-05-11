import { NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";
import {
  isGoogleOAuthConfigured,
  GOOGLE_OAUTH_SCOPES,
  type GoogleOAuthIntegrationType,
} from "@/lib/google-oauth";
import { decryptCredential } from "@/lib/credential-encryption";

export const dynamic = "force-dynamic";

/**
 * GET /api/integrations/google/status
 *
 * Returns per-integration connection status for the active site. Decrypts
 * stored credentials only enough to surface scope + granted_at.
 */
export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;

  const types = Object.keys(GOOGLE_OAUTH_SCOPES) as GoogleOAuthIntegrationType[];
  const rows = await prisma.integrationCredential.findMany({
    where: { siteId: ctx.siteId, type: { in: types } },
  });

  const byType = new Map(rows.map((r) => [r.type as GoogleOAuthIntegrationType, r]));

  const integrations = types.map((type) => {
    const row = byType.get(type);
    let grantedAt: string | null = null;
    let scope: string | null = null;

    if (row?.isActive && row.authType === "oauth" && row.encryptedCredentials) {
      try {
        const parsed = JSON.parse(decryptCredential(row.encryptedCredentials));
        grantedAt = parsed.granted_at ?? null;
        scope = parsed.scope ?? null;
      } catch {
        // Stored credential present but undecryptable (key rotated?); treat as disconnected
      }
    }

    return {
      type,
      connected: !!(row?.isActive && row.authType === "oauth" && grantedAt),
      authType: row?.authType ?? null,
      grantedAt,
      scope,
      property: row?.property || null,
    };
  });

  return NextResponse.json({
    oauthConfigured: isGoogleOAuthConfigured(),
    integrations,
  });
}
