import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/contact");

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
