"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Menu,
  ChevronDown,
  Monitor,
  SquareTerminal,
  Search,
  MapPin,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuoteFlow } from "@/components/quote-flow";
import { MobileNav } from "@/components/layout/MobileNav";

/* Le-Strange decorative icon */
function LeStrangeIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/le-strange.svg"
      alt=""
      width={19}
      height={15}
      className={className}
      aria-hidden
    />
  );
}

/* ─── Rich dropdown data ────────────────────────────────────────────────────── */

interface MegaItem {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

interface FeaturedCard {
  title: string;
  description: string;
  href: string;
  /** Path to an image in /public — swap placeholders for real shots later */
  image: string;
}

interface MegaDropdownData {
  heading?: string;
  items: MegaItem[];
  featured: FeaturedCard[];
}

const servicesMega: MegaDropdownData = {
  items: [
    {
      label: "Managed IT Support",
      href: "/services/managed-it",
      description: "24/7 monitoring, help desk, and proactive maintenance for your entire network.",
      icon: Monitor,
    },
    {
      label: "Web Development",
      href: "/services/web-development",
      description: "Custom websites, eCommerce stores, and web apps built to convert.",
      icon: SquareTerminal,
    },
    {
      label: "SEO",
      href: "/services/seo-autopilot",
      description: "Local SEO, AI search visibility, and content built to rank — for restaurants and growing businesses.",
      icon: Search,
    },
  ],
  featured: [
    {
      title: "Managed IT Support Plans",
      description: "Essentials, Plus, and Pro — managed IT starting at $110/user/mo.",
      href: "/services/managed-it/plans",
      image: "/img/nav/managed_it_support_support_plans_2x.webp",
    },
    {
      title: "See Our Work",
      description: "Real projects we've delivered for businesses across NJ.",
      href: "/our-work",
      image: "/img/nav/see_our_work_2x.webp",
    },
  ],
};

const locationsMega: MegaDropdownData = {
  heading: "Local Locations We Serve",
  items: [
    {
      label: "Morristown",
      href: "/locations/morristown-it-support",
      description: "IT support for businesses in downtown Morristown and surrounding Morris County.",
      icon: MapPin,
    },
    {
      label: "Mendham",
      href: "/locations/mendham-it-support",
      description: "Managed IT and cybersecurity for Mendham Borough and Township.",
      icon: MapPin,
    },
    {
      label: "Chester",
      href: "/locations/chester-it-support",
      description: "On-site and remote IT support serving Chester and Long Valley.",
      icon: MapPin,
    },
    {
      label: "Bernardsville",
      href: "/locations/bernardsville-it-support",
      description: "Help desk and network management for Bernardsville businesses.",
      icon: MapPin,
    },
    {
      label: "Basking Ridge",
      href: "/locations/basking-ridge-it-support",
      description: "Enterprise-grade IT for Basking Ridge offices and remote teams.",
      icon: MapPin,
    },
    {
      label: "Morris County",
      href: "/locations/morris-county-it-support",
      description: "Full-service managed IT across every Morris County township.",
      icon: MapPin,
    },
    {
      label: "Somerset County",
      href: "/locations/somerset-county-it-support",
      description: "IT support and cybersecurity for Somerset County businesses.",
      icon: MapPin,
    },
    {
      label: "Essex County",
      href: "/locations/essex-county-it-support",
      description: "Help desk, cloud, and network management for Essex County.",
      icon: MapPin,
    },
    {
      label: "Union County",
      href: "/locations/union-county-it-support",
      description: "Proactive IT solutions for Union County offices and firms.",
      icon: MapPin,
    },
    {
      label: "Manhattan",
      href: "/locations/manhattan-it-support",
      description: "On-site and remote IT support for Manhattan businesses and offices.",
      icon: MapPin,
    },
    {
      label: "Nationwide",
      href: "/nationwide-it-support",
      description: "Remote IT support, monitoring, and cybersecurity for businesses across the U.S.",
      icon: Globe,
    },
  ],
  featured: [
    {
      title: "Managed IT Support",
      description: "Full-service IT coverage for businesses across New Jersey.",
      href: "/services/managed-it",
      image: "/img/nav/managed_it_support_2x.webp",
    },
    {
      title: "Get a Free Audit",
      description: "See where your IT stands — no cost, no obligation.",
      href: "/contact",
      image: "/img/nav/get_a_free_audit_2x.webp",
    },
  ],
};

/* Simple links for the mobile menu (flat list) */
const navLinks = [
  {
    label: "Services",
    href: "/services",
    mega: servicesMega,
    children: servicesMega.items.map((i) => ({ label: i.label, href: i.href })),
  },
  {
    label: "Locations",
    href: "/locations/morris-county-it-support",
    mega: locationsMega,
    children: locationsMega.items.map((i) => ({ label: i.label, href: i.href })),
  },
  { label: "Our Work", href: "/our-work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* ─── Mega-dropdown panel ───────────────────────────────────────────────────── */

function MegaPanel({ data }: { data: MegaDropdownData }) {
  const isWide = data.items.length > 5;
  return (
    <div className="grid gap-0 grid-cols-[260px_1fr_1fr] min-w-[820px] min-h-[380px]">
      {/* Left: item list */}
      <div className={cn(
        "flex flex-col border-r border-white/[0.06]",
        isWide && "max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      )}>
        {data.heading && (
          <div className="sticky top-0 z-10 bg-[#111118] px-3 pt-3 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">{data.heading}</p>
          </div>
        )}
        <div className="flex flex-col py-1 pr-2">
        {data.items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-3.5 px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors group/item"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white/50 group-hover/item:bg-seed-500/15 group-hover/item:text-seed-400 transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white leading-tight">{item.label}</p>
                <p className="text-[12px] text-white/40 leading-relaxed mt-0.5 line-clamp-2">{item.description}</p>
              </div>
            </Link>
          );
        })}
        </div>
      </div>

      {/* Right: featured cards — side by side (each gets its own column) */}
      {data.featured.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group/card relative flex flex-col justify-end rounded-xl overflow-hidden min-h-[220px] m-2"
        >
          {/* Background image */}
          <div className="absolute inset-0 bg-white/[0.04]">
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover opacity-80 group-hover/card:opacity-100 transition-opacity duration-300"
              sizes="280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/60 to-transparent" />
          </div>
          {/* Text overlay */}
          <div className="relative z-10 p-4">
            <p className="text-sm font-semibold text-white leading-tight">{card.title}</p>
            <p className="text-[12px] text-white/50 leading-relaxed mt-1 line-clamp-2">{card.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const overLight = useOverLightSection();
  const hidden = useHideOnScroll();
  const { openQuoteFlow } = useQuoteFlow();
  const isSalesRepPage = pathname.startsWith("/work-with-seedtech");
  const isSalesRepApplyPage = pathname.startsWith("/work-with-seedtech/apply");
  const salesRepCtaHref = isSalesRepApplyPage ? "/work-with-seedtech" : "/work-with-seedtech/apply";
  const salesRepCtaLabel = isSalesRepApplyPage ? "Role Overview" : "Apply Now";
  const mobileCta = isSalesRepPage
    ? { label: salesRepCtaLabel, onClick: () => { window.location.href = salesRepCtaHref; } }
    : { label: "Get a Quote", onClick: () => openQuoteFlow() };

  return (
    <>
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out",
        hidden && "-translate-y-full"
      )}
    >
      <nav className={cn(
        "relative flex items-center justify-between h-16 px-6 lg:px-12 transition-all duration-300 border-b",
        overLight
          ? "bg-[#1a1a2e]/90 backdrop-blur-xl border-white/[0.08]"
          : "bg-dark-base/60 backdrop-blur-xl border-white/[0.06]"
      )}>
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center group">
            <Image
              src="/seedtechlogo_white-scaled.webp"
              alt="SeedTech"
              width={160}
              height={48}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav — absolutely centered */}
          <div className="hidden md:flex items-center gap-1 absolute inset-0 justify-center pointer-events-none">
            <div className="flex items-center gap-1 pointer-events-auto">
            {navLinks.map((link) => {
              const isServices = link.label === "Services";
              const hasMega = "mega" in link && link.mega;

              const node = hasMega ? (
                <div
                  key={link.label}
                  className="relative group/mega"
                >
                  <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
                    {isServices && <LeStrangeIcon className="h-3.5 w-auto opacity-80" />}
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover/mega:rotate-180" />
                  </button>
                  {/* Invisible bridge */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[calc(100%+4rem)] h-4 bg-transparent" />
                  {/* Mega panel */}
                  <div className={cn(
                    "absolute top-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2",
                    "bg-[#111118] border border-white/[0.08] rounded-2xl p-2 shadow-2xl shadow-black/60",
                    "opacity-0 invisible translate-y-2 scale-[0.98]",
                    "group-hover/mega:opacity-100 group-hover/mega:visible group-hover/mega:translate-y-0 group-hover/mega:scale-100",
                    "transition-all duration-250 ease-out",
                  )}>
                    <MegaPanel data={link.mega} />
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
              );

              /* Vertical divider after Services */
              if (isServices) {
                return (
                  <div key={link.label} className="flex items-center">
                    {node}
                    <div className="h-5 w-px bg-white/[0.12] mx-1" />
                  </div>
                );
              }

              return node;
            })}
            </div>
          </div>

          {/* CTA */}
          {isSalesRepPage ? (
            <a
              href={salesRepCtaHref}
              className="relative z-10 hidden md:inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-gradient-brand rounded-xl transition-all duration-300 hover:shadow-glowSeed"
            >
              {salesRepCtaLabel}
            </a>
          ) : (
            <button
              onClick={() => openQuoteFlow()}
              className="relative z-10 hidden md:inline-flex items-center px-5 py-2 text-sm font-medium text-white liquid-glass-tinted-seed liquid-glass-hover rounded-xl transition-all duration-300 overflow-hidden"
            >
              Get a Quote
            </button>
          )}

          {/* Mobile Toggle — triggers StaggeredMenu */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
    </header>


    {/* Mobile Nav */}
    <MobileNav
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      logoUrl="/seedtechlogo_white-scaled.webp"
      logoAlt="SeedTech"
      cta={mobileCta}
      items={navLinks.map((link) => {
        const hasMega = "mega" in link && link.mega;
        const isServices = link.label === "Services";
        return {
          label: link.label,
          href: link.href,
          ...(isServices
            ? { iconNode: <LeStrangeIcon className="h-3 w-auto opacity-80" /> }
            : {}),
          ...(hasMega
            ? {
                children: link.mega!.items.map((item) => ({
                  label: item.label,
                  href: item.href,
                  description: item.description,
                })),
                featuredCards: link.mega!.featured.map((card) => ({
                  title: card.title,
                  description: card.description,
                  href: card.href,
                  image: card.image,
                })),
              }
            : {}),
        };
      })}
    />
    </>
  );
}
