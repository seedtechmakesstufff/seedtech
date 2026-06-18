/* ── SeedTech Helpdesk (Firebase) lookup ──
 *
 * Server-only. Validates booking ticket numbers against the helpdesk's
 * Firestore (`tickets` collection) using the Firebase Admin SDK.
 *
 * Required env (set in Vercel, Production):
 *   FIREBASE_HELPDESK_SERVICE_ACCOUNT  — the full service-account JSON, as a
 *     single value (downloaded from Firebase console → Project settings →
 *     Service accounts → Generate new private key).
 *
 * Optional env:
 *   HELPDESK_CLOSED_STATUSES — comma-separated statuses treated as NOT open.
 *     Defaults to: closed,resolved,cancelled,canceled,done
 *
 * A ticket is "valid" when a `tickets` doc has a matching `ticketNumber` and a
 * `status` that is not in the closed set.
 */

import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const APP_NAME = "helpdesk";

const CLOSED_STATUSES = (
  process.env.HELPDESK_CLOSED_STATUSES ||
  "closed,resolved,cancelled,canceled,done"
)
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

let cachedApp: App | null = null;

function getHelpdeskApp(): App {
  if (cachedApp) return cachedApp;

  const raw = process.env.FIREBASE_HELPDESK_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_HELPDESK_SERVICE_ACCOUNT is not configured");
  }

  const json = JSON.parse(raw) as {
    project_id?: string;
    client_email?: string;
    private_key?: string;
  };
  const serviceAccount: ServiceAccount = {
    projectId: json.project_id,
    clientEmail: json.client_email,
    // Some env stores escape the key's newlines; normalize them back.
    privateKey: json.private_key?.replace(/\\n/g, "\n"),
  };

  const existing = getApps().find((a) => a.name === APP_NAME);
  cachedApp =
    existing ??
    initializeApp({ credential: cert(serviceAccount) }, APP_NAME);
  return cachedApp;
}

export type TicketCheckReason = "not_found" | "not_open";

export type TicketCheck =
  | { ok: true }
  | { ok: false; reason: TicketCheckReason };

// Helpdesk ticket numbers are TKT-<6 digits>, e.g. "TKT-000862". Visitors type
// just the digits; we build the canonical form for the Firestore match.
const TICKET_PREFIX = "TKT-";

function normalizeTicketNumber(raw: string): string | null {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return null;
  return `${TICKET_PREFIX}${digits.padStart(6, "0")}`;
}

/**
 * Look up a ticket number in the helpdesk and report whether it maps to an
 * open ticket. Throws if the integration is misconfigured or Firestore errors,
 * so callers can distinguish "invalid ticket" from "we couldn't check".
 */
export async function checkTicketOpen(
  ticketNumberRaw: string
): Promise<TicketCheck> {
  const ticketNumber = normalizeTicketNumber(ticketNumberRaw);
  if (!ticketNumber) return { ok: false, reason: "not_found" };

  const db = getFirestore(getHelpdeskApp());
  const snap = await db
    .collection("tickets")
    .where("ticketNumber", "==", ticketNumber)
    .limit(1)
    .get();

  if (snap.empty) return { ok: false, reason: "not_found" };

  const status = String(snap.docs[0].get("status") ?? "")
    .trim()
    .toLowerCase();
  if (CLOSED_STATUSES.includes(status)) {
    return { ok: false, reason: "not_open" };
  }

  return { ok: true };
}
