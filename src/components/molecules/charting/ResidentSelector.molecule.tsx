import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';

interface Resident {
  id: string;
  name: string;
  room: string;
  status: string;
  imageUrl?: string | null;
  imageData?: string | null;
}

interface ResidentSelectorProps {
  residents: Resident[];
  onSelect: (residentId: string) => void;
}

const getStatusVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'independent':
      return 'success';
    case 'partial':
      return 'warning';
    case 'full':
      return 'error';
    default:
      return 'info';
  }
};

export function ResidentSelectorMolecule({ residents, onSelect }: ResidentSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {residents.map(resident => (
        <div
          key={resident.id}
          className="relative flex items-center space-x-4 p-4 border border-gray-200 rounded-lg transition-all cursor-pointer hover:shadow-sm hover:border-gray-300 hover:bg-gray-50"
          onClick={() => onSelect(resident.id)}
        >
          <AvatarAtom
            src={resident.imageUrl || resident.imageData || undefined}
            alt={resident.name}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <TextAtom className="font-medium text-gray-900 truncate">{resident.name}</TextAtom>
              <BadgeAtom variant={getStatusVariant(resident.status)}>
                {resident.status?.charAt(0).toUpperCase() + resident.status?.slice(1)}
              </BadgeAtom>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <DynamicIconAtom name="MapPin" size="sm" className="mr-1" />
              Room {resident.room}
            </div>
          </div>
          <DynamicIconAtom name="ChevronRight" size="sm" className="text-gray-400" />
        </div>
      ))}
    </div>
  );
}
