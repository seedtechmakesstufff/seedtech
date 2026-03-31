import { buildMetadata } from "@/lib/page-metadata";
import { CTABanner } from "@/components/kit";
import { FAQJsonLd, LocalBusinessJsonLd } from "@/components/JsonLd";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import { SelectedWorkSection } from "@/components/home/SelectedWorkSection";
import { AutopilotSection } from "@/components/home/AutopilotSection";
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
      <AutopilotSection />
      <BlogPreviewSection />
      <FAQSection />
      <CTABanner
        title="Ready to Grow Your Business?"
        description="Get a free consultation and custom quote — no commitment, no jargon."
        primaryLabel="Get a Free Technology Audit"
        primaryHref="/free-audit"
        secondaryLabel="View Industry Solutions"
        secondaryHref="/industries"
      />
    </>
  );
}
