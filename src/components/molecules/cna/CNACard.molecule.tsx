'use client';

import { useRouter } from 'next/navigation';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { CNA } from '@/types/cna';

interface CNACardProps {
  cna: CNA;
}

export const CNACardMolecule = ({ cna }: CNACardProps) => {
  const router = useRouter();

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'info';
      default:
        return 'info';
    }
  };

  const getShiftIcon = (shift: string) => {
    switch (shift) {
      case 'Morning':
        return 'Sun';
      case 'Evening':
        return 'Sunset';
      case 'Night':
        return 'Moon';
      default:
        return 'Clock';
    }
  };

  return (
    <div
      onClick={() => router.push(`/admin/cnas/${cna.id}`)}
      className="flex flex-col gap-y-8 relative p-6 rounded-xl shadow-lg cursor-pointer border border-gray-200 overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <AvatarAtom src={cna.imageData} alt={cna.name} size="lg" />
          <div>
            <TextAtom variant="h3" weight="semibold">
              {cna.name}
            </TextAtom>
            <div className="flex items-center gap-2 mt-1">
              <BadgeAtom variant={getStatusColor(cna.status)}>{cna.status}</BadgeAtom>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex gap-x-2 items-center rounded-lg">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
            <DynamicIconAtom name={getShiftIcon(cna.shift)} size="md" className="text-primary" />
          </div>
          <div className="">
            <TextAtom variant="small" color="muted">
              Shift
            </TextAtom>
            <TextAtom variant="small" weight="semibold">
              {cna.shift}
            </TextAtom>
          </div>
        </div>
        <div className="flex gap-x-2 items-center rounded-lg">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
            <DynamicIconAtom name="Users" size="md" className="text-primary" />
          </div>
          <div className="">
            <TextAtom variant="small" color="muted" className="block">
              Assigned Residents
            </TextAtom>
            <TextAtom variant="small" weight="semibold">
              {cna.residents} residents
            </TextAtom>
          </div>
        </div>
        <div className="flex gap-x-2 items-center rounded-lg">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
            <DynamicIconAtom name="Clock" size="md" className="text-primary" />
          </div>
          <div className="">
            <TextAtom variant="small" color="muted" className="block">
              Last Active
            </TextAtom>
            <TextAtom variant="small" weight="semibold" className="text-gray-900">
              {cna.lastActive}
            </TextAtom>
          </div>
        </div>
      </div>
      <ButtonAtom>More Details</ButtonAtom>
    </div>
  );
};
