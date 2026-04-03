import Link from "next/link";
import { ArrowRight, Globe, Shield, Search } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";

const solutions = [
  {
    icon: Shield,
    title: "Managed IT Support",
    description:
      "Proactive IT support for businesses that want fewer interruptions, better security, and support that feels clear and dependable.",
    href: "/services/managed-it",
    featured: true,
  },
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Custom websites built around how your business actually works — not generic templates that look nice but do not do much.",
    href: "/services/web-development",
    featured: false,
  },
  {
    icon: Search,
    title: "SEO Support",
    description:
      "Practical SEO support that helps businesses improve visibility over time with better page structure, content direction, and technical setup.",
    href: "/services/seo",
    featured: false,
  },
];

export function ServicesSection() {
  return (
    <Section theme="light">
      <SectionHeader
        eyebrow="How SeedTech Helps"
        title="Technology Support for"
        titleHighlight="Growing Businesses"
        description="We help businesses stay productive, supported, and visible with services built around real day-to-day needs."
        align="center"
        theme="light"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {solutions.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className={`rounded-3xl border p-8 flex flex-col gap-5 ${
                s.featured
                  ? "border-seed-200 bg-seed-50 shadow-cardLight"
                  : "border-black/[0.07] bg-white shadow-cardLight"
              }`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                s.featured ? "bg-seed-100" : "bg-gray-100"
              }`}>
                <Icon className={`w-5 h-5 ${s.featured ? "text-seed-600" : "text-gray-600"}`} />
              </div>

              <h3 className="font-display text-subheading text-dark-base leading-tight">
                {s.title}
              </h3>

              <p className="text-body-sm text-dark-base/60 leading-relaxed flex-1">{s.description}</p>

              <Link
                href={s.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-seed-600 hover:text-seed-700 transition-colors group"
              >
                Learn more
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
