/* ── Quote Submission API ──
 * POST /api/quote-submission — saves IT / Web quote flow submissions to DB.
 * Creates or finds an existing Contact, then creates a FormSubmission.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateEmail } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      source,        // "quote_it" | "quote_web"
      fullName,
      email,
      phone,
      company,       // businessName from form
      tier,          // selected tier name
      metadata,      // anything extra (addons, budget, notes, currentSiteUrl, etc.)
    } = body;

    if (!fullName || !email || !source) {
      return NextResponse.json(
        { error: "Full name, email, and source are required." },
        { status: 400 }
      );
    }

    // Validate email format + TLD
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return NextResponse.json(
        { error: emailCheck.error, suggestion: emailCheck.suggestion },
        { status: 400 }
      );
    }

    // Validate source enum
    if (!["quote_it", "quote_web"].includes(source)) {
      return NextResponse.json({ error: "Invalid source." }, { status: 400 });
    }

    // Upsert contact
    let contact = await prisma.contact.findFirst({ where: { email } });
    if (!contact) {
      contact = await prisma.contact.create({
        data: { fullName, email, phone, company },
      });
    } else {
      // Update phone/company if newly provided
      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          ...(phone && !contact.phone ? { phone } : {}),
          ...(company && !contact.company ? { company } : {}),
        },
      });
    }

    // Create submission
    const submission = await prisma.formSubmission.create({
      data: {
        source,
        fullName,
        email,
        phone,
        company,
        tier,
        metadata: metadata ?? undefined,
        contactId: contact.id,
      },
    });

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/quote-submission] Error:", error);
    return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
  }
}
