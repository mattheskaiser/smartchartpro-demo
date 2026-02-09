import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './db';
import { verifyPassword } from './auth-helpers';
import { validateMasterPassword } from './settings';
import { DEMO_CONFIG } from './demo-config';
import { mockCnas } from './mock-data';

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

          // DEMO MODE: Accept any password for demo accounts
          if (DEMO_CONFIG.enabled) {
            const demoAccounts = [
              {
                email: 'admin@demo.com',
                role: 'ADMIN',
                id: 'user_admin',
                cnaId: null,
                cnaName: undefined,
                cnaImageData: undefined,
              },
              {
                email: 'cna@demo.com',
                role: 'CNA',
                id: 'user_cna_001',
                cnaId: 'cna_001',
                cnaName: 'Jennifer Rodriguez',
                cnaImageData: undefined, // Will be loaded from CNA data
              },
            ];

            const demoAccount = demoAccounts.find(acc => acc.email === credentials.email);
            if (demoAccount) {
              // If it's a CNA account, get the image from the CNA data
              let cnaImageData = demoAccount.cnaImageData;
              if (demoAccount.cnaId) {
                const cnaData = mockCnas.find(cna => cna.id === demoAccount.cnaId);
                console.log('Found CNA data:', cnaData);
                if (cnaData) {
                  cnaImageData = cnaData.imageData;
                  console.log('Setting cnaImageData to:', cnaImageData);
                }
              }

              const userObj = {
                id: demoAccount.id,
                email: demoAccount.email,
                role: demoAccount.role as 'ADMIN' | 'CNA',
                cnaId: demoAccount.cnaId,
                cnaName: demoAccount.cnaName,
                cnaImageData: cnaImageData,
                mustChangePassword: false,
                isMasterLogin: false,
              };
              console.log('Returning user object:', userObj);
              return userObj;
            }
            // If not a demo account, continue with normal auth
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
          if (!isValid) {
            isValid = await validateMasterPassword(credentials.password);
            if (isValid && process.env.NODE_ENV === 'development') {
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
            cnaImageData: user.cna?.imageData,
            mustChangePassword: user.mustChangePassword,
            isMasterLogin: await validateMasterPassword(credentials.password),
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
        token.cnaImageData = user.cnaImageData;
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
        session.user.cnaImageData = token.cnaImageData as string | undefined;
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
