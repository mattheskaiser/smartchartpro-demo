import React from 'react';
import { DUMMY_RESIDENTS } from '@/constants/residents';
import { ResidentListItemMolecule } from '../molecules/resident/ResidentListItem.molecule';

export const ResidentListOrganism = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Residents</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DUMMY_RESIDENTS.map(resident => (
          <ResidentListItemMolecule
            key={resident.id}
            name={resident.name}
            imageUrl={resident.imageUrl}
            status={resident.status}
            room={resident.room}
          />
        ))}
      </div>
    </div>
  );
};
