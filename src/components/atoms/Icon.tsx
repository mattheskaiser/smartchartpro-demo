import {
  SparklesIcon,
  UserIcon,
  HomeIcon,
  HeartIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import React from 'react';

type IconType = 'bathing' | 'dressing' | 'eating' | 'toileting' | 'mobility' | 'health';

interface IconProps {
  type: IconType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconComponents = {
  bathing: SparklesIcon,
  dressing: UserIcon, // Using UserIcon as a fallback for clothing
  eating: UserIcon,
  toileting: HomeIcon,
  mobility: ArrowPathIcon,
  health: HeartIcon,
};

const iconSizes = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const Icon = ({ type, size = 'md', className }: IconProps) => {
  const IconComponent = iconComponents[type];
  return (
    <IconComponent
      className={clsx(iconSizes[size], 'stroke-current', className)}
      aria-hidden="true"
    />
  );
}; 