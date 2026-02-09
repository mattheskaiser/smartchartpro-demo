import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// MAINTENANCE MODE - Set to true to enable maintenance page
const MAINTENANCE_MODE = true;

// Check if demo mode is enabled
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // MAINTENANCE MODE: Redirect all requests to maintenance page
  if (MAINTENANCE_MODE && pathname !== '/maintenance') {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // Allow access to maintenance page
  if (pathname === '/maintenance') {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth', '/admin'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token, redirect to login (only for charting routes)
  if (!token && pathname.startsWith('/charting')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If we have a token, do additional checks
  if (token) {
    const userRole = token.role as 'ADMIN' | 'CNA' | undefined;
    const mustChangePassword = token.mustChangePassword as boolean | undefined;

    // In demo mode, skip password change requirement
    if (!isDemoMode && mustChangePassword && pathname !== '/profile/change-password') {
      return NextResponse.redirect(new URL('/profile/change-password', request.url));
    }

    // Redirect authenticated users away from login page
    if (pathname === '/login') {
      if (userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'CNA') {
        // For CNAs, check if they have an active session
        // This will be handled by the login page itself via API call
        return NextResponse.redirect(new URL('/charting/start', request.url));
      }
    }

    // CNA routes - CNAs and Admins can access in demo mode
    if (pathname.startsWith('/charting')) {
      // In demo mode, allow both CNAs and Admins to access charting
      if (!isDemoMode && userRole !== 'CNA') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // API routes protection for sessions (CNAs and Admins in demo mode)
    if (pathname.startsWith('/api/sessions')) {
      // In demo mode, allow both CNAs and Admins to access session APIs
      if (!isDemoMode && userRole !== 'CNA') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
