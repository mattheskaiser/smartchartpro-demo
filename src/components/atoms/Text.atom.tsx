'use client';

import { clsx } from 'clsx';
import React from 'react';

interface TextAtomProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';
  color?: 'primary' | 'secondary' | 'muted' | 'error' | 'success';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const TextAtom = ({
  variant = 'body',
  color = 'primary',
  weight = 'normal',
  className,
  children,
  as,
  ...props
}: TextAtomProps) => {
  const Component = as || getDefaultElement(variant);

  return (
    <Component
      className={clsx(
        {
          'text-2xl': variant === 'h1',
          'text-xl': variant === 'h2',
          'text-lg': variant === 'h3',
          'text-base': variant === 'body',
          'text-sm': variant === 'small',
          'text-xs': variant === 'caption',
          'text-gray-900': color === 'primary',
          'text-gray-600': color === 'secondary',
          'text-gray-500': color === 'muted',
          'text-red-600': color === 'error',
          'text-green-600': color === 'success',
          'font-normal': weight === 'normal',
          'font-medium': weight === 'medium',
          'font-semibold': weight === 'semibold',
          'font-bold': weight === 'bold',
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

function getDefaultElement(variant: string) {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    default:
      return 'p';
  }
}