import { mockPrisma } from './mock-db';
import { DEMO_CONFIG } from './demo-config';
import type { PrismaClient } from '@prisma/client';

// In demo mode, always use mock client (no Prisma needed)
export const prisma = DEMO_CONFIG.enabled
  ? (mockPrisma as unknown as PrismaClient)
  : (() => {
      // Only import real Prisma in production
      try {
        const { PrismaClient } = require('@prisma/client');
        const globalForPrisma = globalThis as unknown as {
          prisma: PrismaClient | undefined;
        };

        const client =
          globalForPrisma.prisma ??
          new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
          });

        globalForPrisma.prisma = client;

        // Handle graceful shutdown
        if (typeof window === 'undefined') {
          process.on('SIGINT', async () => {
            await client.$disconnect();
            process.exit(0);
          });

          process.on('SIGTERM', async () => {
            await client.$disconnect();
            process.exit(0);
          });
        }

        return client;
      } catch (error) {
        console.error(
          'Prisma Client not available. Make sure to run "prisma generate" in production mode.'
        );
        throw error;
      }
    })();
