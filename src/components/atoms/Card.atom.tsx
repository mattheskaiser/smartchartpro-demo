'use client';

import { clsx } from 'clsx';
import React from 'react';

interface CardAtomProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardAtom = ({ 
  children, 
  className, 
  padding = 'md',
  ...props 
}: CardAtomProps) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow',
        {
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};