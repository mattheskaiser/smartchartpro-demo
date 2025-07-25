import React from 'react';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';

interface ResidentCardProps {
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

export const ResidentCard = ({
  name,
  imageUrl,
  status,
  room,
  className,
}: ResidentCardProps) => {
  const { label, variant } = statusConfig[status];

  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <Avatar src={imageUrl} alt={name} size="lg" />
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">Room {room}</p>
        <div className="mt-2">
          <Badge variant={variant}>{label}</Badge>
        </div>
      </div>
    </div>
  );
}; 