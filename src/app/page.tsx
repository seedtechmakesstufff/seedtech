import { CTABanner } from "@/components/kit";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ResultsSection } from "@/components/home/ResultsSection";
import { LocalBusinessJsonLd } from "@/components/JsonLd";

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd
        phone="(201) 620-9002"
        email="support@seedtechllc.com"
        areaServed={["Northern New Jersey", "New Jersey", "United States"]}
      />
      <HeroSection />
      <WhyChooseSection />
      <ServicesSection />
      <ResultsSection />
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
