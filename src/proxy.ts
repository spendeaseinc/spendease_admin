import { NextResponse, type NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  // Check if the current path starts with any protected route
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check if the current path starts with any auth route
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  // If accessing an auth route while authenticated, redirect to dashboard home
  if (isAuthRoute && accessToken) {
    const ddashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(ddashboardUrl);
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
