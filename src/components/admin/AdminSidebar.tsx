"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Search,
  FileEdit,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
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
  },
  {
    label: "Blog Manager",
    href: "/admin/blog",
    icon: FileEdit,
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

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-seed-500/10 text-seed-400"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-seed-400" : "text-white/40")} />
              {item.label}
            </Link>
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
