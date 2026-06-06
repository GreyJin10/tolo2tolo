import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware that checks for NextAuth session cookie
// This avoids importing Prisma/auth which uses Node.js modules
// and would fail in Edge Runtime
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protected routes
  const protectedPaths = ["/cart", "/checkout", "/orders", "/account"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // Check for NextAuth session token
  const hasSession =
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("next-auth.session-token") ||
    req.cookies.has("__Secure-next-auth.session-token");

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/account/:path*",
  ],
};
