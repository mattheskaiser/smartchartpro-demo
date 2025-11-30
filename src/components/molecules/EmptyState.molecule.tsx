/**
 * EmptyStateMolecule - A reusable component for displaying empty states
 *
 * Usage examples:
 *
 * // Basic empty state with action
 * <EmptyStateMolecule
 *   icon={UserGroupIcon}
 *   title="No residents found"
 *   description="Get started by adding your first resident."
 *   actionLabel="Add Resident"
 *   onAction={() => setShowModal(true)}
 * />
 *
 * // Simple empty state without action
 * <EmptyStateMolecule
 *   icon={DocumentIcon}
 *   title="No documents available"
 *   description="Documents will appear here when uploaded."
 * />
 *
 * // Small size for cards or smaller containers
 * <EmptyStateMolecule
 *   icon={HeartIcon}
 *   title="No favorites"
 *   size="sm"
 * />
 *
 * // Search results empty state
 * <EmptyStateMolecule
 *   icon={MagnifyingGlassIcon}
 *   title="No results found"
 *   description="Try adjusting your search terms or filters."
 *   size="md"
 * />
 */
import React from 'react';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { icons } from 'lucide-react';

interface EmptyStateProps {
  iconName: keyof typeof icons;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyStateMolecule = ({
  iconName,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  size = 'md',
}: EmptyStateProps) => {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      iconContainer: 'h-12 w-12',
      iconSize: 'sm' as const,
    },
    md: {
      container: 'py-12',
      iconContainer: 'h-16 w-16',
      iconSize: 'md' as const,
    },
    lg: {
      container: 'py-16',
      iconContainer: 'h-20 w-20',
      iconSize: 'lg' as const,
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`text-center ${classes.container} ${className}`}>
      <div
        className={`mx-auto flex ${classes.iconContainer} items-center justify-center rounded-full bg-gray-100`}
      >
        <DynamicIconAtom name={iconName} size={classes.iconSize} className="text-gray-400" />
      </div>

      <div className="mt-4">
        <TextAtom variant="h3" weight="medium" className="text-gray-900">
          {title}
        </TextAtom>

        {description && (
          <TextAtom variant="body" color="muted" className="mt-2 max-w-sm mx-auto">
            {description}
          </TextAtom>
        )}
      </div>

      {actionLabel && onAction && (
        <div className="mt-6">
          <ButtonAtom variant="primary" onClick={onAction}>
            {actionLabel}
          </ButtonAtom>
        </div>
      )}
    </div>
  );
};
