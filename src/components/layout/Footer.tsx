import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import { SiBehance, SiInstagram, SiTiktok } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/seedtechllc/",
    icon: <FaLinkedinIn className="w-4 h-4" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/seedtechmedia/",
    icon: <SiInstagram className="w-4 h-4" />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@seedtechmedia",
    icon: <SiTiktok className="w-4 h-4" />,
  },
  {
    label: "Behance",
    href: "https://www.behance.net/SeedTech",
    icon: <SiBehance className="w-4 h-4" />,
  },
];

const footerLinks = {
  services: [
    { label: "Managed IT Support", href: "/services/managed-it" },
    { label: "Web Development", href: "/services/web-development" },
    { label: "SEO Autopilot", href: "/services/seo-autopilot" },
    { label: "Endpoint Security", href: "/endpoint-security-new-jersey" },
    { label: "Help Desk Services", href: "/help-desk-services-new-jersey" },
    { label: "Outsourced IT", href: "/outsourced-it-support-new-jersey" },
    { label: "Cybersecurity", href: "/cybersecurity-services-new-jersey" },
    { label: "Cloud Services", href: "/cloud-services-new-jersey" },
  ],
  industries: [
    { label: "Trucking & Logistics", href: "/industries/trucking" },
    { label: "Construction", href: "/it-support-construction-companies-nj" },
    { label: "Law Firms", href: "/it-support-law-firms-new-jersey" },
    { label: "Medical & HIPAA", href: "/hipaa-compliant-it-support-nj" },
  ],
  locations: [
    { label: "Morristown", href: "/locations/morristown-it-support" },
    { label: "Mendham", href: "/locations/mendham-it-support" },
    { label: "Chester", href: "/locations/chester-it-support" },
    { label: "Bernardsville", href: "/locations/bernardsville-it-support" },
    { label: "Basking Ridge", href: "/locations/basking-ridge-it-support" },
    { label: "Morris County", href: "/locations/morris-county-it-support" },
    { label: "Somerset County", href: "/locations/somerset-county-it-support" },
    { label: "Essex County", href: "/locations/essex-county-it-support" },
    { label: "Union County", href: "/locations/union-county-it-support" },
  ],
  insights: [
    { label: "What Does Managed IT Cost?", href: "/insights/what-does-managed-it-cost-nj" },
    { label: "When to Switch IT Providers", href: "/insights/when-to-switch-it-provider" },
    { label: "What Does an MSP Do?", href: "/insights/what-does-an-msp-do" },
    { label: "Signs Your IT Company Is Failing", href: "/insights/signs-your-it-company-is-failing" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Work", href: "/our-work" },
    { label: "Want to Work With SeedTech?", href: "/work-with-seedtech" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
};

export function Footer({ variant = "default" }: { variant?: "default" | "compact" }) {
  const pathname = usePathname();

  if (variant === "compact") {
    const isSalesRepApplyPage = pathname.startsWith("/work-with-seedtech/apply");
    const salesRepCtaHref = isSalesRepApplyPage ? "/work-with-seedtech" : "/work-with-seedtech/apply";
    const salesRepCtaLabel = isSalesRepApplyPage ? "Role Overview" : "Apply Now";

    return (
      <footer className="border-t border-white/[0.06] bg-dark-base">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <Link href="/" className="flex items-center">
                <Image
                  src="/seedtechlogo_white-scaled.webp"
                  alt="SeedTech"
                  width={140}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-white/62">
                For sales reps evaluating the SeedCare opportunity. Questions about fit, payout, or process? Reach out directly.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <a href="tel:+12016209002" className="text-sm text-white/72 transition-colors hover:text-white">
                (201) 620-9002
              </a>
              <a href="mailto:info@seedtechllc.com" className="text-sm text-white/72 transition-colors hover:text-white">
                info@seedtechllc.com
              </a>
              <Link
                href={salesRepCtaHref}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-glowSeed"
              >
                {salesRepCtaLabel}
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-white/34 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} SeedTech LLC. All rights reserved.</p>
            <Link href="/terms-conditions" className="transition-colors hover:text-white/60">
              Privacy Policy &amp; Terms
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-dark-base">
      <div className="mx-auto max-w-6xl px-6 py-20">

        {/* ── Row 1: Brand + Contact ───────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-16 pb-16 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="space-y-5 max-w-xs">
            <Link href="/" className="flex items-center">
              <Image
                src="/seedtechlogo_white-scaled.webp"
                alt="SeedTech"
                width={140}
                height={36}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-white/45 leading-relaxed">
              Premium IT support, web development, and SEO for businesses that take their digital presence seriously.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg liquid-glass liquid-glass-hover flex items-center justify-center text-white/50 hover:text-white transition-all relative overflow-hidden"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-white">Get in Touch</p>
            <a href="mailto:info@seedtechllc.com" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-seed-500 shrink-0" />
              info@seedtechllc.com
            </a>
            <a href="tel:+12016209002" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-seed-500 shrink-0" />
              (201) 620-9002
            </a>
            <span className="flex items-center gap-3 text-sm text-white/50">
              <MapPin className="w-4 h-4 text-seed-500 shrink-0" />
              Hopatcong, NJ
            </span>
          </div>
        </div>

        {/* ── Row 2: Nav columns ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">
          {/* Services */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Services</p>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Industries</p>
            <ul className="space-y-3">
              {footerLinks.industries.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Locations</p>
            <ul className="space-y-3">
              {footerLinks.locations.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Company</p>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Insights */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Insights</p>
            <ul className="space-y-3">
              {footerLinks.insights.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/pricing/it-support" className="text-sm text-white/60 hover:text-white transition-colors">
                  IT Support Pricing
                </Link>
              </li>
              <li>
                <Link href="/pricing/web-development" className="text-sm text-white/60 hover:text-white transition-colors">
                  Website Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Privacy Fine Print */}
        <div className="gradient-divider mb-8" />
        <p className="text-[11px] leading-relaxed text-white/25 mb-8 w-full">
          SeedTech LLC prioritizes user privacy and outlines how consumer contact information is handled. Contact
          details are voluntarily provided and used for service updates, inquiries, promotions, and service
          improvement. Information is never sold, leased, or traded, but may be shared when required by law or
          with trusted providers under confidentiality agreements. Reasonable data protection measures are
          employed. Consumers have access, correction, and deletion rights by contacting support. Policy updates
          will be communicated. For inquiries, contact{" "}
          <a href="mailto:info@seedtechllc.com" className="underline underline-offset-2 hover:text-white/50 transition-colors">
            info@seedtechllc.com
          </a>.
        </p>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} SeedTech LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms-conditions" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Privacy Policy &amp; Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
