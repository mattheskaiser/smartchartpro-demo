'use client';
import { useState } from 'react';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';

interface CNA {
  id: string;
  name: string;
}

export default function CNAManagement() {
  const [cnas] = useState<CNA[]>([]); // Empty for demonstration
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddCNA = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
    console.log('Add CNA clicked');
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <TextAtom variant="h1" weight="semibold">
            CNA Management
          </TextAtom>
          <TextAtom variant="small" color="muted" className="mt-2">
            Manage certified nursing assistants, their schedules, and resident assignments
          </TextAtom>
        </div>
        {/* Hide Add button only when loading */}
        {!loading && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            {saving ? (
              <LoadingStateMolecule message="Adding CNA..." size="sm" inline />
            ) : (
              <ButtonAtom variant="primary" onClick={handleAddCNA}>
                <DynamicIconAtom name="Plus" size="sm" className="-ml-0.5 mr-1.5" />
                Add CNA
              </ButtonAtom>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingStateMolecule message="Loading CNAs..." />
          </div>
        ) : cnas.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyStateMolecule
              iconName="UserRound"
              title="No CNAs found"
              description="Get started by adding certified nursing assistants to your team. You can manage their schedules, resident assignments, and contact information."
            />
          </div>
        ) : (
          <div>
            {/* TODO: Add CNA table/list component */}
            <TextAtom>CNA list would go here</TextAtom>
          </div>
        )}
      </div>
    </div>
  );
}
