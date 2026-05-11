/* ── Credential Encryption ──
 * AES-256-GCM symmetric encryption for IntegrationCredential.encryptedCredentials.
 * Used for OAuth refresh tokens, service-account keys, and any other sensitive
 * per-site secrets stored in the database.
 *
 * Key: CREDENTIAL_ENCRYPTION_KEY (env) — 32 bytes hex (64 hex chars).
 * Generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
 *
 * Encoded format: `${iv_b64}.${authTag_b64}.${ciphertext_b64}`
 */

import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const KEY_LEN = 32;

let cachedKey: Buffer | null = null;

function getKey(): Buffer {
  if (cachedKey) return cachedKey;
  const raw = process.env.CREDENTIAL_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "CREDENTIAL_ENCRYPTION_KEY is not set. Generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }
  const buf = Buffer.from(raw, "hex");
  if (buf.length !== KEY_LEN) {
    throw new Error(
      `CREDENTIAL_ENCRYPTION_KEY must decode to ${KEY_LEN} bytes (got ${buf.length}). Expected 64 hex chars.`
    );
  }
  cachedKey = buf;
  return buf;
}

export function encryptCredential(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    iv.toString("base64"),
    tag.toString("base64"),
    ct.toString("base64"),
  ].join(".");
}

export function decryptCredential(encoded: string): string {
  const parts = encoded.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted credential format");
  }
  const [ivB64, tagB64, ctB64] = parts as [string, string, string];
  const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const pt = Buffer.concat([
    decipher.update(Buffer.from(ctB64, "base64")),
    decipher.final(),
  ]);
  return pt.toString("utf8");
}

/** Heuristic: encoded values produced by `encryptCredential` have exactly 2 dots. */
export function isEncrypted(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  return parts.every((p) => /^[A-Za-z0-9+/=]+$/.test(p));
}
