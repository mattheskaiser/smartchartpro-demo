import React from 'react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { cn } from '@/lib/utils';

interface IconAtomProps {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconSizes = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const DynamicIconAtom = ({ name, size = 'md', className }: IconAtomProps) => {
  return <DynamicIcon name={name} size={iconSizes[size]} className={cn('', className)} />;
};
