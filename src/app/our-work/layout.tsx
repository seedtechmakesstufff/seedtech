import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/our-work");

export default function OurWorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
