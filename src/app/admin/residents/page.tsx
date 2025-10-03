'use client';
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ResidentListTableMolecule } from '@/components/molecules/resident/ResidentListTable.molecule';
import { AddResidentModalMolecule } from '@/components/molecules/resident/modals/AddResidentModal.molecule';
import { ADMIN_RESIDENTS } from '@/constants/residents';

export default function ResidentManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddResident = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitResident = (formData: any) => {
    // TODO: Implement actual resident creation logic
    console.log('Creating new resident:', formData);

    // Here you would typically:
    // 1. Validate the form data
    // 2. Send to API/database
    // 3. Update the residents list
    // 4. Show success message

    setIsAddModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <TextAtom variant="h1" weight="semibold">
            Resident Management
          </TextAtom>
          <TextAtom variant="small" color="muted" className="mt-2">
            Manage residents, their care levels, and CNA assignments
          </TextAtom>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <ButtonAtom variant="primary" onClick={handleAddResident}>
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Resident
          </ButtonAtom>
        </div>
      </div>

      <div className="mt-8">
        <ResidentListTableMolecule residents={ADMIN_RESIDENTS} />
      </div>

      <AddResidentModalMolecule
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitResident}
      />
    </div>
  );
}
