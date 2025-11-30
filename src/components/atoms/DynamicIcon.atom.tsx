import React from 'react';
import { icons } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconAtomProps {
  name: keyof typeof icons;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
};

export const DynamicIconAtom = ({ name, size = 'md', className }: IconAtomProps) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return <LucideIcon size={iconSizes[size]} className={cn(className)} />;
};
