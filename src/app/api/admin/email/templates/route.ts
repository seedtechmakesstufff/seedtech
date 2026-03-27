/**
 * GET  /api/admin/email/templates        — fetch all 5 template configs (with overrides merged)
 * PATCH /api/admin/email/templates       — upsert a single template override
 * DELETE /api/admin/email/templates?key= — reset a template to default
 */
import { NextRequest, NextResponse } from "next/server";
import { requireSiteContext } from "@/lib/site-context";
import type { SiteContext } from "@/lib/site-context";
import { prisma } from "@/lib/prisma";
import { EmailTemplateKey } from "@prisma/client";

export const dynamic = "force-dynamic";

/** Default values for each template key — mirrors email-templates.ts */
const DEFAULTS: Record<EmailTemplateKey, { label: string; description: string; subject: string; heading: string; body: string; trigger: string }> = {
  contact_notification: {
    label: "Contact Form — Internal Alert",
    description: "Sent to your admin email(s) when someone submits the contact form.",
    trigger: "Contact form submission",
    subject: "📬 New Contact Form — {{fullName}}",
    heading: "New Contact Form Submission",
    body: "Someone reached out through the contact page.\n\nContact Info\n• Name: {{fullName}}\n• Email: {{email}}\n• Phone: {{phone}}\n• Company: {{company}}\n• Service Interested In: {{service}}\n\nMessage\n{{message}}\n\nClick the reply button to respond directly.",
  },
  contact_auto_reply: {
    label: "Contact Form — Auto-Reply",
    description: "Sent automatically to the person who submitted the contact form.",
    trigger: "Contact form submission",
    subject: "We got your message — {{companyName}}",
    heading: "We got your message, {{firstName}}.",
    body: "A member of our team will be in touch within 1 business day.\n\nHere's a summary of what you submitted:\n• Name: {{fullName}}\n• Email: {{email}}\n• Phone: {{phone}}\n• Company: {{company}}\n• Service: {{service}}\n\nYour Message\n{{message}}\n\nIf your request is urgent, reply to this email and we'll get back to you right away.",
  },
  quote_notification: {
    label: "Quote Request — Internal Alert",
    description: "Sent to your admin email(s) when a quote flow is completed.",
    trigger: "Quote form submission",
    subject: "🧾 New {{serviceLabel}} Quote — {{fullName}}",
    heading: "New {{serviceLabel}} Quote Request",
    body: "A prospective client completed the quote flow.\n\nContact Info\n• Name: {{fullName}}\n• Email: {{email}}\n• Phone: {{phone}}\n• Company: {{company}}\n• Service: {{serviceLabel}}\n• Selected Package: {{tier}}\n\nQuote Details\n• Seats / Users: {{seats}}\n• MDM Add-On: {{includeMdm}}\n• Estimated Yearly Cost: {{yearlyCost}}\n• Notes: {{dealNotes}}\n\nWeb Details (if applicable)\n• Current Website: {{currentSiteUrl}}\n• Project Notes: {{notes}}\n\nClick the reply button to respond directly.",
  },
  quote_auto_reply: {
    label: "Quote Request — Auto-Reply",
    description: "Sent automatically to the person who submitted a quote request.",
    trigger: "Quote form submission",
    subject: "Your {{serviceLabel}} quote request — {{companyName}}",
    heading: "Thanks for your quote request, {{firstName}}.",
    body: "We'll review your {{serviceLabel}} needs and get back to you within 1 business day.\n\nHere's a summary of your submission:\n• Name: {{fullName}}\n• Email: {{email}}\n• Phone: {{phone}}\n• Company: {{company}}\n• Service: {{serviceLabel}}\n• Selected Package: {{tier}}\n\nQuote Details\n• Seats / Users: {{seats}}\n• MDM Add-On: {{includeMdm}}\n• Estimated Yearly Cost: ${{yearlyCost}}\n• Notes: {{dealNotes}}\n\nWeb Details (if applicable)\n• Current Website: {{currentSiteUrl}}\n• Project Notes: {{notes}}\n\nOne of our specialists will reach out to discuss your project in detail and put together a custom proposal.\n\nQuestions? Reply to this email and we'll get back to you right away.",
  },
  team_invite: {
    label: "Team Invite",
    description: "Sent to a new team member when they are invited to the admin platform.",
    trigger: "Admin team invite",
    subject: "You've been invited to join {{teamName}}",
    heading: "You've been invited to {{teamName}}.",
    body: "{{inviterName}} has added you to the admin platform. Click the button below to accept your invitation and set up your account. This link expires in 7 days.\n\nIf you didn't expect this invitation, you can safely ignore this email.",
  },
};

export async function GET() {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const overrides = await prisma.emailTemplateOverride.findMany({ where: { siteId } });
  const overrideMap = Object.fromEntries(overrides.map((o) => [o.key, o]));

  const templates = (Object.keys(DEFAULTS) as EmailTemplateKey[]).map((key) => {
    const def = DEFAULTS[key];
    const ovr = overrideMap[key];
    return {
      key,
      label: def.label,
      description: def.description,
      trigger: def.trigger,
      // Show override if exists, else default
      subject: ovr?.subject ?? def.subject,
      heading: ovr?.heading ?? def.heading,
      body: ovr?.body ?? def.body,
      enabled: ovr?.enabled ?? true,
      isCustomized: !!ovr,
      // Include defaults for reset UI
      defaultSubject: def.subject,
      defaultHeading: def.heading,
      defaultBody: def.body,
    };
  });

  return NextResponse.json(templates);
}

export async function PATCH(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const body = await req.json();
  const { key, subject, heading, body: bodyText, enabled } = body;

  if (!key || !(key in DEFAULTS)) {
    return NextResponse.json({ error: "Invalid template key" }, { status: 400 });
  }

  const result = await prisma.emailTemplateOverride.upsert({
    where: { siteId_key: { siteId, key } },
    update: {
      ...(subject !== undefined && { subject }),
      ...(heading !== undefined && { heading }),
      ...(bodyText !== undefined && { body: bodyText }),
      ...(enabled !== undefined && { enabled }),
    },
    create: {
      siteId,
      key,
      subject: subject ?? DEFAULTS[key as EmailTemplateKey].subject,
      heading: heading ?? DEFAULTS[key as EmailTemplateKey].heading,
      body: bodyText ?? DEFAULTS[key as EmailTemplateKey].body,
      enabled: enabled ?? true,
    },
  });

  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const ctx = await requireSiteContext();
  if (ctx instanceof NextResponse) return ctx;
  const { siteId } = ctx as SiteContext;

  const key = new URL(req.url).searchParams.get("key");
  if (!key || !(key in DEFAULTS)) {
    return NextResponse.json({ error: "Invalid template key" }, { status: 400 });
  }

  await prisma.emailTemplateOverride.deleteMany({
    where: { siteId, key: key as EmailTemplateKey },
  });

  return NextResponse.json({ ok: true, message: "Reset to default" });
}
