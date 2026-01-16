import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'CNA';
      cnaId: string | null;
      cnaName?: string;
      mustChangePassword: boolean;
      isMasterLogin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'CNA';
    cnaId: string | null;
    cnaName?: string;
    mustChangePassword: boolean;
    isMasterLogin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'CNA';
    cnaId: string | null;
    cnaName?: string;
    mustChangePassword: boolean;
    isMasterLogin: boolean;
  }
}
