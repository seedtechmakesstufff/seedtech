import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/pricing/it-support");

export default function ITSupportPricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
