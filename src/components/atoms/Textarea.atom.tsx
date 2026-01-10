'use client';

import { clsx } from 'clsx';
import React from 'react';

interface TextareaAtomProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextareaAtom = ({ className, error, ...props }: TextareaAtomProps) => {
  return (
    <textarea
      className={clsx(
        'w-full px-3 py-2 border rounded-md focus:outline-none transition-colors resize-vertical',
        error
          ? 'border-red-300 focus:border-red-500'
          : 'border-gray-300 focus:border-blue-500',
        className
      )}
      {...props}
    />
  );
};
