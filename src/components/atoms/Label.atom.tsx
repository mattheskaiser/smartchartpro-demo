'use client';

import { clsx } from 'clsx';
import React from 'react';

interface LabelAtomProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

export const LabelAtom = ({ required, children, className, ...props }: LabelAtomProps) => {
  return (
    <label className={clsx('block text-sm font-medium text-gray-700 mb-1', className)} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};
