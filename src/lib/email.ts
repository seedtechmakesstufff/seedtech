/**
 * email.ts
 * ────────
 * Unified Resend email service.
 *
 * Sender address and notification recipients are resolved in this priority order:
 *   1. DB EmailConfig row (editable via /admin/email → Overview)
 *   2. Environment variables (EMAIL_FROM, EMAIL_NOTIFY, ADMIN_EMAILS)
 *   3. Generic fallback (no hardcoded brand)
 */

import { Resend } from "resend";
import { prisma } from "./prisma";
import { DEFAULT_SITE_ID } from "./site-context";
import {
  contactNotificationTemplate,
  contactAutoReplyTemplate,
  quoteNotificationTemplate,
  quoteAutoReplyTemplate,
  salesRepApplicationNotificationTemplate,
  salesRepApplicationAutoReplyTemplate,
  teamInviteTemplate,
  intakeNotificationTemplate,
  intakeAutoReplyTemplate,
  type ContactNotificationData,
  type QuoteNotificationData,
  type SalesRepApplicationNotificationData,
  type TeamInviteData,
  type EmailBranding,
} from "./email-templates";
import type { IntakeConfig } from "./intake/types";

/* ── Singleton Resend client ─────────────────────────────────── */

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

/* ── DB config helpers (with env fallback) ───────────────────── */

/** Fetches the EmailConfig row for the default site, or null if not set. */
async function getEmailConfig() {
  try {
    return await prisma.emailConfig.findUnique({ where: { siteId: DEFAULT_SITE_ID } });
  } catch {
    return null;
  }
}

/** Resolved "from" address: DB → env → fallback */
async function fromAddress(): Promise<string> {
  const cfg = await getEmailConfig();
  if (cfg?.fromAddress) return cfg.fromAddress;
  return process.env.EMAIL_FROM ?? "noreply@example.com";
}

/** Resolved notification recipients: DB → EMAIL_NOTIFY → ADMIN_EMAILS → []
 */
async function notifyRecipients(): Promise<string[]> {
  const cfg = await getEmailConfig();
  const raw = cfg?.notifyRecipients || process.env.EMAIL_NOTIFY || process.env.ADMIN_EMAILS || "";
  return raw.split(",").map((e: string) => e.trim()).filter(Boolean);
}

/**
 * Returns branding info (company name, domain, logo URL) for email templates.
 * Reads from the BusinessProfile for the given site.
 */
export async function getEmailBranding(siteId: string = DEFAULT_SITE_ID): Promise<EmailBranding> {
  try {
    const profile = await prisma.businessProfile.findUnique({
      where: { siteId },
      select: { companyName: true, domain: true, logoUrl: true },
    });
    if (profile) {
      return {
        companyName: profile.companyName,
        domain: profile.domain,
        logoUrl: profile.logoUrl,
      };
    }
  } catch {
    // fall through
  }
  return { companyName: "Your Company", domain: "", logoUrl: null };
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/* ── Base sender ─────────────────────────────────────────────── */

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<EmailResult> {
  const resend = getResend();

  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send.");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const resolvedFrom = opts.from ?? await fromAddress();
    const { data, error } = await resend.emails.send({
      from: resolvedFrom,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Unexpected error:", message);
    return { success: false, error: message };
  }
}

/* ── Contact form ────────────────────────────────────────────── */

/**
 * Sends two emails when the contact form is submitted:
 * 1. Internal notification to admin(s)
 * 2. Auto-reply confirmation to the submitter
 */
export async function sendContactNotification(
  data: ContactNotificationData
): Promise<{ notification: EmailResult; autoReply: EmailResult }> {
  const [admins, branding] = await Promise.all([notifyRecipients(), getEmailBranding()]);

  const [notification, autoReply] = await Promise.all([
    admins.length > 0
      ? sendEmail({
          to: admins,
          subject: `📬 New Contact Form — ${data.fullName}`,
          html: contactNotificationTemplate(data, branding),
          replyTo: data.email,
        })
      : Promise.resolve<EmailResult>({ success: false, error: "No admin recipients configured" }),

    sendEmail({
      to: data.email,
      subject: `We got your message — ${branding.companyName}`,
      html: contactAutoReplyTemplate(data, branding),
    }),
  ]);

  return { notification, autoReply };
}

/* ── Quote submission ────────────────────────────────────────── */

/**
 * Sends two emails when a quote flow is completed:
 * 1. Internal notification to admin(s)
 * 2. Auto-reply confirmation to the submitter
 */
export async function sendQuoteNotification(
  data: QuoteNotificationData
): Promise<{ notification: EmailResult; autoReply: EmailResult }> {
  const [admins, branding] = await Promise.all([notifyRecipients(), getEmailBranding()]);
  const serviceLabel = data.source === "quote_it" ? "IT Support" : "Web Development";

  const [notification, autoReply] = await Promise.all([
    admins.length > 0
      ? sendEmail({
          to: admins,
          subject: `🧾 New ${serviceLabel} Quote — ${data.fullName}`,
          html: quoteNotificationTemplate(data, branding),
          replyTo: data.email,
        })
      : Promise.resolve<EmailResult>({ success: false, error: "No admin recipients configured" }),

    sendEmail({
      to: data.email,
      subject: `Your ${serviceLabel} quote request — ${branding.companyName}`,
      html: quoteAutoReplyTemplate(data, branding),
    }),
  ]);

  return { notification, autoReply };
}

/* ── Sales rep application ─────────────────────────────────── */

export async function sendSalesRepApplicationNotification(
  data: SalesRepApplicationNotificationData
): Promise<{ notification: EmailResult; autoReply: EmailResult }> {
  const [admins, branding] = await Promise.all([notifyRecipients(), getEmailBranding()]);

  const [notification, autoReply] = await Promise.all([
    admins.length > 0
      ? sendEmail({
          to: admins,
          subject: `New Sales Rep Application — ${data.fullName}`,
          html: salesRepApplicationNotificationTemplate(data, branding),
          replyTo: data.email,
        })
      : Promise.resolve<EmailResult>({ success: false, error: "No admin recipients configured" }),

    sendEmail({
      to: data.email,
      subject: `We received your application — ${branding.companyName}`,
      html: salesRepApplicationAutoReplyTemplate(data, branding),
    }),
  ]);

  return { notification, autoReply };
}

/* ── Team invite ─────────────────────────────────────────────── */

/**
 * Sends a team invite email to a new admin user.
 */
export async function sendTeamInvite(
  to: string,
  data: TeamInviteData
): Promise<EmailResult> {
  const branding = await getEmailBranding();
  return sendEmail({
    to,
    subject: `You've been invited to join ${data.teamName}`,
    html: teamInviteTemplate(data, branding),
  });
}

/* ── SEO digest (replaces raw fetch in seo-reports.ts) ──────── */

export interface SeoDigestOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}

/**
 * Sends the weekly SEO digest email.
 * Called from src/lib/seo-reports.ts instead of raw fetch().
 */
export async function sendSeoDigest(opts: SeoDigestOptions): Promise<EmailResult> {
  return sendEmail({
    to: opts.to,
    from: opts.from,
    subject: opts.subject,
    html: opts.html,
  });
}

/* ── Intake (config-driven: Artist, Comedian, …) ─────────────── */

export async function sendIntakeNotification(
  config: IntakeConfig,
  data: Record<string, unknown>
): Promise<{ notification: EmailResult; autoReply: EmailResult }> {
  const [admins, branding] = await Promise.all([notifyRecipients(), getEmailBranding()]);

  const entityName = String(data[config.entityNameKey] || "");
  const contactName = String(data.contactName || "");
  const contactEmail = String(data.contactEmail || "");

  const [notification, autoReply] = await Promise.all([
    admins.length > 0
      ? sendEmail({
          to: admins,
          subject: `${config.notifyEmoji} New ${config.entityTitle} Website Intake — ${entityName || contactName}`,
          html: intakeNotificationTemplate(config, data, branding),
          replyTo: contactEmail || undefined,
        })
      : Promise.resolve<EmailResult>({ success: false, error: "No admin recipients configured" }),

    contactEmail
      ? sendEmail({
          to: contactEmail,
          subject: `We received your intake — ${branding.companyName}`,
          html: intakeAutoReplyTemplate(contactName, entityName, config, branding),
        })
      : Promise.resolve<EmailResult>({ success: false, error: "No contact email provided" }),
  ]);

  return { notification, autoReply };
}
