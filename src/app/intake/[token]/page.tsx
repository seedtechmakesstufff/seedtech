import { Metadata } from "next";
import IntakeForm from "./IntakeForm";

export const metadata: Metadata = {
  title: "Website Onboarding | SeedTech",
  robots: { index: false, follow: false },
};

export default function IntakePage({ params }: { params: { token: string } }) {
  return <IntakeForm token={params.token} />;
}
