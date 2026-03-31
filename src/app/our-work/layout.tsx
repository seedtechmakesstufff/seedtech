import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/our-work", {
  title: "Our Work",
  description:
    "Browse SeedTech's portfolio of web development, ecommerce, and custom software projects. Real work for real businesses.",
});

export default function OurWorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
