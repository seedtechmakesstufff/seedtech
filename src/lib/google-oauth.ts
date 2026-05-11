/* ── Google OAuth (user-consent flow) ──
 * Single OAuth client used to authorize a user against Google Search Console,
 * Google Analytics 4, and Google Business Profile in one consent screen.
 *
 * Environment:
 *   GOOGLE_OAUTH_CLIENT_ID
 *   GOOGLE_OAUTH_CLIENT_SECRET
 *   GOOGLE_OAUTH_REDIRECT_URI    e.g. https://seedtechllc.com/api/integrations/google/callback
 *
 * Refresh tokens are persisted (encrypted) in IntegrationCredential.encryptedCredentials
 * keyed by (siteId, type). Access tokens are derived on demand from the refresh token.
 */

import { google } from "googleapis";
import type { IntegrationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { decryptCredential } from "@/lib/credential-encryption";

export const GOOGLE_OAUTH_SCOPES = {
  google_search_console: ["https://www.googleapis.com/auth/webmasters.readonly"],
  google_analytics: ["https://www.googleapis.com/auth/analytics.readonly"],
  google_business_profile: ["https://www.googleapis.com/auth/business.manage"],
} as const;

export type GoogleOAuthIntegrationType = keyof typeof GOOGLE_OAUTH_SCOPES;

const VALID_TYPES = new Set<string>(Object.keys(GOOGLE_OAUTH_SCOPES));

export function isGoogleOAuthIntegrationType(s: string): s is GoogleOAuthIntegrationType {
  return VALID_TYPES.has(s);
}

export function isGoogleOAuthConfigured(): boolean {
  return !!(
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
    process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
    process.env.GOOGLE_OAUTH_REDIRECT_URI
  );
}

export function getOAuthClient() {
  if (!isGoogleOAuthConfigured()) {
    throw new Error(
      "Google OAuth not configured. Set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI."
    );
  }
  return new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URI
  );
}

export interface OAuthState {
  siteId: string;
  types: GoogleOAuthIntegrationType[];
  nonce: string;
}

export function encodeState(state: OAuthState): string {
  return Buffer.from(JSON.stringify(state)).toString("base64url");
}

export function decodeState(encoded: string): OAuthState {
  const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (
    !parsed ||
    typeof parsed.siteId !== "string" ||
    typeof parsed.nonce !== "string" ||
    !Array.isArray(parsed.types) ||
    !parsed.types.every((t: unknown) => typeof t === "string" && isGoogleOAuthIntegrationType(t))
  ) {
    throw new Error("Invalid OAuth state");
  }
  return parsed as OAuthState;
}

export function buildAuthUrl(types: GoogleOAuthIntegrationType[], state: OAuthState): string {
  const scopes = Array.from(new Set(types.flatMap((t) => GOOGLE_OAUTH_SCOPES[t])));
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // force refresh_token issuance even on re-auth
    scope: scopes,
    state: encodeState(state),
    include_granted_scopes: true,
  });
}

export interface ExchangedTokens {
  refreshToken: string;
  accessToken: string;
  scope: string;
  expiryDate: number | null;
}

export async function exchangeCode(code: string): Promise<ExchangedTokens> {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh_token. Revoke the existing grant at myaccount.google.com/permissions and reconnect."
    );
  }
  return {
    refreshToken: tokens.refresh_token,
    accessToken: tokens.access_token ?? "",
    scope: tokens.scope ?? "",
    expiryDate: tokens.expiry_date ?? null,
  };
}

/** Returns an OAuth2 client primed with a refresh token; access tokens auto-refresh. */
export function getAuthorizedClient(refreshToken: string) {
  const client = getOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

interface StoredCredential {
  refresh_token: string;
  scope: string;
  granted_at: string;
}

/**
 * Load and decrypt a stored OAuth refresh token for a given site + integration.
 * Returns null if no active OAuth credential exists.
 */
export async function getStoredOAuthCredential(
  siteId: string,
  type: IntegrationType
): Promise<StoredCredential | null> {
  const row = await prisma.integrationCredential.findUnique({
    where: { siteId_type: { siteId, type } },
  });
  if (!row || !row.isActive || row.authType !== "oauth" || !row.encryptedCredentials) {
    return null;
  }
  const decrypted = decryptCredential(row.encryptedCredentials);
  return JSON.parse(decrypted) as StoredCredential;
}
