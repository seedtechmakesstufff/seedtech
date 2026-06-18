/**
 * email-templates.ts
 * ──────────────────
 * Pure functions that return HTML strings for transactional emails.
 * All styles are inline for maximum email-client compatibility.
 * No external dependencies — just plain TypeScript.
 *
 * All templates accept an EmailBranding object so they work for any client site.
 */

import type { IntakeConfig } from "./intake/types";

/* ── Branding config ──────────────────────────────────────── */

export interface EmailBranding {
  companyName: string;
  domain: string;
  logoUrl?: string | null;
}

const DEFAULT_BRANDING: EmailBranding = {
  companyName: "Your Company",
  domain: "",
  logoUrl: null,
};

/* ── Shared layout ──────────────────────────────────────────── */

/**
 * Base HTML wrapper for all transactional emails.
 * @param title     Browser / email-client <title>
 * @param body      Inner HTML content
 * @param branding  Company name, domain, and optional logo URL
 */
function layout(title: string, body: string, branding: EmailBranding = DEFAULT_BRANDING): string {
  const { companyName, domain, logoUrl } = branding;
  const siteUrl = domain ? `https://${domain.replace(/^https?:\/\//, "")}` : "";

  const header = logoUrl
    ? `<img src="${logoUrl}" alt="${companyName} logo" height="48" style="max-height:48px;max-width:240px;object-fit:contain;display:block;margin:0 auto;" />`
    : `<span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">${companyName}</span>`;

  const footerContent = domain
    ? `${companyName}<br /><a href="${siteUrl}" style="color:#4ade80;text-decoration:none;">${domain}</a>`
    : companyName;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0e1117;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              ${header}
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-radius:0 0 12px 12px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                ${footerContent}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0e1117;">${text}</h1>`;
}

function subheading(text: string): string {
  return `<p style="margin:0 0 28px;font-size:15px;color:#6b7280;">${text}</p>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />`;
}

function field(label: string, value: string | undefined | null): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:8px 0;vertical-align:top;">
        <span style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;">${label}</span><br />
        <span style="font-size:15px;color:#111827;">${value}</span>
      </td>
    </tr>`;
}

function fieldsTable(rows: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">${rows}</table>`;
}

function ctaButton(text: string, url: string): string {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
      <tr>
        <td style="border-radius:8px;background:#16a34a;">
          <a href="${url}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">${text}</a>
        </td>
      </tr>
    </table>`;
}

function note(text: string): string {
  return `<p style="margin:0;font-size:13px;color:#6b7280;">${text}</p>`;
}

/* ── Template: Contact Form Notification ────────────────────── */

export interface ContactNotificationData {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  message: string;
}

export function contactNotificationTemplate(data: ContactNotificationData, branding: EmailBranding = DEFAULT_BRANDING): string {
  const rows =
    field("Name", data.fullName) +
    field("Email", data.email) +
    field("Phone", data.phone) +
    field("Company", data.company) +
    field("Service Interested In", data.service);

  const body = `
    ${h1("New Contact Form Submission")}
    ${subheading("Someone reached out through the " + branding.companyName + " contact page.")}
    ${divider()}
    ${fieldsTable(rows)}
    <tr style="display:block;">
      <td style="display:block;padding:8px 0;">
        <span style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;">Message</span>
        <div style="margin-top:8px;padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;font-size:15px;color:#111827;line-height:1.6;">${data.message.replace(/\n/g, "<br />")}</div>
      </td>
    </tr>
    ${divider()}
    ${ctaButton("Reply to " + data.fullName.split(" ")[0], `mailto:${data.email}`)}
    ${note("This notification was sent automatically when the contact form was submitted.")}
  `;

  return layout("New Contact Submission — " + branding.companyName, body, branding);
}

/* ── Template: Contact Form Auto-Reply ─────────────────────── */

export function contactAutoReplyTemplate(data: ContactNotificationData, branding: EmailBranding = DEFAULT_BRANDING): string {
  const firstName = data.fullName.split(" ")[0];
  const siteUrl = branding.domain ? `https://${branding.domain.replace(/^https?:\/\//, "")}` : "#";

  const summaryRows =
    field("Name", data.fullName) +
    field("Email", data.email) +
    (data.phone ? field("Phone", data.phone) : "") +
    (data.company ? field("Company", data.company) : "") +
    (data.service ? field("Service Interested In", data.service) : "");

  const body = `
    ${h1("We got your message, " + firstName + ".")}
    ${subheading("A member of the " + branding.companyName + " team will be in touch within 1 business day.")}
    ${divider()}
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px;">
      Here's a summary of what you submitted:
    </p>
    ${fieldsTable(summaryRows)}
    ${data.message ? `
    <tr style="display:block;">
      <td style="display:block;padding:8px 0 16px;">
        <span style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;">Your Message</span>
        <div style="margin-top:8px;padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;font-size:15px;color:#374151;line-height:1.6;">${data.message.replace(/\n/g, "<br />")}</div>
      </td>
    </tr>` : ""}
    ${divider()}
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px;">
      In the meantime, feel free to browse our work or check out our blog for the latest insights.
    </p>
    ${ctaButton("Visit " + branding.companyName, siteUrl)}
    ${divider()}
    ${note("If your request is urgent, reply to this email or call us directly.")}
  `;

  return layout("We received your message — " + branding.companyName, body, branding);
}

/* ── Template: Quote Request Notification ───────────────────── */

export type QuoteSource = "quote_it" | "quote_web";

export interface QuoteNotificationData {
  source: QuoteSource;
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  tier?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface SalesRepApplicationNotificationData {
  fullName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  linkedinUrl?: string | null;
  currentCompany?: string | null;
  salesExperience?: string | null;
  outboundExperience?: string | null;
  message?: string | null;
  resumeUrl: string;
  resumeFileName: string;
}

export function quoteNotificationTemplate(data: QuoteNotificationData, branding: EmailBranding = DEFAULT_BRANDING): string {
  const isIt  = data.source === "quote_it";
  const serviceLabel = isIt ? "Managed IT Support" : "Web Development";

  // Core contact rows
  const contactRows =
    field("Name", data.fullName) +
    field("Email", data.email) +
    field("Phone", data.phone) +
    field("Company / Business", data.company) +
    field("Service", serviceLabel) +
    field("Selected Tier / Package", data.tier);

  // Source-specific metadata rows
  let detailRows = "";
  if (isIt && data.metadata) {
    const m = data.metadata;
    if (m.seats)          detailRows += field("Seats / Users", String(m.seats));
    if (m.includeMdm)     detailRows += field("MDM Add-On", m.includeMdm ? `Yes${m.mdmSeats ? ` — ${m.mdmSeats} devices` : ""}` : "No");
    if (m.yearlyCost)     detailRows += field("Estimated Yearly Cost", `$${Number(m.yearlyCost).toLocaleString()}`);
    if (m.mdmMonthlyCost && Number(m.mdmMonthlyCost) > 0)
                          detailRows += field("MDM Monthly Add-On", `$${Number(m.mdmMonthlyCost).toLocaleString()}/mo`);
    if (m.dealNotes)      detailRows += field("Notes", String(m.dealNotes));
  } else if (!isIt && data.metadata) {
    const m = data.metadata;
    if (m.currentSiteUrl) detailRows += field("Current Website", String(m.currentSiteUrl));
    if (m.notes)          detailRows += field("Project Notes", String(m.notes));
  }

  const body = `
    ${h1("New " + serviceLabel + " Quote Request")}
    ${subheading("A prospective client completed the quote flow on " + branding.companyName + ".")}
    ${divider()}
    <h2 style="margin:0 0 12px;font-size:16px;font-weight:600;color:#374151;">Contact Info</h2>
    ${fieldsTable(contactRows)}
    ${detailRows ? `
    <h2 style="margin:16px 0 12px;font-size:16px;font-weight:600;color:#374151;">${isIt ? "IT Quote Details" : "Project Details"}</h2>
    ${fieldsTable(detailRows)}` : ""}
    ${divider()}
    ${ctaButton("Reply to " + data.fullName.split(" ")[0], `mailto:${data.email}`)}
    ${note("This notification was sent automatically when the quote form was submitted.")}
  `;

  return layout(`New ${serviceLabel} Quote — ${branding.companyName}`, body, branding);
}

/* ── Template: Quote Auto-Reply ─────────────────────────────── */

export function quoteAutoReplyTemplate(data: QuoteNotificationData, branding: EmailBranding = DEFAULT_BRANDING): string {
  const firstName = data.fullName.split(" ")[0];
  const isIt = data.source === "quote_it";
  const serviceLabel = isIt ? "Managed IT Support" : "Web Development";
  const siteUrl = branding.domain ? `https://${branding.domain.replace(/^https?:\/\//, "")}` : "#";

  // Build a submission summary for the customer
  const summaryRows =
    field("Name", data.fullName) +
    field("Email", data.email) +
    (data.phone   ? field("Phone",            data.phone)   : "") +
    (data.company ? field("Company",          data.company) : "") +
    field("Service", serviceLabel) +
    (data.tier    ? field("Selected Package", data.tier)    : "");

  let detailRows = "";
  if (isIt && data.metadata) {
    const m = data.metadata;
    if (m.seats)         detailRows += field("Seats / Users", String(m.seats));
    if (m.includeMdm)    detailRows += field("MDM Add-On", m.includeMdm ? `Yes${m.mdmSeats ? ` — ${m.mdmSeats} devices` : ""}` : "No");
    if (m.yearlyCost)    detailRows += field("Estimated Yearly Cost", `$${Number(m.yearlyCost).toLocaleString()}`);
    if (m.dealNotes)     detailRows += field("Notes", String(m.dealNotes));
  } else if (!isIt && data.metadata) {
    const m = data.metadata;
    if (m.currentSiteUrl) detailRows += field("Current Website", String(m.currentSiteUrl));
    if (m.notes)          detailRows += field("Project Notes", String(m.notes));
  }

  const body = `
    ${h1("Thanks for your quote request, " + firstName + ".")}
    ${subheading("We'll review your " + serviceLabel + " needs and get back to you within 1 business day.")}
    ${divider()}
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px;">
      Here's a summary of your submission:
    </p>
    ${fieldsTable(summaryRows)}
    ${detailRows ? `
    <h2 style="margin:16px 0 12px;font-size:16px;font-weight:600;color:#374151;">${isIt ? "Quote Details" : "Project Details"}</h2>
    ${fieldsTable(detailRows)}` : ""}
    ${divider()}
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px;">
      One of our specialists will reach out to discuss your ${isIt ? "IT environment" : "project"} in detail and put together a custom proposal.
    </p>
    ${ctaButton("Visit " + branding.companyName, siteUrl)}
    ${divider()}
    ${note("Questions? Reply to this email and we'll get back to you right away.")}
  `;

  return layout(`Your ${serviceLabel} quote request — ${branding.companyName}`, body, branding);
}

/* ── Template: Sales Rep Application ───────────────────────── */

export function salesRepApplicationNotificationTemplate(
  data: SalesRepApplicationNotificationData,
  branding: EmailBranding = DEFAULT_BRANDING
): string {
  const rows =
    field("Name", data.fullName) +
    field("Email", data.email) +
    field("Phone", data.phone) +
    field("Location", data.location) +
    field("Current Company", data.currentCompany) +
    field("LinkedIn", data.linkedinUrl) +
    field("Outbound Sales Experience", data.salesExperience) +
    field("Prospecting Background", data.outboundExperience) +
    field("Resume", data.resumeFileName);

  const body = `
    ${h1("New Sales Rep Application")}
    ${subheading("A candidate applied through the SeedTech sales rep opportunity page.")}
    ${divider()}
    ${fieldsTable(rows)}
    ${data.message ? `
    <tr style="display:block;">
      <td style="display:block;padding:8px 0;">
        <span style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;">Why they're a fit</span>
        <div style="margin-top:8px;padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;font-size:15px;color:#111827;line-height:1.6;">${data.message.replace(/\n/g, "<br />")}</div>
      </td>
    </tr>` : ""}
    ${divider()}
    ${ctaButton("Open Resume", data.resumeUrl)}
    ${note("Reply directly to this email to follow up with the applicant.")}
  `;

  return layout(`New Sales Rep Application — ${branding.companyName}`, body, branding);
}

export function salesRepApplicationAutoReplyTemplate(
  data: SalesRepApplicationNotificationData,
  branding: EmailBranding = DEFAULT_BRANDING
): string {
  const firstName = data.fullName.split(" ")[0];

  const body = `
    ${h1("Application received, " + firstName + ".")}
    ${subheading("Thanks for applying to the SeedTech sales rep role.")}
    ${divider()}
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px;">
      We received your application and resume. Our team will review it and reach out if there is a fit for the next step.
    </p>
    ${fieldsTable(
      field("Name", data.fullName) +
      field("Email", data.email) +
      field("Phone", data.phone) +
      field("Location", data.location) +
      field("Resume", data.resumeFileName)
    )}
    ${divider()}
    ${note("If you need to update your resume or details, reply to this email.")}
  `;

  return layout(`We received your application — ${branding.companyName}`, body, branding);
}

/* ── Template: Team Invite ──────────────────────────────────── */

export interface TeamInviteData {
  inviteeName?: string | null;
  inviterName: string;
  teamName: string;
  inviteUrl: string;
  expiresInDays?: number;
}

export function teamInviteTemplate(data: TeamInviteData, branding: EmailBranding = DEFAULT_BRANDING): string {
  const greeting = data.inviteeName ? `Hi ${data.inviteeName.split(" ")[0]},` : "Hi there,";
  const expiry = data.expiresInDays ?? 7;

  const body = `
    <p style="font-size:16px;color:#374151;margin:0 0 20px;">${greeting}</p>
    ${h1("You've been invited to join " + data.teamName)}
    ${subheading(data.inviterName + " has added you to the " + branding.companyName + " admin platform.")}
    ${divider()}
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 24px;">
      Click the button below to accept your invitation and set up your account. This link expires in <strong>${expiry} days</strong>.
    </p>
    ${ctaButton("Accept Invitation", data.inviteUrl)}
    ${divider()}
    ${note("If you didn't expect this invitation, you can safely ignore this email. The link will expire automatically.")}
  `;

  return layout(`You've been invited to ${data.teamName}`, body, branding);
}

/* ── Template: Intake (config-driven: Artist, Comedian, …) ────── */

function intakeSection(title: string, rows: string): string {
  if (!rows.trim()) return "";
  return `
    <tr><td style="padding:20px 0 6px;">
      <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">${title}</p>
    </td></tr>
    ${rows}`;
}

function intakeRow(label: string, value: unknown): string {
  if (value === "" || value === null || value === undefined) return "";
  if (Array.isArray(value) && value.length === 0) return "";
  const display = Array.isArray(value) ? (value as string[]).join(", ") : String(value);
  return `<tr>
    <td style="padding:5px 12px 5px 0;width:38%;vertical-align:top;font-size:12px;color:#6b7280;">${label}</td>
    <td style="padding:5px 0;font-size:13px;color:#111827;">${display}</td>
  </tr>`;
}

/**
 * Config-driven intake notification email.
 * Iterates the vertical's own step/section/field schema so the email rows can
 * never drift from the form fields — there is exactly one source of truth.
 */
export function intakeNotificationTemplate(
  config: IntakeConfig,
  data: Record<string, unknown>,
  branding: EmailBranding = DEFAULT_BRANDING
): string {
  const t = (key: string) => data[key];
  const entityName = (t(config.entityNameKey) as string) || `Unknown ${config.entityTitle}`;

  const contactSection = intakeSection("Contact", [
    intakeRow("Name", t("contactName")),
    intakeRow("Role", t("contactRole")),
    intakeRow("Email", t("contactEmail")),
    intakeRow("Phone", t("contactPhone")),
    intakeRow("Preferred Contact", t("preferredContact")),
    intakeRow("Best Time", t("bestTime")),
  ].join(""));

  // Skip Step 1 ("About You") — its contact fields are rendered above.
  const schemaSections = config.steps
    .slice(1)
    .flatMap((step) =>
      step.sections.map((section) =>
        intakeSection(
          section.heading || step.title,
          section.fields.map((f) => intakeRow(f.label.replace(/\s*\*$/, ""), t(f.key))).join("")
        )
      )
    )
    .join("");

  const body = `
    ${h1(`New ${config.entityTitle} Website Intake — ${entityName}`)}
    ${subheading(`Submitted ${new Date().toLocaleString()} · Contact: ${t("contactName") || ""} &lt;${t("contactEmail") || ""}&gt;`)}
    ${divider()}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${contactSection}
      ${schemaSections}
    </table>

    ${divider()}
    <p style="margin:0;font-size:12px;color:#9ca3af;">
      Internal tags: ${config.emailTags}<br />
      Suggested priority: Normal (urgent if launch date within 30 days)
    </p>
  `;

  return layout(`${config.entityTitle} Intake — ${entityName}`, body, branding);
}

export function intakeAutoReplyTemplate(
  contactName: string,
  entityName: string,
  config: IntakeConfig,
  branding: EmailBranding = DEFAULT_BRANDING
): string {
  const firstName = contactName?.split(" ")[0] || "there";
  const body = `
    ${h1("We received your intake!")}
    ${subheading(`Hi ${firstName}, thanks for reaching out about ${entityName || "your project"}.`)}
    ${divider()}
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px;">
      We've received your ${config.formName} intake form and will review it within <strong>1–2 business days</strong>.
      Our team will reach out to discuss scope, timeline, and next steps.
    </p>
    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px;">
      If you have logos, photos, or other files to share, feel free to reply to this email with your attachments.
    </p>
    ${divider()}
    ${note("Questions in the meantime? Reply directly to this email.")}
  `;
  return layout(`We got your intake — ${branding.companyName}`, body, branding);
}
