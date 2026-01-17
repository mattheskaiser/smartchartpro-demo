import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './db';
import { verifyPassword } from './auth-helpers';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        masterPassword: { label: 'Master Password', type: 'password', optional: true },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Find user by email - MUST exist in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { cna: true },
          });

          if (!user) {
            return null;
          }

          // Check if user is active
          if (!user.isActive) {
            return null;
          }

          // Check password: user's DB password OR master password (only for existing users)
          const masterPassword = process.env.NEXT_PUBLIC_MASTER_PASSWORD;
          let isValid = false;

          // First try user's password in DB
          if (user.password) {
            try {
              // If password in DB is plain text (doesn't start with $2), compare directly
              if (!user.password.startsWith('$2')) {
                isValid = credentials.password === user.password;
              } else {
                // If it's a bcrypt hash, verify with bcrypt
                isValid = await verifyPassword(credentials.password, user.password);
              }
            } catch (err) {
              if (process.env.NODE_ENV === 'development') {
                console.error('Password verification error:', err);
              }
              isValid = false;
            }
          }

          // Only allow master password for existing users as fallback
          if (!isValid && masterPassword && credentials.password === masterPassword) {
            isValid = true;
            if (process.env.NODE_ENV === 'development') {
              console.log('Login with master password for existing user:', credentials.email);
            }
          }

          if (!isValid) {
            return null;
          }

          // Update last login time
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginAt: new Date() },
            });
          } catch (updateError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error updating last login time:', updateError);
            }
            // Don't fail login if we can't update last login time
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            cnaId: user.cnaId,
            cnaName: user.cna?.name,
            mustChangePassword: user.mustChangePassword,
            isMasterLogin: credentials.password === masterPassword,
          };
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Auth error:', error);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.cnaId = user.cnaId;
        token.cnaName = user.cnaName;
        token.mustChangePassword = user.mustChangePassword;
        token.isMasterLogin = user.isMasterLogin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'ADMIN' | 'CNA';
        session.user.cnaId = token.cnaId as string | null;
        session.user.cnaName = token.cnaName as string | undefined;
        session.user.mustChangePassword = token.mustChangePassword as boolean;
        session.user.isMasterLogin = token.isMasterLogin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
