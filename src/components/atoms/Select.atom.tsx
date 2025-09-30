'use client';

import { clsx } from 'clsx';
import React from 'react';

interface SelectAtomProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  error?: boolean;
}

export const SelectAtom = ({ 
  children, 
  className, 
  error,
  ...props 
}: SelectAtomProps) => {
  return (
    <select
      className={clsx(
        'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-offset-2 focus:outline-none transition-colors',
        error 
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};