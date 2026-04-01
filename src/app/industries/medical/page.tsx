import { Stethoscope, CheckCircle2, ArrowRight, Search, Brain, FileText, BarChart3, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { GradientOrb, GridPattern, AnimatedH1, LiquidGlassPill, CTABanner, LiquidGlassCard } from "@/components/kit";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/industries/medical");

export default function MedicalPage() {
  return (
    <div>
      <ServiceJsonLd
        name="IT Services for Medical Practices"
        description="Reliable technology support, secure email, backups, website improvements, and day-to-day operational help for medical practices."
        url="https://seedtechllc.com/industries/medical"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Industries", url: "/industries" },
          { name: "Medical", url: "/industries/medical" },
        ]}
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base pt-40 pb-24">
        <GradientOrb color="seed" size="xl" className="top-0 left-1/4 -translate-y-1/3 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-0 right-0 translate-y-1/3 opacity-10" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <LiquidGlassPill variant="seed" className="mb-6">
            <Stethoscope className="w-3.5 h-3.5 inline mr-1.5" />
            Medical Practices
          </LiquidGlassPill>
          <AnimatedH1 highlightWords={["Reliability"]} delay={0.15}>
            Technology Support for Medical Practices That Need Reliability
          </AnimatedH1>
          <p className="mt-6 text-body-lg text-light-base/55 max-w-2xl mx-auto leading-relaxed">
            Medical practices depend on technology that works every day. Scheduling, email, devices, staff access, backups, and patient communication all have to stay dependable. SeedTech helps small and mid-size practices build a more reliable setup and maintain a professional online presence without juggling multiple vendors.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/free-audit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-seed-600 to-seed-500 text-white font-medium hover:shadow-glowSeed transition-all duration-200"
            >
              Get a Free Technology Audit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl liquid-glass text-white font-medium transition-all duration-200"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* Key Services */}
      <Section>
        <SectionHeader
          eyebrow="What We Build"
          title="Practical Support for Daily Operations"
          description="We focus on the systems medical practices rely on every day: communication, access, devices, website usability, and the basics that keep work moving."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Secure Business Email and User Access", body: "Reliable email, account access, and day-to-day user support for the people who keep the practice moving." },
            { title: "Device Support for Office Staff", body: "Support for front desk and office devices so technology problems do not keep slowing down the team." },
            { title: "Backup and Recovery Planning", body: "A more dependable backup approach so important information is protected and easier to recover if something goes wrong." },
            { title: "Website Updates and Usability Improvements", body: "Clearer, simpler websites that make it easier for patients to find information and take the next step." },
            { title: "Scheduling and Contact Path Improvements", body: "Cleaner inquiry and scheduling paths so patients are not guessing how to reach the practice." },
            { title: "Ongoing Support From One Accountable Team", body: "One partner who stays involved instead of handing work off across multiple vendors." },
          ].map((item) => (
            <LiquidGlassCard key={item.title} className="p-6 flex flex-col gap-3">
              <CheckCircle2 className="w-5 h-5 text-seed-400" />
              <h3 className="font-display text-card-title text-white">{item.title}</h3>
              <p className="text-body-sm text-light-base/50 leading-relaxed">{item.body}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* SEO Autopilot */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Website Fundamentals"
          title="A Website Patients Can"
          titleHighlight="Actually Use"
          description="For most practices, the website does not need to be flashy. It needs to be clear, fast, mobile-friendly, and easy for patients to use."
          align="center"
          theme="light"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: Search,
              title: "Clear Provider and Service Information",
              body: "Patients should be able to understand what you offer, who they are seeing, and where to go without digging.",
            },
            {
              icon: Brain,
              title: "Accurate Location and Contact Details",
              body: "Address, hours, phone numbers, and location details need to be easy to find and kept current.",
            },
            {
              icon: FileText,
              title: "Better Mobile Usability",
              body: "A large share of patients will first interact with the site on a phone, so the basics need to work well there first.",
            },
            {
              icon: BarChart3,
              title: "Cleaner Appointment and Inquiry Paths",
              body: "The next step should be obvious whether someone needs to call, request information, or use a scheduling workflow.",
            },
            {
              icon: Zap,
              title: "Content Structure That Supports Visibility",
              body: "Good search visibility starts with a site that is organized clearly and easy for both people and search engines to understand.",
            },
            {
              icon: Sparkles,
              title: "Support That Stays Practical",
              body: "We focus on the fundamentals first instead of layering on tools and marketing language that do not help the practice run better.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-black/[0.06] bg-white shadow-cardLight p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-seed-50 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-seed-600" />
              </div>
              <h3 className="font-display text-card-title text-dark-base">{item.title}</h3>
              <p className="text-body-sm text-dark-base/55 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 max-w-3xl mx-auto text-center">
          <p className="text-body-sm text-dark-base/45 leading-relaxed">
            We focus on the fundamentals first. For medical practices, that usually matters more than adding another layer of marketing language or unnecessary features.
          </p>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTABanner
          title="Ready to Protect Your Practice&apos;s Technology?"
          description="Get a free technology and website audit for your medical practice or clinic."
          primaryLabel="Get a Free Audit"
          primaryHref="/free-audit"
          secondaryLabel="Contact Us"
          secondaryHref="/contact"
        />
      </Section>
    </div>
  );
}
