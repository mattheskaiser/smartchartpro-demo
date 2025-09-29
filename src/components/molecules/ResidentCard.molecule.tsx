import React from 'react';
import { AvatarAtom } from '../atoms/Avatar.atom';
import { BadgeAtom } from '../atoms/Badge.atom';

interface ResidentCardMoleculeProps {
  name: string;
  imageUrl: string;
  status: 'independent' | 'partial' | 'full';
  room: string;
  className?: string;
}

const statusConfig = {
  independent: { label: 'Independent', variant: 'success' as const },
  partial: { label: 'Partial Assist', variant: 'warning' as const },
  full: { label: 'Full Assist', variant: 'error' as const },
};

export const ResidentCardMolecule = ({ name, imageUrl, status, room }: ResidentCardMoleculeProps) => {
  const { label, variant } = statusConfig[status];

  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <AvatarAtom src={imageUrl} alt={name} size="lg" />
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">Room {room}</p>
        <div className="mt-2">
          <BadgeAtom variant={variant}>{label}</BadgeAtom>
        </div>
      </div>
    </div>
  );
};