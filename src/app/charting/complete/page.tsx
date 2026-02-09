'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useChartingStore } from '@/stores/chartingStore';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { toast } from '@/lib/toast';
import { isDemoMode, getDemoMessage } from '@/lib/demo-config';

export default function ChartingCompletePage() {
  const router = useRouter();
  const { endCharting } = useChartingStore();
  const [countdown, setCountdown] = useState(5);
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Clear the charting session
    endCharting();

    // Show demo mode warning toast only once using ref
    if (isDemoMode() && !hasShownToast.current) {
      hasShownToast.current = true;
      toast({
        title: 'Changes Not Saved',
        description: getDemoMessage('actionNotPersisted'),
        type: 'warning',
      });
    }

    // Start countdown
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Sign out and redirect to login
          signOut({ callbackUrl: '/login' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [endCharting, router]);

  return (
    <div
      className="h-screen flex items-center justify-center bg-gray-50"
      style={{ marginTop: '-88px' }}
    >
      <CardAtom className="max-w-lg w-full text-center p-12">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6">
            <DynamicIconAtom name="Check" size="lg" className="text-primary" />
          </div>
          <TextAtom variant="h1" className="text-gray-900 mb-4">
            You're All Done!
          </TextAtom>
          <TextAtom className="text-gray-600 text-lg mb-2">
            Great work today! Your shift is complete.
          </TextAtom>
          <TextAtom className="text-gray-500">Enjoy the rest of your day!</TextAtom>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <DynamicIconAtom name="Loader" size="sm" className="animate-spin text-primary" />
            <TextAtom variant="small">
              Redirecting to login in{' '}
              <span className="font-semibold text-primary">{countdown}</span>...
            </TextAtom>
          </div>
        </div>
      </CardAtom>
    </div>
  );
}
