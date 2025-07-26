import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, we'll just check if the path is a shift route
  if (request.nextUrl.pathname.startsWith('/shift/')) {
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