'use client';

import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';

interface ResidentSummaryCardProps {
  resident: {
    name: string;
    room: string;
    imageUrl: string;
    lastADL: string;
    status: string;
  };
}

export const ResidentSummaryCardMolecule = ({ resident }: ResidentSummaryCardProps) => {
  return (
    <CardAtom>
      <div className="flex items-center space-x-4 mb-4">
        <AvatarAtom src={resident.imageUrl} alt={resident.name} className="h-16 w-16" />
        <div>
          <TextAtom variant="h3" weight="medium">
            {resident.name}
          </TextAtom>
          <TextAtom variant="small" color="muted">
            Room {resident.room}
          </TextAtom>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <TextAtom variant="small" color="muted">
            Last ADL:
          </TextAtom>
          <TextAtom variant="small">{resident.lastADL}</TextAtom>
        </div>
        <div className="flex justify-between">
          <TextAtom variant="small" color="muted">
            Status:
          </TextAtom>
          <BadgeAtom variant={resident.status as 'info' | 'warning' | 'success'}>
            {resident.status}
          </BadgeAtom>
        </div>
      </div>
    </CardAtom>
  );
};
