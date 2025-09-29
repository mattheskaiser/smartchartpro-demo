'use client';

import React from 'react';
import { ButtonAtom } from '../atoms/Button.atom';
import { IconAtom } from '../atoms/Icon.atom';
import { clsx } from 'clsx';

interface ADLButtonMoleculeProps {
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

export const ADLButtonMolecule = ({
  type,
  label = labelMap[type],
  selected = false,
  className,
  onClick,
}: ADLButtonMoleculeProps) => {
  return (
    <ButtonAtom
      variant={selected ? 'primary' : 'outline'}
      className={clsx('flex flex-col items-center gap-2 p-4', className)}
      onClick={onClick}
    >
      <IconAtom type={type} size="lg" />
      <span className="text-sm font-medium">{label}</span>
    </ButtonAtom>
  );
};