'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { toast } from '@/lib/toast';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mustChangePassword = session?.user?.mustChangePassword;
  const isMasterLogin = session?.user?.isMasterLogin;

  // Redirect if not authenticated
  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      toast({
        title: 'Password changed successfully',
        description: 'Your password has been updated',
        type: 'success',
      });

      // Redirect based on role
      if (session?.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/charting/start');
      }
    } catch (error) {
      toast({
        title: 'Failed to change password',
        description: error instanceof Error ? error.message : 'Please try again',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (mustChangePassword) {
      // Can't cancel if password change is required
      return;
    }
    router.back();
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <DynamicIconAtom name="KeyRound" size="lg" className="text-primary" />
          </div>
          <TextAtom variant="h1" className="text-gray-900 mb-2">
            {mustChangePassword ? 'Set Your Password' : 'Change Password'}
          </TextAtom>
          <TextAtom className="text-gray-600">
            {mustChangePassword
              ? 'Please set a new password for your account'
              : 'Update your account password'}
          </TextAtom>
        </div>

        {/* Warning for required password change */}
        {mustChangePassword && (
          <div className="mb-6">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <DynamicIconAtom name="TriangleAlert" size="sm" className="text-yellow-600 mt-0.5" />
              <div>
                <TextAtom className="text-yellow-800 font-medium text-sm">
                  Password Change Required
                </TextAtom>
                <TextAtom className="text-yellow-700 text-sm mt-1">
                  You must change your password before continuing. Please choose a strong password
                  with at least 8 characters.
                </TextAtom>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <CardAtom>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password - skip if master login or first time */}
            {!isMasterLogin && !mustChangePassword && (
              <div className="space-y-2">
                <LabelAtom htmlFor="current-password">Current Password</LabelAtom>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DynamicIconAtom name="Lock" size="sm" className="text-gray-400" />
                  </div>
                  <InputAtom
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <DynamicIconAtom
                      name={showCurrentPassword ? 'EyeOff' : 'Eye'}
                      size="sm"
                      className="text-gray-400 hover:text-gray-600"
                    />
                  </button>
                </div>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <LabelAtom htmlFor="new-password">New Password</LabelAtom>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DynamicIconAtom name="Lock" size="sm" className="text-gray-400" />
                </div>
                <InputAtom
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={isLoading}
                  className="pl-10 pr-10"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <DynamicIconAtom
                    name={showNewPassword ? 'EyeOff' : 'Eye'}
                    size="sm"
                    className="text-gray-400 hover:text-gray-600"
                  />
                </button>
              </div>
              <TextAtom variant="small" className="text-gray-500">
                Must be at least 8 characters long
              </TextAtom>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <LabelAtom htmlFor="confirm-password">Confirm New Password</LabelAtom>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DynamicIconAtom name="Lock" size="sm" className="text-gray-400" />
                </div>
                <InputAtom
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={isLoading}
                  className="pl-10 pr-10"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <DynamicIconAtom
                    name={showConfirmPassword ? 'EyeOff' : 'Eye'}
                    size="sm"
                    className="text-gray-400 hover:text-gray-600"
                  />
                </button>
              </div>
            </div>

            {/* Password match indicator */}
            {newPassword && confirmPassword && (
              <div
                className={`flex items-center space-x-2 text-sm ${
                  newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <DynamicIconAtom name={newPassword === confirmPassword ? 'Check' : 'X'} size="sm" />
                <span>
                  {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              {!mustChangePassword && (
                <ButtonAtom
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </ButtonAtom>
              )}
              <ButtonAtom
                type="submit"
                disabled={
                  isLoading ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword ||
                  (!isMasterLogin && !mustChangePassword && !currentPassword)
                }
                isLoading={isLoading}
                loadingText="Changing..."
              >
                <DynamicIconAtom name="Check" size="sm" className="mr-2" />
                {mustChangePassword ? 'Set Password' : 'Change Password'}
              </ButtonAtom>
            </div>
          </form>
        </CardAtom>
      </div>
    </div>
  );
}
