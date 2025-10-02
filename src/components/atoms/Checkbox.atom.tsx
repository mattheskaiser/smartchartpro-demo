'use client';

import { forwardRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface CheckboxAtomProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  id?: string;
}

export const CheckboxAtom = forwardRef<
  React.ElementRef<typeof Checkbox>,
  CheckboxAtomProps
>(({ checked = false, onCheckedChange, disabled = false, label, className, id, ...props }, ref) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Checkbox
        ref={ref}
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
});

CheckboxAtom.displayName = 'CheckboxAtom';