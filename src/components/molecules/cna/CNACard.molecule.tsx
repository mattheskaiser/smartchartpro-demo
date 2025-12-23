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
            <DynamicIconAtom name="Mail" size="md" className="text-primary" />
          </div>
          <div className="">
            <TextAtom variant="small" color="muted">
              Email
            </TextAtom>
            <TextAtom variant="small" weight="semibold">
              {cna.email}
            </TextAtom>
          </div>
        </div>
        {cna.phone && (
          <div className="flex gap-x-2 items-center rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
              <DynamicIconAtom name="Phone" size="md" className="text-primary" />
            </div>
            <div className="">
              <TextAtom variant="small" color="muted" className="block">
                Phone
              </TextAtom>
              <TextAtom variant="small" weight="semibold">
                {cna.phone}
              </TextAtom>
            </div>
          </div>
        )}
        {cna.certificationNumber && (
          <div className="flex gap-x-2 items-center rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
              <DynamicIconAtom name="Award" size="md" className="text-primary" />
            </div>
            <div className="">
              <TextAtom variant="small" color="muted" className="block">
                Certification
              </TextAtom>
              <TextAtom variant="small" weight="semibold" className="text-gray-900">
                {cna.certificationNumber}
              </TextAtom>
            </div>
          </div>
        )}
      </div>
      <ButtonAtom>More Details</ButtonAtom>
    </div>
  );
};
