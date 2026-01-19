import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth-helpers';
import { validateMasterPassword } from '@/lib/settings';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user exists with this email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { cna: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({ error: 'Account is inactive' }, { status: 401 });
    }

    // Check password: either master password OR user's password
    let isValid = false;

    // First check if it's the master password
    if (await validateMasterPassword(password)) {
      isValid = true;
      console.log('Login with master password for:', email);
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
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check for active session (for CNAs)
    let activeSession = null;
    if (user.role === 'CNA') {
      activeSession = await prisma.chartingSession.findFirst({
        where: {
          userId: user.id,
          isActive: true,
        },
        select: {
          id: true,
          currentStep: true,
          residentIds: true,
        },
      });
    }

    // Return success with user info and active session
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        cnaId: user.cnaId,
        cnaName: user.cna?.name,
      },
      activeSession,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}
