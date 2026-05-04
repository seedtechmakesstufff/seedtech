/**
 * Types for the unified Quote Flow modal.
 */

export type ServicePath = "it-support" | "web-development" | "seo";

export type QuoteFlowStep =
  | "select-service"
  | "it-wizard"
  | "web-select-tier"
  | "web-contact"
  | "seo-select-plan"
  | "seo-form"
  | "thank-you";

export interface WebDevTier {
  name: string;
  starting: string;
  description: string;
  includes: string[];
  bestFor: string[];
  highlighted?: boolean;
}

export interface WebDevSubmission {
  selectedTier: string;
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  currentSiteUrl: string;
  notes: string;
}
