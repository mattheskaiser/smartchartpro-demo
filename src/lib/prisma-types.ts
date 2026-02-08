/**
 * Prisma Types Export
 *
 * This file provides Prisma-compatible types for demo mode.
 * In production, import directly from '@prisma/client'.
 */

// Define Prisma-compatible types for demo mode
export namespace Prisma {
  export type UserWhereInput = {
    id?: string;
    email?: string;
    role?: 'ADMIN' | 'CNA';
    isActive?: boolean;
    cna?: any;
    OR?: any[];
  };

  export type ResidentWhereInput = {
    id?: string;
    status?: string;
    assignedCNA?: string;
    OR?: any[];
  };

  export type ChartingReportWhereInput = {
    id?: string;
    cnaId?: string;
    status?: string;
    reportDate?: any;
  };

  export type ChartingReportUpdateInput = {
    status?: string;
    reviewedBy?: string | null;
    reviewedAt?: Date | string | null;
    notes?: string | null;
  };
}
