import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/reviews");

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
