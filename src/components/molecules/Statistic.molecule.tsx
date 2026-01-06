import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { icons } from 'lucide-react';
import { TextAtom } from '@/components/atoms/Text.atom';

type StatisticMoleculeProps = {
  name: string;
  icon: keyof typeof icons;
  value: string;
};

export const StatisticMolecule = ({ name, icon, value }: StatisticMoleculeProps) => {
  return (
    <div className="group overflow-hidden rounded-xl bg-white px-6 py-8 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-primary/20">
      <div className="flex items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-primary/10">
          <DynamicIconAtom
            name={icon}
            size="md"
            className="text-primary transition-colors group-hover:text-primary"
          />
        </div>
        <div className="ml-5 w-0 flex-1">
          <TextAtom className="truncate text-sm font-medium text-lightGray">{name}</TextAtom>
          <TextAtom className="mt-1 text-3xl font-bold tracking-tight text-tertiary">
            {value}
          </TextAtom>
        </div>
      </div>
    </div>
  );
};
