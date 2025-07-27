'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useShiftStore } from '@/stores/shiftStore';

export default function ShiftLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isShiftActive, selectedResidents } = useShiftStore();

  // Basic route protection
  useEffect(() => {
    if (!isShiftActive && pathname !== '/shift/start') {
      router.replace('/shift/start');
    }
  }, [isShiftActive, pathname, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shift Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {pathname === '/shift/start'
              ? 'Start Shift'
              : pathname === '/shift/chart'
                ? 'Chart ADLs'
                : 'Review Shift'}
          </h1>
          {isShiftActive && (
            <div className="text-sm text-gray-500">
              {selectedResidents.length} residents selected
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
