'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DatePickerMolecule = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  className,
}: DatePickerProps) => {
  // Parse date string safely to avoid invalid dates
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;

    try {
      // Handle different date formats
      let parsedDate: Date;

      if (value.includes('T')) {
        // ISO string format
        parsedDate = new Date(value);
      } else if (value.includes('-')) {
        // YYYY-MM-DD format
        parsedDate = new Date(value + 'T00:00:00');
      } else {
        // Try parsing as-is
        parsedDate = new Date(value);
      }

      // Check if the date is valid
      if (isNaN(parsedDate.getTime())) {
        console.warn('Invalid date value:', value);
        return undefined;
      }

      return parsedDate;
    } catch (error) {
      console.warn('Error parsing date:', value, error);
      return undefined;
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onChange) {
      // Use local date to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !dateValue && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? format(dateValue, 'MM/dd/yyyy') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleDateSelect}
          defaultMonth={dateValue || new Date()}
          captionLayout="dropdown"
          startMonth={new Date(1900, 0)}
          endMonth={new Date(new Date().getFullYear() + 10, 11)}
        />
      </PopoverContent>
    </Popover>
  );
};
