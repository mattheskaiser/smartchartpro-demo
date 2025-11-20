import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { IconName } from 'lucide-react/dynamic';
import { TextAtom } from '@/components/atoms/Text.atom';

type StatisticMoleculeProps = {
  name: string;
  icon: IconName;
  value: string;
};

export const StatisticMolecule = ({ name, icon, value }: StatisticMoleculeProps) => {
  return (
    <div key={name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <div className="flex items-center">
        <DynamicIconAtom name={icon} size={'lg'} />
        <div className="ml-5 w-0 flex-1">
          <TextAtom className="truncate text-sm font-medium text-gray-500">{name}</TextAtom>
          <TextAtom className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {value}
          </TextAtom>
        </div>
      </div>
    </div>
  );
};
