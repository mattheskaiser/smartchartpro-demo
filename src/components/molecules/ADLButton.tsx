'use client';

import React from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { clsx } from 'clsx';

interface ADLButtonProps {
  type: 'bathing' | 'dressing' | 'eating' | 'toileting' | 'mobility' | 'health';
  label?: string;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}

const labelMap = {
  bathing: 'Bathing',
  dressing: 'Dressing',
  eating: 'Eating',
  toileting: 'Toileting',
  mobility: 'Mobility',
  health: 'Health',
};

export const ADLButton = ({
  type,
  label = labelMap[type],
  selected = false,
  className,
  onClick,
}: ADLButtonProps) => {
  return (
    <Button
      variant={selected ? 'primary' : 'outline'}
      className={clsx('flex flex-col items-center gap-2 p-4', className)}
      onClick={onClick}
    >
      <Icon type={type} size="lg" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}; 