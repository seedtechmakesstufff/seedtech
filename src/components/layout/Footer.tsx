import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const socialLinks = [
  {
    label: "Behance",
    href: "https://www.behance.net/samuelcolby",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.513-1.987-5.513-5.517 0-3.612 2.432-5.626 5.508-5.626 3.318 0 5.126 2.203 5.126 5.265 0 .42-.042.801-.085 1.078H15.89c.134 1.505 1.218 2.127 2.372 2.127 1.205 0 1.87-.671 2.107-1.327h3.357zm-5.101-6.505c-1.065 0-1.951.657-2.197 1.818h4.332c-.054-1.105-.88-1.818-2.135-1.818zM0 0v24h10.505c3.828 0 7.38-1.943 7.38-6.247 0-2.617-1.617-4.397-3.965-5.054C15.619 12.052 16.68 10.618 16.68 8.71 16.68 4.972 13.658 3 9.963 3H0zm8.998 14.377H4.195v3.77h4.803c1.378 0 2.43-.699 2.43-1.965 0-1.21-.973-1.805-2.43-1.805zM4.195 6.01h4.35c1.298 0 2.131.555 2.131 1.7 0 1.094-.833 1.765-2.131 1.765H4.195V6.01z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
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
