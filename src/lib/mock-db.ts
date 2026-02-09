/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Mock Database Client for Demo Mode
 *
 * This replaces Prisma Client when running in demo mode.
 * It provides the same interface but uses mock data from JSON files.
 */

import {
  mockResidents,
  mockCnas,
  mockUsers,
  mockSettings,
  mockSessions,
  mockShiftTemplates,
  mockShiftAssignments,
  mockChartingReports,
  simulateDelay,
  findById,
} from './mock-data';

// In-memory storage for demo session (resets on page refresh)
let demoSessionStorage = {
  sessions: [...mockSessions],
  reports: [...mockChartingReports],
  residents: [...mockResidents],
  cnas: [...mockCnas],
  users: [...mockUsers],
  shiftAssignments: [...mockShiftAssignments],
};

/**
 * Mock Prisma Client
 * Mimics the Prisma Client API but uses mock data
 */
export const mockPrisma = {
  // Resident operations
  resident: {
    findMany: async (params?: any) => {
      await simulateDelay();
      let results = [...demoSessionStorage.residents];

      // Apply filters
      if (params?.where) {
        if (params.where.status) {
          results = results.filter(r => r.status === params.where.status);
        }
        if (params.where.assignedCNA) {
          results = results.filter(r => r.assignedCNA === params.where.assignedCNA);
        }
      }

      // Apply sorting
      if (params?.orderBy) {
        const field = Object.keys(params.orderBy)[0];
        const direction = params.orderBy[field];
        results.sort((a: any, b: any) => {
          if (direction === 'asc') {
            return a[field] > b[field] ? 1 : -1;
          }
          return a[field] < b[field] ? 1 : -1;
        });
      }

      // Apply pagination
      if (params?.skip !== undefined || params?.take !== undefined) {
        const skip = params.skip || 0;
        const take = params.take || results.length;
        results = results.slice(skip, skip + take);
      }

      return results;
    },

    findUnique: async (params: any) => {
      await simulateDelay();
      return findById(demoSessionStorage.residents, params.where.id) || null;
    },

    findFirst: async (params: any) => {
      await simulateDelay();
      return (
        demoSessionStorage.residents.find((r: any) => {
          if (params.where.id) return r.id === params.where.id;
          return true;
        }) || null
      );
    },

    create: async (params: any) => {
      await simulateDelay();
      const newResident = {
        id: `res_${Date.now()}`,
        ...params.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      demoSessionStorage.residents.push(newResident);
      return newResident;
    },

    update: async (params: any) => {
      await simulateDelay();
      const index = demoSessionStorage.residents.findIndex(r => r.id === params.where.id);
      if (index !== -1) {
        demoSessionStorage.residents[index] = {
          ...demoSessionStorage.residents[index],
          ...params.data,
          updatedAt: new Date().toISOString(),
        };
        return demoSessionStorage.residents[index];
      }
      throw new Error('Resident not found');
    },

    delete: async (params: any) => {
      await simulateDelay();
      const index = demoSessionStorage.residents.findIndex(r => r.id === params.where.id);
      if (index !== -1) {
        const deleted = demoSessionStorage.residents[index];
        demoSessionStorage.residents.splice(index, 1);
        return deleted;
      }
      throw new Error('Resident not found');
    },

    count: async (params?: any) => {
      await simulateDelay();
      let results = [...demoSessionStorage.residents];
      if (params?.where) {
        if (params.where.status) {
          results = results.filter(r => r.status === params.where.status);
        }
      }
      return results.length;
    },
  },

  // CNA operations
  cna: {
    findMany: async (params?: any) => {
      await simulateDelay();
      let results = [...demoSessionStorage.cnas];

      if (params?.where?.status) {
        results = results.filter(c => c.status === params.where.status);
      }

      return results;
    },

    findUnique: async (params: any) => {
      await simulateDelay();
      return findById(demoSessionStorage.cnas, params.where.id) || null;
    },

    create: async (params: any) => {
      await simulateDelay();
      const newCna = {
        id: `cna_${Date.now()}`,
        ...params.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      demoSessionStorage.cnas.push(newCna);
      return newCna;
    },

    update: async (params: any) => {
      await simulateDelay();
      const index = demoSessionStorage.cnas.findIndex(c => c.id === params.where.id);
      if (index !== -1) {
        demoSessionStorage.cnas[index] = {
          ...demoSessionStorage.cnas[index],
          ...params.data,
          updatedAt: new Date().toISOString(),
        };
        return demoSessionStorage.cnas[index];
      }
      throw new Error('CNA not found');
    },

    delete: async (params: any) => {
      await simulateDelay();
      const index = demoSessionStorage.cnas.findIndex(c => c.id === params.where.id);
      if (index !== -1) {
        const deleted = demoSessionStorage.cnas[index];
        demoSessionStorage.cnas.splice(index, 1);
        return deleted;
      }
      throw new Error('CNA not found');
    },
  },

  // User operations
  user: {
    findMany: async (params?: any) => {
      await simulateDelay();
      let results = [...demoSessionStorage.users];

      if (params?.where) {
        if (params.where.role) results = results.filter(u => u.role === params.where.role);
        if (params.where.isActive !== undefined)
          results = results.filter(u => u.isActive === params.where.isActive);
      }

      return results;
    },

    findUnique: async (params: any) => {
      await simulateDelay();
      if (params.where.id) {
        return findById(demoSessionStorage.users, params.where.id) || null;
      }
      if (params.where.email) {
        return demoSessionStorage.users.find(u => u.email === params.where.email) || null;
      }
      return null;
    },

    create: async (params: any) => {
      await simulateDelay();
      const newUser = {
        id: `user_${Date.now()}`,
        ...params.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      demoSessionStorage.users.push(newUser);
      return newUser;
    },

    update: async (params: any) => {
      await simulateDelay();
      const index = demoSessionStorage.users.findIndex(u => u.id === params.where.id);
      if (index !== -1) {
        demoSessionStorage.users[index] = {
          ...demoSessionStorage.users[index],
          ...params.data,
          updatedAt: new Date().toISOString(),
        };
        return demoSessionStorage.users[index];
      }
      throw new Error('User not found');
    },
  },

  // Charting Session operations
  chartingSession: {
    findMany: async (params?: any) => {
      await simulateDelay();
      let results = [...demoSessionStorage.sessions];

      if (params?.where) {
        if (params.where.userId) results = results.filter(s => s.userId === params.where.userId);
        if (params.where.cnaId) results = results.filter(s => s.cnaId === params.where.cnaId);
        if (params.where.isActive !== undefined)
          results = results.filter(s => s.isActive === params.where.isActive);
      }

      return results;
    },

    findUnique: async (params: any) => {
      await simulateDelay();
      const session = findById(demoSessionStorage.sessions, params.where.id);

      // Handle includes if specified
      if (session && params?.include) {
        const result: any = { ...session };

        if (params.include.cna) {
          result.cna = demoSessionStorage.cnas.find(c => c.id === session.cnaId) || null;
        }

        if (params.include.user) {
          result.user = demoSessionStorage.users.find(u => u.id === session.userId) || null;
        }

        return result;
      }

      return session || null;
    },

    findFirst: async (params: any) => {
      await simulateDelay();
      return (
        demoSessionStorage.sessions.find((s: any) => {
          if (params.where.userId && s.userId !== params.where.userId) return false;
          if (params.where.isActive !== undefined && s.isActive !== params.where.isActive)
            return false;
          return true;
        }) || null
      );
    },

    create: async (params: any) => {
      await simulateDelay();
      const newSession = {
        id: `session_${Date.now()}`,
        ...params.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      demoSessionStorage.sessions.push(newSession);
      return newSession;
    },

    update: async (params: any) => {
      await simulateDelay();
      const index = demoSessionStorage.sessions.findIndex(s => s.id === params.where.id);
      if (index !== -1) {
        demoSessionStorage.sessions[index] = {
          ...demoSessionStorage.sessions[index],
          ...params.data,
          updatedAt: new Date().toISOString(),
        };
        return demoSessionStorage.sessions[index];
      }
      throw new Error('Session not found');
    },
  },

  // Charting Report operations
  chartingReport: {
    findMany: async (params?: any) => {
      await simulateDelay();
      let results = [...demoSessionStorage.reports];

      if (params?.where) {
        if (params.where.cnaId) results = results.filter(r => r.cnaId === params.where.cnaId);
        if (params.where.status) results = results.filter(r => r.status === params.where.status);
      }

      // Apply sorting
      if (params?.orderBy) {
        const field = Object.keys(params.orderBy)[0];
        const direction = params.orderBy[field];
        results.sort((a: any, b: any) => {
          if (direction === 'asc') {
            return a[field] > b[field] ? 1 : -1;
          }
          return a[field] < b[field] ? 1 : -1;
        });
      }

      // Apply pagination
      if (params?.skip !== undefined || params?.take !== undefined) {
        const skip = params.skip || 0;
        const take = params.take || results.length;
        results = results.slice(skip, skip + take);
      }

      return results;
    },

    findUnique: async (params: any) => {
      await simulateDelay();
      return findById(demoSessionStorage.reports, params.where.id) || null;
    },

    create: async (params: any) => {
      await simulateDelay();
      const newReport = {
        id: `report_${Date.now()}`,
        ...params.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      demoSessionStorage.reports.push(newReport);
      return newReport;
    },

    update: async (params: any) => {
      await simulateDelay();
      const index = demoSessionStorage.reports.findIndex(r => r.id === params.where.id);
      if (index !== -1) {
        demoSessionStorage.reports[index] = {
          ...demoSessionStorage.reports[index],
          ...params.data,
          updatedAt: new Date().toISOString(),
        };
        return demoSessionStorage.reports[index];
      }
      throw new Error('Report not found');
    },

    count: async (params?: any) => {
      await simulateDelay();
      let results = [...demoSessionStorage.reports];
      if (params?.where) {
        if (params.where.status) results = results.filter(r => r.status === params.where.status);
      }
      return results.length;
    },
  },

  // Settings operations
  settings: {
    findUnique: async () => {
      await simulateDelay();
      return mockSettings;
    },

    upsert: async (params: any) => {
      await simulateDelay();
      return { ...mockSettings, ...params.update };
    },
  },

  // Shift Template operations
  shiftTemplate: {
    findMany: async (params?: any) => {
      await simulateDelay();
      let results = [...mockShiftTemplates];

      if (params?.where?.isActive !== undefined) {
        results = results.filter(t => t.isActive === params.where.isActive);
      }

      if (params?.orderBy) {
        results.sort((a, b) => a.sortOrder - b.sortOrder);
      }

      return results;
    },

    findUnique: async (params: any) => {
      await simulateDelay();
      return mockShiftTemplates.find(t => t.id === params.where.id) || null;
    },
  },

  // Shift Assignment operations
  shiftAssignment: {
    findMany: async (params?: any) => {
      await simulateDelay();
      let results = [...demoSessionStorage.shiftAssignments];

      if (params?.where) {
        if (params.where.cnaId) results = results.filter(s => s.cnaId === params.where.cnaId);
        if (params.where.status) results = results.filter(s => s.status === params.where.status);
        if (params.where.date) {
          const targetDate = new Date(params.where.date.gte || params.where.date)
            .toISOString()
            .split('T')[0];
          results = results.filter(s => s.date.split('T')[0] === targetDate);
        }
      }

      return results;
    },

    create: async (params: any) => {
      await simulateDelay();
      const newAssignment = {
        id: `assignment_${Date.now()}`,
        ...params.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      demoSessionStorage.shiftAssignments.push(newAssignment);
      return newAssignment;
    },

    update: async (params: any) => {
      await simulateDelay();
      const index = demoSessionStorage.shiftAssignments.findIndex(s => s.id === params.where.id);
      if (index !== -1) {
        demoSessionStorage.shiftAssignments[index] = {
          ...demoSessionStorage.shiftAssignments[index],
          ...params.data,
          updatedAt: new Date().toISOString(),
        };
        return demoSessionStorage.shiftAssignments[index];
      }
      throw new Error('Shift assignment not found');
    },
  },

  // Utility methods
  $disconnect: async () => {
    // No-op for mock client
  },

  $connect: async () => {
    // No-op for mock client
  },
};

// Export type for TypeScript
export type MockPrismaClient = typeof mockPrisma;

// Export Prisma-like types for TypeScript compatibility
export namespace Prisma {
  export type UserWhereInput = {
    id?: string;
    email?: string;
    role?: 'ADMIN' | 'CNA';
    isActive?: boolean;
  };

  export type ResidentWhereInput = {
    id?: string;
    status?: string;
    assignedCNA?: string;
  };

  export type ChartingReportWhereInput = {
    id?: string;
    cnaId?: string;
    status?: string;
  };

  export type ChartingReportUpdateInput = {
    status?: string;
    reviewedBy?: string;
    reviewedAt?: Date | string;
    notes?: string;
  };
}
