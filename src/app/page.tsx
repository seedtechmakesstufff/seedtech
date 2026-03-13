import { CTABanner } from "@/components/kit";
import { HeroSection } from "@/components/home/HeroSection";
import { WhySeedTechSection } from "@/components/home/WhySeedTechSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ResultsSection } from "@/components/home/ResultsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhySeedTechSection />
      <ServicesSection />
      <ResultsSection />
      <CTABanner
        title="Ready to Grow Your Business?"
        description="Get a free consultation and custom quote — no commitment, no jargon."
        primaryLabel="Get a Free Quote"
        primaryHref="/contact"
        secondaryLabel="See Our Work"
        secondaryHref="/our-work"
      />
    </>
  );
}
