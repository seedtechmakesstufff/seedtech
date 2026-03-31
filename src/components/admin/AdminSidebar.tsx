"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Search,
  FileEdit,
  Settings,
  Sprout,
  ChevronDown,
  Inbox,
  SlidersHorizontal,
  Mail,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteSwitcher } from "./SiteSwitcher";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "SEO",
    href: "/admin/seo",
    icon: Search,
    children: [
      {
        label: "AI Context",
        href: "/admin/seo/context",
        icon: Brain,
      },
      {
        label: "Blog Manager",
        href: "/admin/blog",
        icon: FileEdit,
      },
      {
        label: "SEO Settings",
        href: "/admin/seo/settings",
        icon: SlidersHorizontal,
      },
    ],
  },
  {
    label: "Submissions",
    href: "/admin/submissions",
    icon: Inbox,
  },
  {
    label: "Email",
    href: "/admin/email",
    icon: Mail,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-dark-raised border-r border-white/[0.06] shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Sprout className="w-6 h-6 text-seed-500" />
          <span className="font-display text-xl tracking-wide text-white">SEEDTECH</span>
        </Link>
      </div>

      {/* Site Switcher */}
      <div className="px-3 pt-3">
        <SiteSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const isChildActive = item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
          const isExpanded = isActive || isChildActive;

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-seed-500/10 text-seed-400"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-seed-400" : "text-white/40")} />
                <span className="flex-1">{item.label}</span>
                {item.children && (
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform text-white/20",
                      isExpanded && "rotate-180 text-white/40"
                    )}
                  />
                )}
              </Link>

              {/* Sub-items */}
              {item.children && isExpanded && (
                <div className="ml-5 pl-3 mt-0.5 mb-1 border-l border-white/[0.06] space-y-0.5">
                  {item.children.map((child) => {
                    const childActive = pathname.startsWith(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                          childActive
                            ? "text-seed-400 bg-seed-500/5"
                            : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                        )}
                      >
                        <child.icon className={cn("w-4 h-4 shrink-0", childActive ? "text-seed-400" : "text-white/30")} />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06]">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
