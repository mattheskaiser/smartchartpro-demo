'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useChartingStore } from '@/stores/chartingStore';

export default function ChartingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isChartingActive } = useChartingStore();

  // Basic route protection
  useEffect(() => {
    if (!isChartingActive && pathname !== '/charting/start') {
      router.replace('/charting/start');
    }
  }, [isChartingActive, pathname, router]);

  return (
    <div className="transition-all duration-300 ease-in-out">
      <div key={pathname} className="animate-in fade-in-0 slide-in-from-right-1 duration-300">
        {children}
      </div>
    </div>
  );
}
