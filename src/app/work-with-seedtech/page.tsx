import type { Metadata } from "next";
import { SalesRepPage } from "@/components/work-with-seedtech/SalesRepPage";

export const metadata: Metadata = {
  title: "Want to Work With SeedTech? | Sales Reps",
  description:
    "A sales-first look at SeedTech's recurring managed IT offer for experienced reps, including target markets, plan positioning, and a live commission calculator.",
  alternates: {
    canonical: "/work-with-seedtech",
  },
};

export default function WorkWithSeedTechPage() {
  return <SalesRepPage />;
}