"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuoteFlow } from "@/components/quote-flow";
import StaggeredMenu, { StaggeredMenuHandle } from "@/components/ui/StaggeredMenu";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Managed IT Support", href: "/services/managed-it" },
      { label: "Web Development", href: "/services/web-development" },
    ],
  },
  { label: "Our Work", href: "/our-work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Returns true when the user is scrolling downward past a threshold,
 * false when scrolling up. Stays visible at the very top of the page.
 */
function useHideOnScroll(threshold = 10) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      // Always show at the top of the page
      if (currentY < threshold) {
        setHidden(false);
      } else if (currentY > lastScrollY.current + threshold) {
        setHidden(true);
      } else if (currentY < lastScrollY.current - threshold) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}

/**
 * Watches all `[data-section-theme="light"]` elements and returns `true`
 * whenever any of them overlap the navbar zone (top 80px of the viewport).
 */
function useOverLightSection() {
  const [overLight, setOverLight] = useState(false);
  const activeRef = useRef(new Set<Element>());

  const observe = useCallback(() => {
    // Shrink the intersection root to just the top 80px of the viewport
    const bottomMargin = -(window.innerHeight - 80);
    activeRef.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeRef.current.add(entry.target);
          } else {
            activeRef.current.delete(entry.target);
          }
        });
        setOverLight(activeRef.current.size > 0);
      },
      {
        rootMargin: `0px 0px ${bottomMargin}px 0px`,
        threshold: 0,
      }
    );

    const lightSections = document.querySelectorAll('[data-section-theme="light"]');
    lightSections.forEach((el) => observer.observe(el));

    return observer;
  }, []);

  useEffect(() => {
    let observer = observe();

    // Re-observe on client-side navigation (DOM mutations)
    const mutationObserver = new MutationObserver(() => {
      observer.disconnect();
      observer = observe();
    });
    mutationObserver.observe(document.querySelector("main") || document.body, {
      childList: true,
      subtree: false,
    });

    // Re-calculate on resize (bottomMargin depends on viewport height)
    const handleResize = () => {
      observer.disconnect();
      observer = observe();
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [observe]);

  return overLight;
}

export function Navbar() {
  const [_mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<StaggeredMenuHandle>(null);
  const overLight = useOverLightSection();
  const hidden = useHideOnScroll();
  const { openQuoteFlow } = useQuoteFlow();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 pt-3 transition-transform duration-300 ease-out",
        hidden && "-translate-y-full"
      )}
    >
      <div className="mx-auto max-w-6xl px-4">
        <nav className={cn(
          "rounded-2xl flex items-center justify-between h-14 px-4 transition-all duration-300",
          overLight
            ? "bg-[#1a1a2e] border border-white/[0.10] shadow-lg shadow-black/30"
            : "liquid-glass"
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/seedtechlogo_white-scaled.webp"
              alt="SeedTech"
              width={160}
              height={48}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative group"
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  {/* Invisible bridge fills the gap so mouseleave doesn't fire */}
                  <div className="absolute top-full left-0 w-full h-3 bg-transparent" />
                  <div className="absolute top-[calc(100%+0.5rem)] left-0 w-56 bg-[#1a1a2e] border border-white/[0.10] rounded-xl p-2 shadow-xl shadow-black/40
                    opacity-0 invisible translate-y-1
                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                    transition-all duration-200 ease-out">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
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

          {/* Mobile Toggle — triggers StaggeredMenu */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => menuRef.current?.toggle()}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </div>

      {/* Staggered Mobile Menu — visible on tablet + mobile (below md) */}
      <div className="md:hidden">
        <StaggeredMenu
          ref={menuRef}
          isFixed
          showInternalToggle={false}
          position="right"
          colors={["#0c0c14", "#0a0a0f"]}
          accentColor="#40A660"
          logoUrl="/seedtechlogo_white-scaled.webp"
          logoAlt="SeedTech"
          menuButtonColor="#ffffff"
          openMenuButtonColor="#ffffff"
          changeMenuColorOnOpen={false}
          displaySocials={false}
          displayItemNumbering={false}
          closeOnClickAway
          items={[
            ...navLinks.map((link) => ({
              label: link.label,
              ariaLabel: `Go to ${link.label}`,
              link: link.href,
              ...(link.children
                ? {
                    children: link.children.map((child) => ({
                      label: child.label,
                      ariaLabel: `Go to ${child.label}`,
                      link: child.href,
                    })),
                  }
                : {}),
            })),
            {
              label: "Get a Quote",
              ariaLabel: "Get a free quote",
              link: "#",
              onClick: () => openQuoteFlow(),
            },
          ]}
          onMenuOpen={() => setMobileOpen(true)}
          onMenuClose={() => setMobileOpen(false)}
        />
      </div>
    </header>
  );
}
