'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { toast } from '@/lib/toast';
import { isDemoMode, getDemoMessage } from '@/lib/demo-config';

export default function ChartingCompletePage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Show demo mode warning toast
        if (isDemoMode()) {
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
    }, [router]);

    return (
        <div className="h-full flex items-center justify-center p-6">
            <CardAtom className="max-w-md text-center">
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                        <DynamicIconAtom name="Check" size="xl" className="text-green-600" />
                    </div>
                    <TextAtom variant="h1" className="text-gray-900 mb-2">
                        You're All Done! 🎉
                    </TextAtom>
                    <TextAtom className="text-gray-600 mb-4">
                        Great work today! Your shift is complete.
                    </TextAtom>
                    <TextAtom variant="small" className="text-gray-500">
                        Enjoy the rest of your day!
                    </TextAtom>
                </div>

                <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <DynamicIconAtom name="Loader" size="sm" className="animate-spin" />
                        <TextAtom variant="small">
                            Redirecting to login in <span className="font-semibold text-primary">{countdown}</span>...
                        </TextAtom>
                    </div>
                </div>
            </CardAtom>
        </div>
    );
}
