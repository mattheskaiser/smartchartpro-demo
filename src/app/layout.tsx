'use client';

import { Inter } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useChartingStore } from '@/stores/chartingStore';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isChartingActive, selectedResidents } = useChartingStore();

  // Basic route protection
  useEffect(() => {
    // Allow access to /start and / without active charting
    if (pathname === '/start' || pathname === '/') {
      return;
    }

    // Redirect to /start if trying to access protected routes without active charting
    if (!isChartingActive) {
      router.replace('/start');
    }
  }, [isChartingActive, pathname, router]);

  // Don't show header on start page
  const showHeader = pathname !== '/start' && pathname !== '/';

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="min-h-screen bg-gray-50">
          {showHeader && (
            <header className="bg-white border-b border-gray-200 px-4 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">
                  {pathname === '/charting'
                    ? 'Chart ADLs'
                    : pathname === '/review'
                    ? 'Review Charting'
                    : 'SmartChart Pro'}
                </h1>
                {isChartingActive && (
                  <div className="text-sm text-gray-500">
                    {selectedResidents.length} residents selected
                  </div>
                )}
              </div>
            </header>
          )}

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
