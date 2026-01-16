import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

    // Force password change if required (except for password change page itself)
    if (mustChangePassword && pathname !== '/profile/change-password') {
      return NextResponse.redirect(new URL('/profile/change-password', request.url));
    }

    // Redirect authenticated users away from login page
    if (pathname === '/login') {
      if (userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'CNA') {
        return NextResponse.redirect(new URL('/charting/start', request.url));
      }
    }

    // CNA routes - only CNAs can access (admins redirected to admin panel)
    if (pathname.startsWith('/charting')) {
      if (userRole !== 'CNA') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // API routes protection for sessions (only CNAs)
    if (pathname.startsWith('/api/sessions')) {
      if (userRole !== 'CNA') {
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
