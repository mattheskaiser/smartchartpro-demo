import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

type RouteContext = { params: Record<string, string> };

/**
 * Higher-order function to protect API routes with authentication
 */
export function withAuth(
  handler: (req: NextRequest, context?: RouteContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: RouteContext) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(req, context);
  };
}

/**
 * Higher-order function to protect API routes with role-based access
 */
export function withRole(
  handler: (req: NextRequest, context?: RouteContext) => Promise<NextResponse>,
  requiredRole: 'ADMIN' | 'CNA'
) {
  return async (req: NextRequest, context?: RouteContext) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== requiredRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return handler(req, context);
  };
}

/**
 * Higher-order function to protect CNA routes that require an active session
 */
export function withCNASession(
  handler: (req: NextRequest, context?: RouteContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: RouteContext) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'CNA') {
      return NextResponse.json({ error: 'Only CNAs can access this route' }, { status: 403 });
    }

    if (!session.user.cnaId) {
      return NextResponse.json({ error: 'CNA account not properly configured' }, { status: 400 });
    }

    return handler(req, context);
  };
}

/**
 * Get session from request (helper for use in route handlers)
 */
export async function getSession() {
  return getServerSession(authOptions);
}
