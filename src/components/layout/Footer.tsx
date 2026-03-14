import Link from "next/link";
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
    { label: "Marketing", href: "/services/marketing" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Work", href: "/our-work" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-dark-base">
      <div className="mx-auto max-w-6xl px-6 py-20">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                <span className="font-display text-lg font-bold text-white">S</span>
              </div>
              <span className="font-display text-xl font-bold text-white">SeedTech</span>
            </Link>
            <p className="text-body-sm text-white/50 leading-relaxed max-w-[250px]">
              Premium IT support, web development, and marketing solutions that help businesses grow.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg liquid-glass liquid-glass-hover flex items-center justify-center text-white/50 hover:text-white transition-all relative overflow-hidden"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Helpful Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5">Helpful Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/pricing/it-support" className="text-sm text-white/50 hover:text-white transition-colors">
                  IT Support Pricing
                </Link>
              </li>
              <li>
                <Link href="/pricing/web-development" className="text-sm text-white/50 hover:text-white transition-colors">
                  Website Development Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-white/50 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Mail className="w-4 h-4 text-seed-500 shrink-0" />
                info@seedtechllc.com
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Phone className="w-4 h-4 text-seed-500 shrink-0" />
                (555) 123-4567
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-seed-500 shrink-0" />
                Northern NJ
              </li>
            </ul>
          </div>
        </div>

        {/* Privacy Fine Print */}
        <div className="gradient-divider mb-8" />
        <p className="text-[11px] leading-relaxed text-white/25 mb-8 max-w-4xl">
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
