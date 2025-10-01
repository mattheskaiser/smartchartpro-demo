'use client';

import React from 'react';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'warning';
  disabled?: boolean;
}

interface ActionMenuProps {
  items?: ActionMenuItem[];
  onEdit?: () => void;
  onDelete?: () => void;
  showStandardActions?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ActionMenuMolecule = ({
  items = [],
  onEdit,
  onDelete,
  showStandardActions = true,
  disabled = false,
  className
}: ActionMenuProps) => {
  const [open, setOpen] = React.useState(false);

  // Standard actions
  const standardActions: ActionMenuItem[] = [];
  
  if (onEdit) {
    standardActions.push({
      id: 'edit',
      label: 'Edit',
      icon: Pencil,
      onClick: () => {
        onEdit();
        setOpen(false);
      },
      variant: 'default'
    });
  }

  if (onDelete) {
    standardActions.push({
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: () => {
        onDelete();
        setOpen(false);
      },
      variant: 'destructive'
    });
  }

  // Combine standard actions with custom items
  const allItems = showStandardActions 
    ? [...standardActions, ...items]
    : items;

  const getItemClassName = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'text-red-600 hover:text-red-600 hover:bg-red-50 data-[selected=true]:text-red-600 data-[selected=true]:bg-red-50';
      case 'warning':
        return 'text-orange-600 hover:text-orange-600 hover:bg-orange-50 data-[selected=true]:text-orange-600 data-[selected=true]:bg-orange-50';
      default:
        return 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 data-[selected=true]:text-gray-900 data-[selected=true]:bg-gray-50';
    }
  };

  if (allItems.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className={`inline-flex items-center justify-center h-8 w-8 p-0 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          disabled={disabled}
        >
          <EllipsisVertical className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <Command>
          <CommandList>
            <CommandGroup>
              {allItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      if (!item.disabled) {
                        item.onClick();
                        setOpen(false);
                      }
                    }}
                    disabled={item.disabled}
                    className={`cursor-pointer ${getItemClassName(item.variant)}`}
                  >
                    {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                    <TextAtom variant="small" as="span">{item.label}</TextAtom>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};