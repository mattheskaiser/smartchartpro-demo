import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { verifyPassword } from './auth-helpers';

const prisma = new PrismaClient();

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
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                // Find user by email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { cna: true },
                });

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                // Check if user is active
                if (!user.isActive) {
                    throw new Error('Account is inactive. Please contact an administrator.');
                }

                // Check for master password (admin accessing CNA account)
                const masterPassword = process.env.MASTER_PASSWORD;
                if (credentials.masterPassword && masterPassword) {
                    if (credentials.masterPassword === masterPassword) {
                        // Admin is logging in as CNA using master password
                        return {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                            cnaId: user.cnaId,
                            cnaName: user.cna?.name,
                            mustChangePassword: false, // Don't force password change for master login
                            isMasterLogin: true,
                        };
                    } else {
                        throw new Error('Invalid master password');
                    }
                }

                // Regular password verification
                const isValid = await verifyPassword(credentials.password, user.password);
                if (!isValid) {
                    throw new Error('Invalid email or password');
                }

                // Update last login time
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() },
                });

                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    cnaId: user.cnaId,
                    cnaName: user.cna?.name,
                    mustChangePassword: user.mustChangePassword,
                    isMasterLogin: false,
                };
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
