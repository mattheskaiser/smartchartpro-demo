import React from 'react';
import { ResidentCard } from '../molecules/ResidentCard';

// Dummy data for demonstration
const DUMMY_RESIDENTS = [
  {
    id: '1',
    name: 'Alice Johnson',
    imageUrl: 'https://i.pravatar.cc/150?img=1',
    status: 'independent' as const,
    room: '101',
  },
  {
    id: '2',
    name: 'Bob Smith',
    imageUrl: 'https://i.pravatar.cc/150?img=2',
    status: 'partial' as const,
    room: '102',
  },
  {
    id: '3',
    name: 'Carol Williams',
    imageUrl: 'https://i.pravatar.cc/150?img=3',
    status: 'full' as const,
    room: '103',
  },
];

export const ResidentList = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Residents</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DUMMY_RESIDENTS.map(resident => (
          <ResidentCard
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
