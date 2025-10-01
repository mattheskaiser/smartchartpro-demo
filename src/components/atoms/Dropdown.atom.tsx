'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownAtomProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: DropdownOption[];
  disabled?: boolean;
  className?: string;
}

export const DropdownAtom = ({
  value,
  onValueChange,
  placeholder = 'Select an option',
  options,
  disabled = false,
  className,
}: DropdownAtomProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};