'use client';
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ResidentListTableMolecule } from '@/components/molecules/resident/ResidentListTable.molecule';
import { ADMIN_RESIDENTS } from '@/constants/residents';

export default function ResidentManagement() {
  const [showModal, setShowModal] = useState(false);

  const handleAddResident = (formData: any) => {
    console.log('Adding resident:', formData);
    setShowModal(false);
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
          <ButtonAtom variant="primary" onClick={() => setShowModal(true)}>
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Resident
          </ButtonAtom>
        </div>
      </div>

      <div className="mt-8">
        <ResidentListTableMolecule residents={ADMIN_RESIDENTS} />
      </div>
    </div>
  );
}
