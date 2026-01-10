'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useChartingStore } from '@/stores/chartingStore';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';

export default function ChartingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isChartingActive, selectedResidents } = useChartingStore();

  // Basic route protection
  useEffect(() => {
    if (!isChartingActive && pathname !== '/charting/start') {
      router.replace('/charting/start');
    }
  }, [isChartingActive, pathname, router]);

  const getPageTitle = () => {
    switch (pathname) {
      case '/charting/start':
        return 'Start Charting Session';
      case '/charting':
        return 'Chart Activities';
      case '/review':
        return 'Review Entries';
      default:
        return 'Charting';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Charting Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                <DynamicIconAtom name="Hospital" size="sm" className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-gray-500">SmartChart Pro</p>
              </div>
            </div>

            {isChartingActive && selectedResidents.length > 0 && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <DynamicIconAtom name="Users" size="sm" className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {selectedResidents.length} resident{selectedResidents.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <BadgeAtom variant="success">
                  Active Session
                </BadgeAtom>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
