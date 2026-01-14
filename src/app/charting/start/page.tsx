'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChartingStore } from '@/stores/chartingStore';
import { useCNAs } from '@/hooks/useCNAs';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { DropdownAtom } from '@/components/atoms/Dropdown.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';

type Resident = {
  id: string;
  name: string;
  room: string;
  status: string;
  imageUrl?: string | null;
  imageData?: string | null;
};

export default function ChartingStartPage() {
  const router = useRouter();
  const { startCharting } = useChartingStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedCnaId, setSelectedCnaId] = useState<string>('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch CNAs
  const { data: cnas = [], isLoading: cnasLoading } = useCNAs();

  // Fetch residents from the database
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await fetch('/api/residents');
        if (!response.ok) {
          throw new Error('Failed to fetch residents');
        }
        const data = await response.json();
        setResidents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load residents');
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, []);

  const handleStartCharting = () => {
    const selectedResidents = residents.filter(r => selectedIds.has(r.id));

    // Get selected CNA info
    const selectedCna = cnas.find(cna => cna.id === selectedCnaId);
    const cnaInfo = selectedCna
      ? {
        id: selectedCna.id,
        name: selectedCna.name,
        certificationNumber: selectedCna.certificationNumber,
      }
      : undefined;

    startCharting(selectedResidents, cnaInfo);
    router.push('/charting/adls');
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
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

  if (loading || cnasLoading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <LoadingStateMolecule message="Loading residents..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <CardAtom className="text-center">
          <DynamicIconAtom name="TriangleAlert" size="lg" className="mx-auto text-red-500 mb-4" />
          <TextAtom variant="h2" className="text-red-600 mb-2">
            Error Loading Residents
          </TextAtom>
          <TextAtom className="text-gray-600 mb-4">{error}</TextAtom>
          <ButtonAtom onClick={() => window.location.reload()} variant="outline">
            Try Again
          </ButtonAtom>
        </CardAtom>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* CNA Selection */}
      <CardAtom>
        <div className="flex items-center gap-2 mb-4">
          <DynamicIconAtom name="UserCheck" className="h-5 w-5 text-gray-600" />
          <TextAtom variant="h3" className="text-gray-900">
            Charting Information
          </TextAtom>
        </div>
        <div className="max-w-md">
          <LabelAtom htmlFor="cna-select">CNA/Nurse (Optional)</LabelAtom>
          <DropdownAtom
            value={selectedCnaId || undefined}
            onValueChange={value => setSelectedCnaId(value || '')}
            placeholder="Select CNA/Nurse"
            options={cnas
              .filter(cna => cna.status === 'active')
              .map(cna => ({
                value: cna.id,
                label: `${cna.name}${cna.certificationNumber ? ` (${cna.certificationNumber})` : ''}`,
              }))}
          />
          <TextAtom variant="small" className="text-gray-500 mt-2">
            Select the CNA/Nurse performing this charting session. This will be included in the PDF
            report.
          </TextAtom>
        </div>
      </CardAtom>

      {/* Resident Selection */}
      <CardAtom padding="none">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <TextAtom variant="h2" className="text-gray-900">
              Available Residents
            </TextAtom>
            <div className="flex items-center space-x-4">
              <ButtonAtom
                variant="outline"
                onClick={() => setSelectedIds(new Set(residents.map(r => r.id)))}
                disabled={residents.length === 0}
              >
                Select All
              </ButtonAtom>
              <ButtonAtom
                variant="ghost"
                onClick={() => setSelectedIds(new Set())}
                disabled={selectedIds.size === 0}
              >
                Clear All
              </ButtonAtom>
            </div>
          </div>

          {residents.length === 0 ? (
            <div className="text-center py-12">
              <DynamicIconAtom name="Users" size="lg" className="mx-auto text-gray-400 mb-4" />
              <TextAtom variant="h3" className="text-gray-500 mb-2">
                No Residents Found
              </TextAtom>
              <TextAtom className="text-gray-400">
                Add residents in the admin panel to start charting
              </TextAtom>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {residents.map(resident => (
                <div
                  key={resident.id}
                  className={`relative flex items-center space-x-4 p-4 border rounded-lg transition-all cursor-pointer hover:shadow-sm ${selectedIds.has(resident.id)
                      ? 'border-primary bg-secondary ring-1 ring-primary/20'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  onClick={() => {
                    const newSelected = new Set(selectedIds);
                    if (selectedIds.has(resident.id)) {
                      newSelected.delete(resident.id);
                    } else {
                      newSelected.add(resident.id);
                    }
                    setSelectedIds(newSelected);
                  }}
                >
                  <CheckboxAtom
                    checked={selectedIds.has(resident.id)}
                    onCheckedChange={checked => {
                      const newSelected = new Set(selectedIds);
                      if (checked) {
                        newSelected.add(resident.id);
                      } else {
                        newSelected.delete(resident.id);
                      }
                      setSelectedIds(newSelected);
                    }}
                  />
                  <AvatarAtom
                    src={resident.imageUrl || resident.imageData || undefined}
                    alt={resident.name}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <TextAtom className="font-medium text-gray-900 truncate">
                        {resident.name}
                      </TextAtom>
                      <BadgeAtom variant={getStatusVariant(resident.status)}>
                        {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
                      </BadgeAtom>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <DynamicIconAtom name="MapPin" size="sm" className="mr-1" />
                      Room {resident.room}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DynamicIconAtom name="Check" size="sm" className="text-primary" />
              <TextAtom className="text-gray-600">
                {selectedIds.size} resident{selectedIds.size !== 1 ? 's' : ''} selected
              </TextAtom>
            </div>
            <ButtonAtom
              onClick={handleStartCharting}
              disabled={selectedIds.size === 0}
              className="min-w-[140px]"
            >
              <DynamicIconAtom name="Hospital" size="sm" className="mr-2" />
              Start Charting
            </ButtonAtom>
          </div>
        </div>
      </CardAtom>
    </div>
  );
}
