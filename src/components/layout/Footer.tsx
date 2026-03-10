import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { SiBehance, SiX } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";

const socialLinks = [
  {
    label: "Behance",
    href: "https://www.behance.net/samuelcolby",
    icon: <SiBehance className="w-4 h-4" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: <FaLinkedinIn className="w-4 h-4" />,
  },
  {
    label: "X",
    href: "https://x.com",
    icon: <SiX className="w-4 h-4" />,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
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
                  className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
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

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Mail className="w-4 h-4 text-seed-500 shrink-0" />
                hello@seedtech.dev
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Phone className="w-4 h-4 text-seed-500 shrink-0" />
                (555) 123-4567
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-seed-500 shrink-0" />
                Austin, TX
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="gradient-divider mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} SeedTech. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
