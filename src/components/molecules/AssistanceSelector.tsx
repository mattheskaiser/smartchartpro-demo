'use client';

import React from 'react';
import { Button } from '../atoms/Button';
import { clsx } from 'clsx';

interface AssistanceSelectorProps {
  value?: 'independent' | 'partial' | 'full';
  onChange?: (value: 'independent' | 'partial' | 'full') => void;
  className?: string;
}

const options = [
  { value: 'independent', label: 'Independent' },
  { value: 'partial', label: 'Partial Assist' },
  { value: 'full', label: 'Full Assist' },
] as const;

export const AssistanceSelector = ({
  value,
  onChange,
  className,
}: AssistanceSelectorProps) => {
  return (
    <div
      className={clsx(
        'inline-flex rounded-lg border border-gray-200 bg-white p-1',
        className
      )}
    >
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? 'primary' : 'secondary'}
          size="sm"
          className={clsx('flex-1 whitespace-nowrap', {
            'shadow-sm': value === option.value,
          })}
          onClick={() => onChange?.(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}; 