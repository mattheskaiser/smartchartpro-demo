'use client';

import { clsx } from 'clsx';
import React from 'react';

interface SelectAtomProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  error?: boolean;
}

export const SelectAtom = ({ children, className, error, ...props }: SelectAtomProps) => {
  return (
    <select
      className={clsx(
        // Match Shadcn Input styling exactly - including responsive text sizing
        'flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        // Error state styling
        error
          ? 'border-red-300 focus-visible:ring-red-500'
          : 'border-gray-300 focus-visible:ring-blue-500',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};
