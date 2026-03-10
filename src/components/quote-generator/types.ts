/**
 * Configuration type for the QuotePriceCalculator.
 *
 * This is the single object you pass to make the calculator reusable
 * across projects. It controls pricing, plans, branding, and submission behavior.
 */
import type { Plan, MdmAddOn } from '@/lib/plans';

export type ViewMode = 'sales' | 'customer';

export type PlanName = 'SeedCare Essentials' | 'SeedCare Plus' | 'SeedCare Pro';

/** Called when the customer submits the form (customer view). */
export interface QuoteSubmission {
  selectedPlan: PlanName;
  seats: number;
  includeMdm: boolean;
  mdmSeats: number;
  clientName: string;
  fullName: string;
  email: string;
  phone: string;
  dealNotes: string;
  yearlyCost: number;
  mdmMonthlyCost: number;
}

/** Called when the sales rep submits the form (sales view). */
export interface SalesSubmission extends QuoteSubmission {
  yearlyCommission: number;
}

export interface QuoteCalculatorConfig {
  /** The plans to display. Defaults to the built-in newPlans from lib/plans. */
  plans?: Plan[];

  /** The old plans to show in the comparison table. Defaults to built-in oldPlans. */
  oldPlans?: Omit<Plan, 'Icon' | 'description'>[];

  /** The MDM add-on config. Defaults to built-in mdmAddon. */
  mdmAddon?: MdmAddOn;

  /** Company email address for the follow-up mailto: link (customer view). */
  companyEmail?: string;

  /** Company name shown in the follow-up email template. */
  companyName?: string;

  /**
   * Custom handler called when the customer clicks "Request Follow-Up".
   * If not provided, falls back to the default mailto: behavior.
   */
  onCustomerSubmit?: (data: QuoteSubmission) => void | Promise<void>;

  /**
   * Custom handler called when the sales rep clicks "Generate Summary".
   * If not provided, falls back to the built-in AI email + ClickUp flow.
   */
  onSalesSubmit?: (data: SalesSubmission) => void | Promise<void>;
}
