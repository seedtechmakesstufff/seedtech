/* ── Contact Form API ──
 * POST /api/contact — saves contact page submissions to DB.
 * Creates or finds an existing Contact, then creates a FormSubmission.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, company, service, message } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full name, email, and message are required." },
        { status: 400 }
      );
    }

    // Upsert contact (find by email or create)
    let contact = await prisma.contact.findFirst({ where: { email } });
    if (!contact) {
      contact = await prisma.contact.create({
        data: { fullName, email, company },
      });
    }

    // Create submission
    const submission = await prisma.formSubmission.create({
      data: {
        source: "contact_page",
        fullName,
        email,
        company,
        service,
        message,
        contactId: contact.id,
      },
    });

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/contact] Error:", error);
    return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
  }
}
