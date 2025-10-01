'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonAtomProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isFullWidth?: boolean;
  children: React.ReactNode;
  asChild?: boolean;
}

export const ButtonAtom = ({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  children,
  className,
  asChild,
  ...props
}: ButtonAtomProps) => {
  // Map our sizes to Shadcn sizes
  const shadcnSize = size === 'md' ? 'default' : size;

  // Custom color classes that override Shadcn defaults
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 bg-transparent',
    ghost: 'text-gray-600 hover:bg-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  return (
    <Button
      variant="ghost" // Use ghost as base to avoid Shadcn colors
      size={shadcnSize}
      className={cn(
        // Override with our custom colors
        variantClasses[variant],
        'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        isFullWidth && 'w-full',
        className
      )}
      asChild={asChild}
      {...props}
    >
      {children}
    </Button>
  );
};
