import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // booking.seedtechllc.com → the /booking lander.
  // Redirect (not rewrite) the subdomain root so the client-side pathname
  // resolves to "/booking" and the standalone lander chrome is applied. A
  // rewrite would leave usePathname() at "/" and leak the main site navbar.
  // Strip any port (localhost:3000) before checking the host.
  const host = (request.headers.get("host") || "").split(":")[0];
  const isBookingHost = host.startsWith("booking.");

  if (isBookingHost && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/booking";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  // Pass current pathname to layout via header so it can conditionally render Navbar/Footer
  response.headers.set("x-pathname", request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|img/).*)",
  ],
};
