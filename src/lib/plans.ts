/**
 * IT Support plan definitions.
 *
 * Single source of truth for plan names, pricing, features, and the MDM add-on.
 */
import type { LucideIcon } from "lucide-react";
import { Shield, ShieldCheck, ShieldPlus } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Plan {
  name: string;
  description: string;
  price: number;
  Icon?: LucideIcon;
  features: Record<string, string | boolean>;
}

export interface MdmAddOn {
  name: string;
  description: string;
  pricePerDevice: number;
  features: string[];
}

// ─── Current Plans ────────────────────────────────────────────────────────────
export const newPlans: Plan[] = [
  {
    name: "SeedCare Essentials",
    description: "Foundational IT support for small teams.",
    price: 110,
    Icon: Shield,
    features: {
      "Remote Help Desk": "Unlimited",
      "Endpoint Monitoring": "Included",
      "Patch Management": true,
      "Antivirus Management": true,
      "Email Support": true,
      "On-Site Support": false,
      "Network Monitoring": false,
      "Cloud Backup": false,
      "vCIO Strategy Sessions": false,
      "Priority Response": false,
    },
  },
  {
    name: "SeedCare Plus",
    description: "Enhanced coverage with proactive monitoring.",
    price: 130,
    Icon: ShieldCheck,
    features: {
      "Remote Help Desk": "Unlimited",
      "Endpoint Monitoring": "Included",
      "Patch Management": true,
      "Antivirus Management": true,
      "Email Support": true,
      "On-Site Support": "Up to 4 hrs/mo",
      "Network Monitoring": true,
      "Cloud Backup": "50 GB included",
      "vCIO Strategy Sessions": false,
      "Priority Response": false,
    },
  },
  {
    name: "SeedCare Pro",
    description: "Full-service IT for growing organizations.",
    price: 160,
    Icon: ShieldPlus,
    features: {
      "Remote Help Desk": "Unlimited",
      "Endpoint Monitoring": "Included",
      "Patch Management": true,
      "Antivirus Management": true,
      "Email Support": true,
      "On-Site Support": "Unlimited",
      "Network Monitoring": true,
      "Cloud Backup": "Unlimited",
      "vCIO Strategy Sessions": "Quarterly",
      "Priority Response": true,
    },
  },
];

// ─── Legacy Plans (for comparison table) ──────────────────────────────────────
export const oldPlans: Omit<Plan, "Icon" | "description">[] = [
  {
    name: "Legacy Basic",
    price: 100,
    features: {
      "Remote Help Desk": "Business hours only",
      "Endpoint Monitoring": "Basic",
      "Patch Management": true,
      "Antivirus Management": true,
      "Email Support": true,
      "On-Site Support": false,
      "Network Monitoring": false,
      "Cloud Backup": false,
      "vCIO Strategy Sessions": false,
      "Priority Response": false,
    },
  },
  {
    name: "Legacy Plus",
    price: 140,
    features: {
      "Remote Help Desk": "Extended hours",
      "Endpoint Monitoring": "Included",
      "Patch Management": true,
      "Antivirus Management": true,
      "Email Support": true,
      "On-Site Support": "Up to 2 hrs/mo",
      "Network Monitoring": true,
      "Cloud Backup": "25 GB included",
      "vCIO Strategy Sessions": false,
      "Priority Response": false,
    },
  },
];

// ─── MDM Add-On ───────────────────────────────────────────────────────────────
export const mdmAddon: MdmAddOn = {
  name: "Mobile Device Management",
  description:
    "Manage and secure iOS and iPadOS devices across your organization with remote wipe, app deployment, and compliance policies.",
  pricePerDevice: 12,
  features: [
    "Remote lock & wipe",
    "App deployment & management",
    "Device compliance policies",
    "Automated enrollment",
    "Inventory & reporting",
  ],
};
