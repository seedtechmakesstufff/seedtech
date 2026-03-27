/* ── Contact Form API ──
 * POST /api/contact — saves contact page submissions to DB.
 * Creates or finds an existing Contact, then creates a FormSubmission.
 * Sends internal notification + auto-reply via Resend.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site-context";
import { sendContactNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, company, service, message } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full name, email, and message are required." },
        { status: 400 }
      );
    }

    const siteId = DEFAULT_SITE_ID;

    // Upsert contact (find by email or create)
    let contact = await prisma.contact.findFirst({ where: { siteId, email } });
    if (!contact) {
      contact = await prisma.contact.create({
        data: { siteId, fullName, email, phone, company },
      });
    }

    // Create submission
    const submission = await prisma.formSubmission.create({
      data: {
        siteId,
        source: "contact_page",
        fullName,
        email,
        phone,
        company,
        service,
        message,
        contactId: contact.id,
      },
    });

    // Fire-and-forget emails — don't let email failure block the 201 response
    sendContactNotification({ fullName, email, phone, company, service, message }).catch((err) =>
      console.error("[POST /api/contact] Email error:", err)
    );

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/contact] Error:", error);
    return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
  }
}
