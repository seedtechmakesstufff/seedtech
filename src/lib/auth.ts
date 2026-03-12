import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

/**
 * Server-side helper — call in any admin page/layout to guard access.
 * Redirects to /admin/login if the user is not authenticated.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/admin/login");
  }
  return session;
}
