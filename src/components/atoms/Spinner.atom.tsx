import React from 'react';
import { DynamicIconAtom } from './DynamicIcon.atom';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SpinnerAtom = ({ size = 'md', className = '' }: SpinnerProps) => {
  return (
    <DynamicIconAtom
      name="Loader"
      size={size}
      className={`animate-spin text-primary ${className}`}
    />
  );
};
