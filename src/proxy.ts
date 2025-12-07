import { NextResponse, type NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    "/dashboard/audit-logs",
    "/dashboard/customers",
    "/dashboard/teams",
    "/dashboard/transactions",
    "/dashboard/waitlist",
    "/dashboard/partner-balance",
    "/dashboard/settings",
  ];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // If accessing a protected route without authentication, redirect to root
  if (isProtectedRoute && !accessToken) {
    const homeUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
