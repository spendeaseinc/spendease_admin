import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/auth/login", "/auth/reset-password", "/auth/signup"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard/default", request.url));
  }

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname === "/") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dashboard/default", request.url));
    } else {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
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
