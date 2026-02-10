import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for NextAuth session cookie
  const sessionToken =
    request.cookies.get('authjs.session-token')?.value || request.cookies.get('__Secure-authjs.session-token')?.value;

  const isAuthenticated = !!sessionToken;

  // List of routes that need authentication
  const protectedPaths = ['/dashboard', '/projects', '/admin', '/activity', '/profile'];
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

  // Redirect to login if not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/register
  if ((pathname === '/login' || pathname === '/register') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/:path*',
    '/admin/:path*',
    '/activity/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
};
