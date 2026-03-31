import { buildMetadata } from "@/lib/page-metadata";
import { FAQJsonLd, LocalBusinessJsonLd } from "@/components/JsonLd";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import { SelectedWorkSection } from "@/components/home/SelectedWorkSection";
import { ReadyDeeperSection } from "@/components/home/ReadyDeeperSection";
import { BlogPreviewSection } from "@/components/home/BlogPreviewSection";
import { FAQSection } from "@/components/home/FAQSection";
import { homepageFAQs } from "@/data/faqs";

export const generateMetadata = buildMetadata("/", {
  title: "SeedTech | Premium IT Support, Web Development & SEO",
  description:
    "Managed IT support, custom web development, and SEO that works from day one. Serving businesses in New Jersey, California, and nationwide.",
  canonical: "/",
});

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd
        phone="(201) 620-9002"
        email="support@seedtechllc.com"
        areaServed={["Northern New Jersey", "New Jersey", "United States"]}
      />
      <FAQJsonLd questions={homepageFAQs} />
      <HeroSection />
      <TrustedBySection />
      <SelectedWorkSection />
      <ReadyDeeperSection />
      <BlogPreviewSection />
      <FAQSection />
    </>
  );
}
