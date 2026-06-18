/* ── Shared intake submission handler ──
 * Used by both /api/artist-intake and /api/comedian-intake. Saves the
 * submission as a FormSubmission (with the vertical's own FormSource +
 * service label, and the full form payload in metadata) and fires the
 * notification + auto-reply emails.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site-context";
import { sendIntakeNotification } from "@/lib/email";
import { validateFormSecurity, getClientIp, verifyRecaptcha } from "@/lib/form-security";
import type { IntakeConfig } from "@/lib/intake/types";

export async function handleIntakeSubmission(req: NextRequest, config: IntakeConfig) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    const ip = getClientIp(req);
    const rejection = await validateFormSecurity(ip, body);
    if (rejection) return rejection;

    const recaptchaOk = await verifyRecaptcha(body.recaptchaToken as string | undefined);
    if (!recaptchaOk) {
      return NextResponse.json({ error: "Bot check failed. Please try again." }, { status: 422 });
    }

    const contactName = body.contactName as string | undefined;
    const contactEmail = body.contactEmail as string | undefined;
    const contactPhone = body.contactPhone as string | undefined;
    const entityName = body[config.entityNameKey] as string | undefined;

    if (!contactName || !contactEmail || !entityName) {
      return NextResponse.json(
        { error: `Contact name, email, and ${config.entityTitle.toLowerCase()} name are required.` },
        { status: 400 },
      );
    }

    const siteId = DEFAULT_SITE_ID;

    // Strip security + redundant contact fields; keep everything else (incl. entity name) in metadata.
    const { recaptchaToken: _rt, _started: _s, website_url: _w, contactName: _cn, contactEmail: _ce, contactPhone: _cp, ...rest } = body;
    void _rt; void _s; void _w; void _cn; void _ce; void _cp;

    // Upsert contact
    let contact = await prisma.contact.findFirst({ where: { siteId, email: contactEmail } });
    if (!contact) {
      contact = await prisma.contact.create({
        data: { siteId, fullName: contactName, email: contactEmail, phone: contactPhone, company: entityName },
      });
    }

    const submission = await prisma.formSubmission.create({
      data: {
        siteId,
        source: config.source,
        service: config.serviceLabel,
        fullName: contactName,
        email: contactEmail,
        phone: contactPhone,
        company: entityName,
        message: `${config.entityTitle} Website Intake — ${entityName}`,
        metadata: rest as object,
        contactId: contact.id,
      },
    });

    // Fire-and-forget email
    sendIntakeNotification(config, body).catch((err) =>
      console.error(`[POST ${config.endpoint}] Email error:`, err),
    );

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error(`[POST ${config.endpoint}] Error:`, error);
    return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
  }
}
