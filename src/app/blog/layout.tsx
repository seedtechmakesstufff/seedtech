/* Blog pages use the root layout (Navbar + Footer) — no custom layout needed.
 * This file exists only to confirm intent: blog routes inherit from app/layout.tsx.
 */

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
