import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/contact", {
  title: "Contact Us",
  description:
    "Get in touch with SeedTech. Tell us about your project or IT needs and we'll get back to you within one business day.",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
