'use client';

import { Inter } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useChartingStore } from '@/stores/chartingStore';
import { QueryProvider } from '@/providers/QueryProvider';
import { ChartingProgressStepperMolecule } from '@/components/molecules/ChartingProgressStepper.molecule';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isChartingActive, selectedResidents } = useChartingStore();

  // Basic route protection
  useEffect(() => {
    // Allow access to /start, /, and all /admin routes without active charting
    if (pathname === '/start' || pathname === '/' || pathname.startsWith('/admin')) {
      return;
    }

    // Redirect to /start if trying to access protected routes without active charting
    if (!isChartingActive) {
      router.replace('/start');
    }
  }, [isChartingActive, pathname, router]);

  // Don't show header on start page or admin pages (admin has its own layout)
  const showHeader = pathname !== '/start' && pathname !== '/' && !pathname.startsWith('/admin');
  const isAdminRoute = pathname.startsWith('/admin');
  const isChartingRoute = pathname.startsWith('/charting');

  // Determine current step for progress stepper
  const getCurrentStep = () => {
    if (pathname === '/charting/start') return 'start';
    if (pathname === '/charting/adls') return 'charting';
    if (pathname === '/charting/review') return 'review';
    return 'start';
  };

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <QueryProvider>
          {isAdminRoute ? (
            // Admin routes use their own fullscreen layout
            children
          ) : (
            <div className="min-h-screen bg-gray-50">
              {showHeader && (
                <header className="bg-white border-b border-gray-200 shadow-sm">
                  <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                      {/* Left: SmartChart Pro */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                          <DynamicIconAtom name="Hospital" size="sm" className="text-primary" />
                        </div>
                        <div>
                          <h1 className="text-lg font-semibold text-gray-900">
                            SmartChart Pro
                          </h1>
                          <p className="text-xs text-gray-500">
                            Resident Care Documentation
                          </p>
                        </div>
                      </div>

                      {/* Center: Progress Stepper (only on charting routes) */}
                      {isChartingRoute && (
                        <div className="flex-1 flex justify-center">
                          <ChartingProgressStepperMolecule currentStep={getCurrentStep()} />
                        </div>
                      )}

                      {/* Right: Resident Count */}
                      <div className="flex items-center space-x-4">
                        {isChartingActive && selectedResidents.length > 0 && (
                          <>
                            <div className="flex items-center space-x-2">
                              <DynamicIconAtom name="Users" size="sm" className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {selectedResidents.length} resident{selectedResidents.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <BadgeAtom variant="success">
                              Active Session
                            </BadgeAtom>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </header>
              )}
              <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
            </div>
          )}
        </QueryProvider>
      </body>
    </html>
  );
}
