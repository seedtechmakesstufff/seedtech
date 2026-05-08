import type { Metadata } from "next";
import { SalesRepApplyPage } from "@/components/work-with-seedtech/SalesRepApplyPage";

export const metadata: Metadata = {
  title: "Apply Now | Sales Reps",
  description:
    "Apply for the SeedTech sales rep role. Upload your resume and submit your application details for review.",
  alternates: {
    canonical: "/work-with-seedtech/apply",
  },
};

export default function WorkWithSeedTechApplyPage() {
  return <SalesRepApplyPage />;
}