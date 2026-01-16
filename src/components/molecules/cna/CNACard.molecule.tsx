'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { CNA } from '@/types/cna';
import { toast } from '@/lib/toast';

interface CNACardProps {
  cna: CNA;
}

export const CNACardMolecule = ({ cna }: CNACardProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/cna-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnaId: cna.id, email: cna.email }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create account');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setTemporaryPassword(data.temporaryPassword);
      setShowPassword(true);
      queryClient.invalidateQueries({ queryKey: ['cnas'] });
      toast({
        title: 'Account created successfully',
        description: 'Copy the temporary password before closing',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create account',
        description: error.message,
        type: 'error',
      });
    },
  });

  const handleCreateAccount = (e: React.MouseEvent) => {
    e.stopPropagation();
    createAccountMutation.mutate();
  };

  const handleCopyPassword = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (temporaryPassword) {
      navigator.clipboard.writeText(temporaryPassword);
      toast({ title: 'Password copied to clipboard', type: 'success' });
    }
  };

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
              {cna.user ? (
                <BadgeAtom variant="success">
                  <DynamicIconAtom name="Check" size="sm" className="mr-1" />
                  Has Account
                </BadgeAtom>
              ) : (
                <BadgeAtom variant="warning">No Account</BadgeAtom>
              )}
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

      {/* Temporary Password Display */}
      {showPassword && temporaryPassword && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <DynamicIconAtom name="Key" size="sm" className="text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <TextAtom className="text-yellow-800 font-medium text-sm mb-2">
                Temporary Password
              </TextAtom>
              <div className="flex items-center space-x-2">
                <code className="text-sm font-mono font-bold text-yellow-900 bg-yellow-100 px-2 py-1 rounded">
                  {temporaryPassword}
                </code>
                <ButtonAtom
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyPassword}
                >
                  <DynamicIconAtom name="Copy" size="sm" />
                </ButtonAtom>
              </div>
              <TextAtom variant="small" className="text-yellow-700 mt-2">
                Save this password! It will only be shown once.
              </TextAtom>
            </div>
          </div>
        </div>
      )}

      {!cna.user ? (
        <ButtonAtom
          onClick={handleCreateAccount}
          disabled={createAccountMutation.isPending}
          isLoading={createAccountMutation.isPending}
          loadingText="Creating..."
        >
          <DynamicIconAtom name="UserPlus" size="sm" className="mr-2" />
          Create Login Account
        </ButtonAtom>
      ) : (
        <ButtonAtom onClick={() => router.push(`/admin/cnas/${cna.id}`)}>
          More Details
        </ButtonAtom>
      )}
    </div>
  );
};
