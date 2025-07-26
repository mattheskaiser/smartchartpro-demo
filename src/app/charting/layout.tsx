'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useChartingStore } from '@/stores/chartingStore';

export default function ChartingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isChartingActive, selectedResidents } = useChartingStore();

  // Basic route protection
  useEffect(() => {
    if (!isChartingActive && pathname !== '/charting/start') {
      router.replace('/charting/start');
    }
  }, [isChartingActive, pathname, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Charting Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {pathname === '/charting/start'
              ? 'Start Charting'
              : pathname === '/charting/chart'
              ? 'Chart ADLs'
              : 'Review Charting'}
          </h1>
          {isChartingActive && (
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