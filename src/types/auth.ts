import { Role } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  role: Role;
  cnaId: string | null;
  cnaName?: string;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'CNA';
  cnaId: string | null;
  cnaName?: string;
  mustChangePassword: boolean;
  isMasterLogin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  masterPassword?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
