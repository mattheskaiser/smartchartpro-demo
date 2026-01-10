'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChartingStore } from '@/stores/chartingStore';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';

type Resident = {
  id: string;
  name: string;
  room: string;
  status: string;
  imageUrl?: string | null;
  imageData?: string | null;
};

export default function StartPage() {
  const router = useRouter();
  const { startCharting } = useChartingStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    startCharting(selectedResidents);
    router.push('/charting');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl p-6">
          <LoadingStateMolecule message="Loading residents..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <TextAtom variant="h1" className="text-gray-900">
              SmartChart Pro
            </TextAtom>
            <TextAtom className="mt-2 text-gray-600">
              Select the residents you'll be charting for during your session
            </TextAtom>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <DynamicIconAtom name="Users" size="sm" />
            <span>{residents.length} total residents</span>
          </div>
        </div>

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
                  size="sm"
                  onClick={() => setSelectedIds(new Set(residents.map(r => r.id)))}
                  disabled={residents.length === 0}
                >
                  Select All
                </ButtonAtom>
                <ButtonAtom
                  variant="ghost"
                  size="sm"
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
                    className={`relative flex items-center space-x-4 p-4 border rounded-lg transition-all cursor-pointer hover:shadow-sm ${
                      selectedIds.has(resident.id)
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
    </div>
  );
}
