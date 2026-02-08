'use client';

import { usePathname } from 'next/navigation';

export default function ChartingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-in fade-in-from-right-1 duration-300">
      {children}
    </div>
  );
}
