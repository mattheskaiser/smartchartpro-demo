'use client';

import { ReactNode } from 'react';
import { AdminSidebarMolecule } from '@/components/molecules/AdminSidebar.molecule';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex bg-gray-50">
      <AdminSidebarMolecule />
      <main className="flex-1 overflow-y-auto ml-64">
        <div className="px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
