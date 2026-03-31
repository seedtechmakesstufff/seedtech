import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/reviews", {
  title: "Reviews",
  description:
    "See what businesses say about working with SeedTech. Real reviews from IT support, web development, and SEO clients.",
});

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
