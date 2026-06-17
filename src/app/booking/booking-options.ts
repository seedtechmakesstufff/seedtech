export type BookingAccent = "seed" | "blue" | "cyan" | "emerald";

/**
 * Icon keys map to Lucide icons in BookingGrid (the client component).
 * Kept as strings so this data module stays serializable across the
 * server → client boundary.
 */
export type BookingIconKey =
  | "compass"
  | "ruler"
  | "wrench"
  | "laptop"
  | "hard-drive"
  | "moon"
  | "clipboard-check";

export interface BookingOption {
  /** Stable id (also used as the data-booking analytics label) */
  id: string;
  title: string;
  description: string;
  /** Google Calendar appointment scheduling link */
  url: string;
  icon: BookingIconKey;
  accent: BookingAccent;
  /** When true, the visitor must enter a support ticket number before booking. */
  requiresTicket?: boolean;
}

export interface BookingGroup {
  id: string;
  label: string;
  description: string;
  options: BookingOption[];
}

/**
 * Booking options surfaced on booking.seedtechllc.com.
 *
 * Each option links directly to its Google Calendar appointment page.
 * To add / change a booking type, edit this list — the lander renders from it.
 */
export const bookingGroups: BookingGroup[] = [
  {
    id: "new-clients",
    label: "New to SeedTech",
    description: "Not a client yet? Start here.",
    options: [
      {
        id: "discovery",
        title: "Discovery Meeting",
        description:
          "A no-pressure intro call to understand your business, your goals, and whether we're the right fit.",
        url: "https://calendar.app.google/YSQCnqYZnk6foVV66",
        icon: "compass",
        accent: "seed",
      },
      {
        id: "walkthrough-estimate",
        title: "Walkthrough & Estimate",
        description:
          "An on-site walkthrough to scope your project and prepare a detailed estimate. Typically booked after a discovery meeting.",
        url: "https://calendar.app.google/BFGcYhXFPRiRLvxu8",
        icon: "ruler",
        accent: "seed",
      },
    ],
  },
  {
    id: "support",
    label: "Support Requests",
    description: "Need a hand? Get help from our team.",
    options: [
      {
        id: "onsite-support",
        title: "On-Site Support",
        description:
          "Schedule a technician to come to your location for hands-on, in-person support.",
        url: "https://calendar.app.google/jnSVBdRUk9VCaYGz8",
        icon: "wrench",
        accent: "blue",
        requiresTicket: true,
      },
      {
        id: "remote-support",
        title: "Remote Support",
        description:
          "Book a remote session and we'll resolve your issue securely — no on-site visit needed.",
        url: "https://calendar.app.google/iTguSsANvh4uRJyb6",
        icon: "laptop",
        accent: "blue",
        requiresTicket: true,
      },
    ],
  },
  {
    id: "hardware",
    label: "Hardware Installation",
    description: "Setting up new equipment? Pick a window.",
    options: [
      {
        id: "hardware-day",
        title: "Daytime Install",
        description:
          "Hardware installation scheduled during normal business hours.",
        url: "https://calendar.app.google/7PvcAM54JhZkamRZA",
        icon: "hard-drive",
        accent: "cyan",
      },
      {
        id: "hardware-overnight",
        title: "Overnight Install",
        description:
          "After-hours hardware installation to avoid any disruption to your workday.",
        url: "https://calendar.app.google/Cu3k3YPbwNPNPcis6",
        icon: "moon",
        accent: "cyan",
      },
    ],
  },
  {
    id: "account-management",
    label: "Account Management",
    description: "Already a client? Let's check in.",
    options: [
      {
        id: "client-review",
        title: "Client Management Review",
        description:
          "A scheduled review of your account, services, and roadmap with your account manager.",
        url: "https://calendar.app.google/rNEBxFyidwhCGkxK8",
        icon: "clipboard-check",
        accent: "emerald",
      },
    ],
  },
];
