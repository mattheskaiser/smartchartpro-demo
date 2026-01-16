import { ADLButtonMolecule } from '@/components/molecules/ADLButton.molecule';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ADL_TYPES } from '@/constants/charting';

interface ADLSelectorProps {
    residentName: string;
    selectedADL: string | null;
    onSelect: (adl: string) => void;
}

export function ADLSelectorMolecule({ residentName, selectedADL, onSelect }: ADLSelectorProps) {
    return (
        <div>
            <div className="mb-6">
                <TextAtom variant="h3" className="text-gray-900 mb-2">
                    Select Activity
                </TextAtom>
                <TextAtom className="text-gray-600">
                    Choose the activity you're documenting for {residentName}
                </TextAtom>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ADL_TYPES.map(adl => (
                    <ADLButtonMolecule
                        key={adl}
                        type={adl}
                        selected={selectedADL === adl}
                        onClick={() => onSelect(adl)}
                        className="w-full"
                    />
                ))}
            </div>
        </div>
    );
}
