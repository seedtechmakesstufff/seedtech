/* ── Artist / Touring Website Intake API ──
 * POST /api/artist-intake — see lib/intake/submission.ts for shared logic.
 */

import { NextRequest } from "next/server";
import { handleIntakeSubmission } from "@/lib/intake/submission";
import { ARTIST_INTAKE_CONFIG } from "@/lib/intake/config-artist";

export async function POST(req: NextRequest) {
  return handleIntakeSubmission(req, ARTIST_INTAKE_CONFIG);
}
