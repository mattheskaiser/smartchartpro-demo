'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChartingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the start sub-route
    router.replace('/charting/start');
  }, [router]);

  return null;
}