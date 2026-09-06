import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "cipher_admin";

/**
 * Edge gate for /admin — checks the session cookie is present.
 * Full HMAC verification happens server-side in the dashboard
 * layout and every /api/admin route (defense in depth).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasCookie = !!req.cookies.get(SESSION_COOKIE)?.value;

  if (pathname === "/admin/login") {
    // Already signed in? skip the login form.
    if (hasCookie) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!hasCookie) {
    const login = new URL("/admin/login", req.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
