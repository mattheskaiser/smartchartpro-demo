import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth-helpers';
import { validateMasterPassword } from '@/lib/settings';

export async function POST(req: NextRequest) {
  try {
    // Get the token from the request
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check password: either master password OR user's password
    let isValid = false;

    // First check if it's the master password
    if (await validateMasterPassword(password)) {
      isValid = true;
      console.log('Charting verification with master password for:', user.email);
    } else if (user.password) {
      // Try to verify against user's password in DB
      try {
        // If password in DB is plain text (doesn't start with $2), compare directly
        if (!user.password.startsWith('$2')) {
          isValid = password === user.password;
        } else {
          // If it's a bcrypt hash, verify with bcrypt
          isValid = await verifyPassword(password, user.password);
        }
      } catch (err) {
        console.error('Password verification error:', err);
        isValid = false;
      }
    } else {
      // No password set for user, accept master password only
      isValid = false;
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Password verified',
    });
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json({ error: 'An error occurred during verification' }, { status: 500 });
  }
}
