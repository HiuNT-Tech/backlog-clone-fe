import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/board'];

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/account/verification'];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If it's not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // For protected routes, check for authentication cookies
  // The backend uses HTTP-only cookies for JWT tokens
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');

  // If no tokens found, redirect to login
  if (!accessToken && !refreshToken) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the intended destination for redirect after login
    loginUrl.searchParams.set('redirect', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // If tokens exist, allow the request to proceed
  // The backend will validate the tokens
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
