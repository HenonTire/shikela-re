import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Verify refresh token against Django backend
async function isTokenValid(token: string): Promise<boolean> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  if (!backendUrl) return false;

  try {
    const res = await fetch(`${backendUrl}/auth/token/verify/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    return res.ok;
  } catch (err) {
    console.error("Middleware token verification failed:", err);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Read token and user role from cookies
  const token = request.cookies.get("refresh_token")?.value;
  const role = request.cookies.get("userRole")?.value;

  // Check route types
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  // Validate token existence and validity
  const authenticated = token ? await isTokenValid(token) : false;

  // 1. If user IS authenticated and trying to access /login/* or /register/*
  if (isAuthRoute && authenticated) {
    let targetPath = "/dashboard";
    if (role === "supplier") targetPath = "/supplier/dashboard";
    if (role === "courier") targetPath = "/courier/dashboard";

    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  // 2. If user is NOT authenticated and trying to access any route EXCEPT /login/* or /register/*
  if (!isAuthRoute && !authenticated) {
    const loginUrl = new URL("/login", request.url);
    // Optional: preserve the original path to redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Configure matcher to exclude static files, images, favicon, and Next.js internals
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Image extensions: svg, png, jpg, jpeg, gif, webp
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};