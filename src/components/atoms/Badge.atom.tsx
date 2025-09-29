import { clsx } from 'clsx';
import React from 'react';

interface BadgeAtomProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
}

export const BadgeAtom = ({ variant = 'info', children, className }: BadgeAtomProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium',
        {
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'error',
          'bg-blue-100 text-blue-800': variant === 'info',
        },
        className
      )}
    >
      {children}
    </span>
  );
};
