import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface DashboardCardProps {
    children: ReactNode;
    className?: string;
}

/**
 * DashboardCard - Matches the exact styling used in the dashboard
 * Uses: overflow-hidden rounded-lg bg-white shadow with p-6 inner padding
 */
export function DashboardCardAtom({ children, className }: DashboardCardProps) {
    return (
        <div className={clsx('overflow-hidden rounded-lg bg-white shadow', className)}>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}