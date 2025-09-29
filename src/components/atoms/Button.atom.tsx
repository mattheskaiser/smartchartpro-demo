'use client';

import { clsx } from 'clsx';
import React from 'react';

interface ButtonAtomProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  children: React.ReactNode;
}

export const ButtonAtom = ({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  children,
  className,
  ...props
}: ButtonAtomProps) => {
  return (
    <button
      className={clsx(
        'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500':
            variant === 'secondary',
          'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500':
            variant === 'outline',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
          'w-full': isFullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
