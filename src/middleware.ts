import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require active charting session
  if (pathname === '/charting' || pathname === '/review') {
    // Here you would typically check for authentication
    // For now, we'll just let it through
    
    // In a real app, you would check the session/token
    // const session = await getSession(request);
    // if (!session) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }

    return NextResponse.next();
  }
} 