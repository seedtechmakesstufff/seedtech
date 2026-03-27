import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AdminThemeProvider } from "@/components/providers/AdminThemeProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const metadata: Metadata = {
  title: "Admin — SeedTech",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <AuthProvider>
      <AdminThemeProvider>
        <div className="flex h-screen overflow-hidden bg-dark-base">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminTopbar user={session.user} />
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </AdminThemeProvider>
    </AuthProvider>
  );
}
