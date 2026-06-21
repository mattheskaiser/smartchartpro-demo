'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useChartingStore } from '@/stores/chartingStore';
import { useFacilityStore } from '@/stores/facilityStore';
import { QueryProvider } from '@/providers/QueryProvider';
import { SessionProvider } from '@/providers/SessionProvider';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { ChartingProgressStepperMolecule } from '@/components/molecules/ChartingProgressStepper.molecule';
import { ChartingUserProfileMolecule } from '@/components/molecules/ChartingUserProfile.molecule';
import { Toaster } from '@/components/ui/sonner';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isChartingActive } = useChartingStore();
  const { loadFromDatabase } = useFacilityStore();

  useEffect(() => {
    loadFromDatabase();
  }, [loadFromDatabase]);

  useEffect(() => {
    if (
      pathname === '/charting/start' ||
      pathname === '/charting/complete' ||
      pathname === '/' ||
      pathname.startsWith('/admin')
    ) {
      return;
    }

    if (!isChartingActive) {
      router.replace('/charting/start');
    }
  }, [isChartingActive, pathname, router]);

  const isAdminRoute = pathname.startsWith('/admin');
  const isChartingRoute = pathname.startsWith('/charting');
  const isLoginRoute = pathname === '/login' || pathname === '/';
  const showHeader = !isAdminRoute && !isChartingRoute;

  const getCurrentStep = () => {
    if (pathname === '/charting/start') return 'start';
    if (pathname === '/charting/adls') return 'charting';
    if (pathname === '/charting/review') return 'review';
    return 'start';
  };

  return (
    <SessionProvider>
      <QueryProvider>
        <Toaster />
        {isAdminRoute ? (
          children
        ) : isChartingRoute ? (
          <div className="h-screen flex flex-col overflow-hidden">
            <header className="flex-shrink-0 w-full bg-white border-b border-gray-200 shadow-sm min-h-[88px]">
              <div className="max-w-7xl mx-auto px-6 py-4 h-full">
                <div className="hidden lg:flex items-center justify-between h-full">
                  <div className="flex items-center space-x-3 w-64">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <DynamicIconAtom name="Hospital" size="md" className="text-primary" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900">
                        Sunrise Senior Living
                      </h1>
                      <p className="text-xs text-gray-500">Care Documentation</p>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-center">
                    <ChartingProgressStepperMolecule currentStep={getCurrentStep()} />
                  </div>

                  <div className="w-64 flex justify-end">
                    <ChartingUserProfileMolecule />
                  </div>
                </div>

                <div className="lg:hidden space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                        <DynamicIconAtom name="Hospital" size="md" className="text-primary" />
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                          Sunrise Senior Living
                        </h1>
                        <p className="text-xs text-gray-500">Care Documentation</p>
                      </div>
                    </div>

                    <ChartingUserProfileMolecule />
                  </div>

                  <div className="flex justify-center pt-2">
                    <ChartingProgressStepperMolecule currentStep={getCurrentStep()} />
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 bg-gray-50 overflow-y-auto">{children}</main>
          </div>
        ) : isLoginRoute ? (
          <div className="h-screen flex flex-col overflow-hidden">
            <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm min-h-[88px]">
              <div className="max-w-7xl mx-auto px-6 py-4 h-full">
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                      <DynamicIconAtom name="Hospital" size="sm" className="text-primary" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900">SmartChart Pro</h1>
                      <p className="text-xs text-gray-500">Resident Care Documentation</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        ) : (
          <div className="min-h-screen bg-gray-50">
            {showHeader && (
              <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                        <DynamicIconAtom name="Hospital" size="sm" className="text-primary" />
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold text-gray-900">SmartChart Pro</h1>
                        <p className="text-xs text-gray-500">Resident Care Documentation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
            )}
            <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
          </div>
        )}
      </QueryProvider>
    </SessionProvider>
  );
}
