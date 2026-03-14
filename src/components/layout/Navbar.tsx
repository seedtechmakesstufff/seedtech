"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuoteFlow } from "@/components/quote-flow";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Managed IT Support", href: "/services/managed-it" },
      { label: "Web Development", href: "/services/web-development" },
      { label: "Marketing", href: "/services/marketing" },
    ],
  },
  { label: "Our Work", href: "/our-work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openQuoteFlow } = useQuoteFlow();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll(); // check on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3">
      <div className="mx-auto max-w-6xl px-4">
        <nav className={cn(
          "rounded-2xl flex items-center justify-between h-14 px-4 transition-all duration-300",
          scrolled
            ? "bg-dark-base/80 backdrop-blur-xl border border-white/[0.08] shadow-lg shadow-black/20"
            : "liquid-glass"
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/seedtechlogo_white-scaled.webp"
              alt="SeedTech"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
                    {link.label}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", servicesOpen && "rotate-180")} />
                  </button>
                  {servicesOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 liquid-glass rounded-xl p-2 animate-fade-in">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => openQuoteFlow()}
            className="hidden md:inline-flex items-center px-5 py-2 text-sm font-medium text-white liquid-glass-tinted-seed liquid-glass-hover rounded-xl transition-all duration-300 relative overflow-hidden"
          >
            Get a Quote
          </button>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-4 liquid-glass rounded-2xl animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex items-center justify-between w-full px-3 py-3 text-sm text-white/70 hover:text-white rounded-lg"
                  >
                    {link.label}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", servicesOpen && "rotate-180")} />
                  </button>
                  {servicesOpen && (
                    <div className="pl-4 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 text-sm text-white/50 hover:text-white rounded-lg"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-3 text-sm text-white/70 hover:text-white rounded-lg"
                >
                  {link.label}
                </Link>
              )
            )}
            <button
              onClick={() => {
                setMobileOpen(false);
                openQuoteFlow();
              }}
              className="block w-full mt-2 text-center px-5 py-3 text-sm font-medium text-white liquid-glass-tinted-seed liquid-glass-hover rounded-xl relative overflow-hidden"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}


    </header>
  );
}
