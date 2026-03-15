import { CTABanner } from "@/components/kit";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ResultsSection } from "@/components/home/ResultsSection";

export default function HomePage() {
  return (
    <>
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
