'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StartRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the new charting start route
        router.replace('/charting/start');
    }, [router]);

    return null;
}