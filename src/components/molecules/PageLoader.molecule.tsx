/**
 * PageLoader - Unified loading component for all pages
 *
 * Usage:
 * <PageLoader message="Loading..." /> - With message
 *
 * Note: Automatically adjusts for sidebar (256px) in admin pages
 * Charting pages have no sidebar, so spinner is centered normally
 */

'use client';

import { usePathname } from 'next/navigation';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { TextAtom } from '@/components/atoms/Text.atom';

interface PageLoaderProps {
  message: string;
}

export function PageLoaderMolecule({ message }: PageLoaderProps) {
  const pathname = usePathname();
  const isChartingRoute = pathname?.startsWith('/charting');

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ marginLeft: isChartingRoute ? '0' : '128px' }}
    >
      <div className="flex flex-col items-center space-y-3">
        <DynamicIconAtom name="Loader" size="md" className="animate-spin text-primary" />
        <TextAtom className="text-gray-600 text-sm">{message}</TextAtom>
      </div>
    </div>
  );
}
