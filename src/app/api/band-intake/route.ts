/* ── Band / Touring Website Intake API ──
 * POST /api/band-intake — saves intake submissions and fires an email notification.
 * Stores to DB as a FormSubmission (contact_page source, service="band_intake")
 * with the full form data in the metadata Json field.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site-context";
import { sendBandIntakeNotification } from "@/lib/email";
import { validateFormSecurity, getClientIp, verifyRecaptcha } from "@/lib/form-security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ip = getClientIp(req);
    const rejection = await validateFormSecurity(ip, body);
    if (rejection) return rejection;

    const recaptchaOk = await verifyRecaptcha(body.recaptchaToken as string | undefined);
    if (!recaptchaOk) {
      return NextResponse.json({ error: "Bot check failed. Please try again." }, { status: 422 });
    }

    const {
      contactName, contactEmail, contactPhone, bandName,
      // strip security fields
      recaptchaToken: _rt, _started: _s, website_url: _w,
      ...rest
    } = body as Record<string, unknown>;

    if (!contactName || !contactEmail || !bandName) {
      return NextResponse.json(
        { error: "Contact name, email, and band name are required." },
        { status: 400 }
      );
    }

    const siteId = DEFAULT_SITE_ID;

    // Upsert contact
    let contact = await prisma.contact.findFirst({
      where: { siteId, email: contactEmail as string },
    });
    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          siteId,
          fullName: contactName as string,
          email: contactEmail as string,
          phone: contactPhone as string | undefined,
          company: bandName as string,
        },
      });
    }

    // Save submission — use existing contact_page source, service field identifies this as band_intake
    const submission = await prisma.formSubmission.create({
      data: {
        siteId,
        source: "contact_page",
        service: "band_intake",
        fullName: contactName as string,
        email: contactEmail as string,
        phone: contactPhone as string | undefined,
        company: bandName as string,
        message: `Band & Touring Website Intake — ${bandName}`,
        metadata: { bandName, ...rest } as object,
        contactId: contact.id,
      },
    });

    // Fire-and-forget email
    sendBandIntakeNotification(body as Record<string, unknown>).catch((err) =>
      console.error("[POST /api/band-intake] Email error:", err)
    );

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/band-intake] Error:", error);
    return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
  }
}
