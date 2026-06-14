/* ── Comedian / Live Comedy Website Intake API ──
 * POST /api/comedian-intake — see lib/intake/submission.ts for shared logic.
 */

import { NextRequest } from "next/server";
import { handleIntakeSubmission } from "@/lib/intake/submission";
import { COMEDIAN_INTAKE_CONFIG } from "@/lib/intake/config-comedian";

export async function POST(req: NextRequest) {
  return handleIntakeSubmission(req, COMEDIAN_INTAKE_CONFIG);
}
