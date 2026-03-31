import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/pricing/it-support", {
  title: "IT Support Pricing",
  description:
    "Transparent, per-user pricing for managed IT support. Three plans — Essentials, Plus, and Pro. No contracts, no surprises.",
});

export default function ITSupportPricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
