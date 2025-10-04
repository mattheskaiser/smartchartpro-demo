'use client';

import { useRouter } from 'next/navigation';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { TextAtom } from '@/components/atoms/Text.atom';

interface Resident {
  id: string;
  name: string;
  imageUrl: string;
  room: string;
  status: string;
  lastADL?: string;
  assignedCNA?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ResidentListTableProps {
  residents: Resident[];
}

export const ResidentListTableMolecule = ({ residents }: ResidentListTableProps) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">
              Resident
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Room</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last ADL</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Assigned CNA
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {residents.map(resident => (
            <tr
              key={resident.id}
              onClick={() => router.push(`/admin/residents/${resident.id}`)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="py-4 pl-6 pr-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <AvatarAtom src={resident.imageUrl} alt={resident.name} />
                  </div>
                  <div className="ml-4">
                    <TextAtom weight="medium">{resident.name}</TextAtom>
                  </div>
                </div>
              </td>
              <td className="px-3 py-4">
                <TextAtom variant="small" color="muted">
                  {resident.room}
                </TextAtom>
              </td>
              <td className="px-3 py-4">
                <BadgeAtom variant={resident.status as 'info' | 'warning' | 'success'}>
                  {resident.status}
                </BadgeAtom>
              </td>
              <td className="px-3 py-4">
                <TextAtom variant="small" color="muted">
                  {resident.lastADL || 'No recent activity'}
                </TextAtom>
              </td>
              <td className="px-3 py-4">
                <TextAtom variant="small" color="muted">
                  {resident.assignedCNA || 'Not assigned'}
                </TextAtom>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
