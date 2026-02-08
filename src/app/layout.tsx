'use client';

import { Inter } from 'next/font/google';
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
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isChartingActive } = useChartingStore();
  const { loadFromDatabase } = useFacilityStore();

  // Load facility settings from database on mount
  useEffect(() => {
    loadFromDatabase();
  }, [loadFromDatabase]);

  // Basic route protection
  useEffect(() => {
    // Allow access to /charting/start, /charting/complete, /, and all /admin routes without active charting
    if (
      pathname === '/charting/start' ||
      pathname === '/charting/complete' ||
      pathname === '/' ||
      pathname.startsWith('/admin')
    ) {
      return;
    }

    // Redirect to /charting/start if trying to access protected routes without active charting
    if (!isChartingActive) {
      router.replace('/charting/start');
    }
  }, [isChartingActive, pathname, router]);

  const isAdminRoute = pathname.startsWith('/admin');
  const isChartingRoute = pathname.startsWith('/charting');
  const isLoginRoute = pathname === '/login' || pathname === '/';
  const showHeader = !isAdminRoute && !isChartingRoute;

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
        <SessionProvider>
          <QueryProvider>
            <Toaster />
            {isAdminRoute ? (
              // Admin routes use their own fullscreen layout
              children
            ) : isChartingRoute ? (
              // Charting routes with sticky header and controlled scrolling
              <div className="h-screen flex flex-col overflow-hidden">
                <header className="flex-shrink-0 w-full bg-white border-b border-gray-200 shadow-sm min-h-[88px]">
                  <div className="max-w-7xl mx-auto px-6 py-4 h-full">
                    {/* Desktop: Single row with 3 columns */}
                    <div className="hidden lg:flex items-center justify-between h-full">
                      {/* Left: Company Logo */}
                      <div className="flex items-center space-x-3 w-64">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                          <DynamicIconAtom name="Hospital" size="md" className="text-primary" />
                        </div>
                        <div>
                          <h1 className="text-lg font-semibold text-gray-900">Sunrise Senior Living</h1>
                          <p className="text-xs text-gray-500">Care Documentation</p>
                        </div>
                      </div>

                      {/* Center: Progress Stepper */}
                      <div className="flex-1 flex justify-center">
                        <ChartingProgressStepperMolecule currentStep={getCurrentStep()} />
                      </div>

                      {/* Right: User Profile */}
                      <div className="w-64 flex justify-end">
                        <ChartingUserProfileMolecule />
                      </div>
                    </div>

                    {/* iPad/Mobile: Two rows with more space between them */}
                    <div className="lg:hidden space-y-8">
                      {/* Top row: Company name left, user profile right */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                            <DynamicIconAtom name="Hospital" size="md" className="text-primary" />
                          </div>
                          <div>
                            <h1 className="text-lg font-semibold text-gray-900">Sunrise Senior Living</h1>
                            <p className="text-xs text-gray-500">Care Documentation</p>
                          </div>
                        </div>

                        <ChartingUserProfileMolecule />
                      </div>

                      {/* Bottom row: Centered stepper with more space above */}
                      <div className="flex justify-center pt-2">
                        <ChartingProgressStepperMolecule currentStep={getCurrentStep()} />
                      </div>
                    </div>
                  </div>
                </header>
                <main className="flex-1 bg-gray-50 overflow-y-auto">{children}</main>
              </div>
            ) : isLoginRoute ? (
              // Login page - header + centered content with no scroll
              <div className="h-screen flex flex-col overflow-hidden">
                <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm min-h-[88px]">
                  <div className="max-w-7xl mx-auto px-6 py-4 h-full">
                    <div className="flex items-center justify-center h-full">
                      {/* SmartChart Pro Logo */}
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
              // Other routes
              <div className="min-h-screen bg-gray-50">
                {showHeader && (
                  <header className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                      <div className="flex items-center justify-center">
                        {/* SmartChart Pro Logo */}
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
      </body>
    </html>
  );
}
