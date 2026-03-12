"use client";

import { signOut } from "next-auth/react";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Search,
  FileEdit,
  Settings,
  Sprout,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  {
    label: "SEO",
    href: "/admin/seo",
    icon: Search,
    children: [
      { label: "Blog Manager", href: "/admin/blog", icon: FileEdit },
    ],
  },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminTopbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 bg-dark-raised border-b border-white/[0.06] shrink-0">
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 -ml-2 text-white/60 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Spacer on desktop */}
        <div className="hidden lg:block" />

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40 hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 h-full bg-dark-raised border-r border-white/[0.06] flex flex-col">
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06]">
              <Link href="/admin" className="flex items-center gap-2.5">
                <Sprout className="w-6 h-6 text-seed-500" />
                <span className="font-display text-xl tracking-wide text-white">SEEDTECH</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

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
                      onClick={() => setMobileOpen(false)}
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
                            "w-4 h-4 shrink-0 text-white/20",
                            isExpanded && "rotate-180 text-white/40"
                          )}
                        />
                      )}
                    </Link>
                    {item.children && isExpanded && (
                      <div className="ml-5 pl-3 mt-0.5 mb-1 border-l border-white/[0.06] space-y-0.5">
                        {item.children.map((child) => {
                          const childActive = pathname.startsWith(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
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
          </aside>
        </div>
      )}
    </>
  );
}
