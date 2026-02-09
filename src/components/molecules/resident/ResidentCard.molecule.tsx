'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { Resident } from '@/types/resident';

interface ResidentCardProps {
  resident: Resident;
}

// Memoize the component to prevent unnecessary re-renders
export const ResidentCardMolecule = memo(({ resident }: ResidentCardProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/admin/residents/${resident.id}`)}
      className="flex flex-col gap-y-8 relative p-6 rounded-xl shadow-lg cursor-pointer border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <AvatarAtom src={resident.imageUrl} alt={resident.name} size="lg" />
          <div>
            <TextAtom variant="h3" weight="semibold">
              {resident.name}
            </TextAtom>
            <TextAtom variant="small">{resident.status}</TextAtom>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex gap-x-2 items-center rounded-lg">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
            <DynamicIconAtom name="DoorClosed" size="md" className="text-primary" />
          </div>
          <div className="">
            <TextAtom variant="small" color="muted">
              Room
            </TextAtom>
            <TextAtom variant="small" weight="semibold">
              {resident.room}
            </TextAtom>
          </div>
        </div>
        <div className="flex gap-x-2 items-center rounded-lg">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
            <DynamicIconAtom name="Clock" size="md" className="text-primary" />
          </div>
          <div className="">
            <TextAtom variant="small" color="muted" className="block">
              Last ADL
            </TextAtom>
            <TextAtom variant="small" weight="semibold">
              {resident.lastADL || 'No recent activity'}
            </TextAtom>
          </div>
        </div>
        <div className="flex gap-x-2 items-center rounded-lg">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
            <DynamicIconAtom name="User" size="md" className="text-primary" />
          </div>
          <div className="">
            <TextAtom variant="small" color="muted" className="block">
              Assigned CNA
            </TextAtom>
            <TextAtom variant="small" weight="semibold" className="text-gray-900">
              {resident.assignedCNA || 'Not assigned'}
            </TextAtom>
          </div>
        </div>
      </div>
      <ButtonAtom>More Details</ButtonAtom>
    </div>
  );
});

ResidentCardMolecule.displayName = 'ResidentCardMolecule';
