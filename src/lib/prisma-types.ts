/**
 * Prisma Types Export
 *
 * This file provides Prisma-compatible types for demo mode.
 * In production, import directly from '@prisma/client'.
 */

// Define Prisma-compatible types for demo mode
export namespace Prisma {
  export type StringFilter = {
    contains?: string;
    mode?: 'default' | 'insensitive';
    equals?: string;
    startsWith?: string;
    endsWith?: string;
  };

  export type CnaRelation = {
    id?: string;
    name?: string | StringFilter;
    email?: string;
    status?: string;
  };

  export type UserWhereInput = {
    id?: string;
    email?: string | StringFilter;
    role?: 'ADMIN' | 'CNA';
    isActive?: boolean;
    cna?: CnaRelation;
    OR?: UserWhereInput[];
  };

  export type ResidentWhereInput = {
    id?: string;
    name?: string | StringFilter;
    room?: string | StringFilter;
    status?: string;
    assignedCNA?: string;
    OR?: ResidentWhereInput[];
  };

  export type DateFilter = {
    gte?: Date | string;
    lte?: Date | string;
    gt?: Date | string;
    lt?: Date | string;
  };

  export type ChartingReportWhereInput = {
    id?: string;
    cnaId?: string;
    status?: string;
    reportDate?: Date | string | DateFilter;
  };

  export type ChartingReportUpdateInput = {
    status?: string;
    reviewedBy?: string | null;
    reviewedAt?: Date | string | null;
    notes?: string | null;
  };
}
