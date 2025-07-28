import { ReactNode } from 'react';
import { AdminSidebarMolecule } from '@/components/molecules/AdminSidebar.molecule';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row bg-gray-100 rounded-2xl border border-gray-200">
      <AdminSidebarMolecule />
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
