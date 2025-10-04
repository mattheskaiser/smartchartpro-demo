'use client';

import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';

interface StickyPageHeaderProps {
  title: string;
  subtitle?: string;
  isEditing: boolean;
  onBack: () => void;
  onToggleEdit: () => void;
  isSaving?: boolean;
}

export function StickyPageHeaderMolecule({
  title,
  subtitle,
  isEditing,
  onBack,
  onToggleEdit,
  isSaving = false,
}: StickyPageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4 mb-6 -mx-6 px-6 -mt-8 pt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ButtonAtom variant="secondary" size="sm" onClick={onBack} className="mr-4 p-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </ButtonAtom>
          <div>
            <TextAtom variant="h1" weight="semibold">
              {title}
            </TextAtom>
            {subtitle && (
              <TextAtom variant="small" color="muted">
                {subtitle}
              </TextAtom>
            )}
          </div>
        </div>
        <ButtonAtom
          variant="primary"
          onClick={onToggleEdit}
          isLoading={isSaving}
          loadingText="Saving..."
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          {isEditing ? 'Save Changes' : 'Edit'}
        </ButtonAtom>
      </div>
    </div>
  );
}
