import { buildMetadata } from "@/lib/page-metadata";
import { FAQJsonLd, LocalBusinessJsonLd } from "@/components/JsonLd";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import { ShowcaseCarousel } from "@/components/home/ShowcaseCarousel";
import { ManagedITShowcaseSection } from "@/components/home/ManagedITShowcaseSection";
import { AreasWeServeSection } from "@/components/home/AreasWeServeSection";
import { ReadyDeeperSection } from "@/components/home/ReadyDeeperSection";
import { BlogPreviewSection } from "@/components/home/BlogPreviewSection";
import { FAQSection } from "@/components/home/FAQSection";
import { homepageFAQs } from "@/data/faqs";

export const generateMetadata = buildMetadata("/");

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
      <ManagedITShowcaseSection />
      <AreasWeServeSection />
      <ShowcaseCarousel />
      <BlogPreviewSection />
      <FAQSection />
      <ReadyDeeperSection />
    </>
  );
}
