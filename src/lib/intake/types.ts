/* ── Intake form schema ──
 * A single declarative config drives three things for each vertical:
 *   1. The multi-step wizard UI  (IntakeWizard.tsx)
 *   2. The notification + auto-reply emails  (email-templates.ts)
 *   3. The API submission handler  (intake/submission.ts)
 *
 * Because all three read the SAME field keys/labels, there is no way for a
 * form field to drift out of sync with its email row or stored metadata.
 * Adding a new vertical = one config file + one route + one page.
 */

export type IntakeData = Record<string, string | string[]>;

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "textarea"
  | "select"
  | "radios"
  | "checks";

export interface IntakeField {
  /** Stored key — also the email-row key and metadata key. Must be unique within a config. */
  key: string;
  /** Human label shown in the form and the notification email. */
  label: string;
  type: FieldType;
  /** Options for select / radios / checks. */
  options?: string[];
  hint?: string;
  placeholder?: string;
  /** textarea row count (default 3). */
  rows?: number;
  /** radios column count (default 2). */
  cols?: 1 | 2;
  /** Render at half width (pairs two-per-row). Full width by default. */
  half?: boolean;
  /** Required for submission (only meaningful for text/email types). */
  required?: boolean;
  /** When present, the field only renders if this returns true. */
  showIf?: (data: IntakeData) => boolean;
}

export interface IntakeSection {
  /** Optional sub-heading rendered inside a step (and used as the email group header). */
  heading?: string;
  fields: IntakeField[];
}

export interface IntakeStep {
  title: string;
  description: string;
  sections: IntakeSection[];
}

export interface IntakeConfig {
  /** Stable identifier for the vertical. */
  key: "artist" | "comedian";
  /** FormSource enum value this vertical is stored under. */
  source: "artist_intake" | "comedian_intake";
  /** Human service label stored on the submission + shown as a chip in admin. */
  serviceLabel: string;
  /** API endpoint the wizard POSTs to. */
  endpoint: string;
  /** reCAPTCHA action name. */
  recaptchaAction: string;
  /** GA4 trackLead source. */
  leadSource: "artist_intake" | "comedian_intake";
  /** Field key holding the primary entity name (e.g. "artistName"). Required + used in subjects/success screen. */
  entityNameKey: string;
  /** Title-case noun for the vertical, e.g. "Artist". Used in email subjects + headings. */
  entityTitle: string;
  /** Full form name, e.g. "Artist & Touring Website". Used in copy. */
  formName: string;
  /** Emoji prefix for the internal notification email subject. */
  notifyEmoji: string;
  /** Comma-free tag string for the email footer ("Internal tags: …"). */
  emailTags: string;
  steps: IntakeStep[];
}
