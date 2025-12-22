'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SpinnerAtom } from '@/components/atoms/Spinner.atom';

interface ButtonAtomProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'delete';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isFullWidth?: boolean;
  children: React.ReactNode;
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export const ButtonAtom = ({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  children,
  className,
  asChild,
  isLoading = false,
  loadingText,
  disabled,
  ...props
}: ButtonAtomProps) => {
  // Map our sizes to Shadcn sizes
  const shadcnSize = size === 'md' ? 'default' : size;

  // Custom color classes that override Shadcn defaults
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500',
    outline:
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 bg-transparent',
    ghost: 'text-gray-600 hover:bg-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    delete: 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500 border border-red-200',
  };

  // Determine spinner size based on button size
  const spinnerSize = size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm';

  return (
    <Button
      variant="ghost" // Use ghost as base to avoid Shadcn colors
      size={shadcnSize}
      className={cn(
        // Override with our custom colors
        variantClasses[variant],
        'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        isFullWidth && 'w-full',
        isLoading && 'cursor-not-allowed opacity-90',
        className
      )}
      asChild={asChild}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <SpinnerAtom size={spinnerSize} className="text-white" />
          <span>{loadingText || 'Loading...'}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
