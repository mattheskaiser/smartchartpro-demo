'use client';

import { useState, useEffect } from 'react';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { DropdownAtom } from '@/components/atoms/Dropdown.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { DashboardCardAtom } from '@/components/atoms/DashboardCard.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { ShiftTemplateManagerMolecule } from '@/components/molecules/shift/ShiftTemplateManager.molecule';
import { AdminPageLayoutTemplate } from '@/components/templates/AdminPageLayout.template';
import { PageLoaderMolecule } from '@/components/molecules/PageLoader.molecule';
import { toast } from '@/lib/toast';

type SettingsData = {
  facilityName: string;
  facilityAddress: string;
  facilityStreet: string;
  facilityCity: string;
  facilityState: string;
  facilityZip: string;
  facilityPhone: string;
  facilityFax: string;
  facilityWebsite: string;
  licenseNumber: string;
  npiNumber: string;
  taxId: string;
  adminEmail: string;
  masterPassword: string;
  maxResidentsPerCNA: string;
  shiftAlerts: boolean;
  adlReminders: boolean;
};

export default function Settings() {
  // MVP Settings State - Only essential settings
  const [facilityName, setFacilityName] = useState('');
  const [facilityAddress, setFacilityAddress] = useState('');

  // Address components
  const [facilityStreet, setFacilityStreet] = useState('');
  const [facilityCity, setFacilityCity] = useState('');
  const [facilityState, setFacilityState] = useState('');
  const [facilityZip, setFacilityZip] = useState('');

  // Contact information
  const [facilityPhone, setFacilityPhone] = useState('');
  const [facilityFax, setFacilityFax] = useState('');
  const [facilityWebsite, setFacilityWebsite] = useState('');

  // Legal/Medical identifiers
  const [licenseNumber, setLicenseNumber] = useState('');
  const [npiNumber, setNpiNumber] = useState('');
  const [taxId, setTaxId] = useState('');

  const [adminEmail, setAdminEmail] = useState('');

  // Password management state
  const [hasExistingPassword, setHasExistingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [maxResidentsPerCNA, setMaxResidentsPerCNA] = useState('8');
  const [shiftAlerts, setShiftAlerts] = useState(true);
  const [adlReminders, setAdlReminders] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemovingPassword, setIsRemovingPassword] = useState(false);

  // Password validation
  const passwordsMatch = newPassword === confirmPassword;
  const passwordValid = newPassword.length >= 8;
  const currentPasswordValid = hasExistingPassword ? currentPassword.length > 0 : true;
  const isChangingPassword = newPassword !== '';

  // Form validation
  const canSave =
    facilityName &&
    adminEmail &&
    facilityStreet &&
    facilityCity &&
    facilityState &&
    facilityZip &&
    (!isChangingPassword || (currentPasswordValid && passwordsMatch && passwordValid));

  // Dropdown options
  const maxResidentsOptions = [
    { value: '6', label: '6 Residents' },
    { value: '8', label: '8 Residents' },
    { value: '10', label: '10 Residents' },
    { value: '12', label: '12 Residents' },
  ] as const;

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data: SettingsData = await response.json();
          setFacilityName(data.facilityName || '');
          setFacilityAddress(data.facilityAddress || '');

          // Set address components
          setFacilityStreet(data.facilityStreet || '');
          setFacilityCity(data.facilityCity || '');
          setFacilityState(data.facilityState || '');
          setFacilityZip(data.facilityZip || '');

          // Set contact information
          setFacilityPhone(data.facilityPhone || '');
          setFacilityFax(data.facilityFax || '');
          setFacilityWebsite(data.facilityWebsite || '');

          // Set legal/medical identifiers
          setLicenseNumber(data.licenseNumber || '');
          setNpiNumber(data.npiNumber || '');
          setTaxId(data.taxId || '');

          setAdminEmail(data.adminEmail || '');

          // Check if password exists
          setHasExistingPassword(data.masterPassword === '********');

          setMaxResidentsPerCNA(data.maxResidentsPerCNA || '8');
          setShiftAlerts(data.shiftAlerts ?? true);
          setAdlReminders(data.adlReminders ?? true);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Load failed',
          description: 'Could not load settings. Using defaults.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Auto-sync legacy facilityAddress field when address components change
  useEffect(() => {
    if (facilityStreet && facilityCity && facilityState && facilityZip) {
      const formattedAddress = `${facilityStreet}, ${facilityCity}, ${facilityState} ${facilityZip}`;
      setFacilityAddress(formattedAddress);
    }
  }, [facilityStreet, facilityCity, facilityState, facilityZip]);

  const handleSave = async () => {
    if (!canSave) return;

    setIsSaving(true);
    try {
      const settingsData: SettingsData = {
        facilityName,
        facilityAddress,
        facilityStreet,
        facilityCity,
        facilityState,
        facilityZip,
        facilityPhone,
        facilityFax,
        facilityWebsite,
        licenseNumber,
        npiNumber,
        taxId,
        adminEmail,
        masterPassword: '', // Will be handled separately if changing
        maxResidentsPerCNA,
        shiftAlerts,
        adlReminders,
      };

      // Add password change data if changing password
      const requestData: typeof settingsData & {
        passwordChange?: {
          currentPassword?: string;
          newPassword: string;
          confirmPassword: string;
        };
      } = { ...settingsData };
      if (isChangingPassword) {
        requestData.passwordChange = {
          currentPassword: hasExistingPassword ? currentPassword : undefined,
          newPassword,
          confirmPassword,
        };
      }

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        toast({
          title: 'Settings saved',
          description: 'Your settings have been saved successfully',
          type: 'success',
        });

        // Clear password fields and update state
        if (isChangingPassword) {
          setHasExistingPassword(true);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Save failed',
        description:
          error instanceof Error
            ? error.message
            : 'There was an error saving your settings. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePassword = async () => {
    if (
      !confirm(
        'Are you sure you want to remove the master password? This will disable CNA account access via master password.'
      )
    ) {
      return;
    }

    setIsRemovingPassword(true);
    try {
      const response = await fetch('/api/admin/settings/password', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Password removed',
          description: 'Master password has been removed from the database',
          type: 'success',
        });

        // Reset password state
        setHasExistingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove password');
      }
    } catch (error) {
      console.error('Error removing password:', error);
      toast({
        title: 'Remove failed',
        description:
          error instanceof Error ? error.message : 'There was an error removing the password.',
        type: 'error',
      });
    } finally {
      setIsRemovingPassword(false);
    }
  };

  if (isLoading) {
    return <PageLoaderMolecule message="Loading settings..." />;
  }

  return (
    <AdminPageLayoutTemplate
      title="Settings"
      subtitle="Configure essential settings to get your facility up and running."
      actionButton={{
        label: isSaving ? 'Saving...' : 'Save Settings',
        onClick: handleSave,
        icon: 'Save',
        disabled: isSaving || !canSave,
        variant: canSave ? 'primary' : 'outline',
      }}
    >
      {/* Essential Settings */}
      <div className="space-y-6">
        {/* Facility Information */}
        <DashboardCardAtom>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <DynamicIconAtom name="Building" className="h-5 w-5 text-gray-600" />
              <TextAtom variant="h3" weight="semibold" className="text-gray-900">
                Facility Information
              </TextAtom>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <LabelAtom htmlFor="facility-name" required>
                  Facility Name
                </LabelAtom>
                <InputAtom
                  id="facility-name"
                  type="text"
                  value={facilityName}
                  onChange={e => setFacilityName(e.target.value)}
                  placeholder="Enter your facility name"
                />
              </div>
              <div>
                <LabelAtom htmlFor="admin-email" required>
                  Admin Email
                </LabelAtom>
                <InputAtom
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  placeholder="admin@yourfacility.com"
                />
                <TextAtom variant="small" className="text-gray-500 mt-1">
                  All system alerts will be sent to this email
                </TextAtom>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <DynamicIconAtom name="MapPin" className="h-4 w-4 text-gray-500" />
                <TextAtom variant="h3" weight="medium" className="text-gray-700">
                  Facility Address
                </TextAtom>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <LabelAtom htmlFor="facility-street" required>
                    Street Address
                  </LabelAtom>
                  <InputAtom
                    id="facility-street"
                    type="text"
                    value={facilityStreet}
                    onChange={e => setFacilityStreet(e.target.value)}
                    placeholder="123 Healthcare Avenue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <LabelAtom htmlFor="facility-city" required>
                      City
                    </LabelAtom>
                    <InputAtom
                      id="facility-city"
                      type="text"
                      value={facilityCity}
                      onChange={e => setFacilityCity(e.target.value)}
                      placeholder="Medical City"
                    />
                  </div>
                  <div>
                    <LabelAtom htmlFor="facility-state" required>
                      State
                    </LabelAtom>
                    <InputAtom
                      id="facility-state"
                      type="text"
                      value={facilityState}
                      onChange={e => setFacilityState(e.target.value)}
                      placeholder="CA"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <LabelAtom htmlFor="facility-zip" required>
                      ZIP Code
                    </LabelAtom>
                    <InputAtom
                      id="facility-zip"
                      type="text"
                      value={facilityZip}
                      onChange={e => setFacilityZip(e.target.value)}
                      placeholder="12345"
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <DynamicIconAtom name="Phone" className="h-4 w-4 text-gray-500" />
                <TextAtom variant="h3" weight="medium" className="text-gray-700">
                  Contact Information
                </TextAtom>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <LabelAtom htmlFor="facility-phone">Phone Number</LabelAtom>
                  <InputAtom
                    id="facility-phone"
                    type="tel"
                    value={facilityPhone}
                    onChange={e => setFacilityPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <LabelAtom htmlFor="facility-fax">Fax Number</LabelAtom>
                  <InputAtom
                    id="facility-fax"
                    type="tel"
                    value={facilityFax}
                    onChange={e => setFacilityFax(e.target.value)}
                    placeholder="(555) 123-4568"
                  />
                </div>
              </div>

              <div>
                <LabelAtom htmlFor="facility-website">Website (Optional)</LabelAtom>
                <InputAtom
                  id="facility-website"
                  type="url"
                  value={facilityWebsite}
                  onChange={e => setFacilityWebsite(e.target.value)}
                  placeholder="https://www.yourfacility.com"
                />
              </div>
            </div>

            {/* Legal & Medical Identifiers */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <DynamicIconAtom name="FileText" className="h-4 w-4 text-gray-500" />
                <TextAtom variant="h3" weight="medium" className="text-gray-700">
                  Legal & Medical Identifiers
                </TextAtom>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <LabelAtom htmlFor="license-number">State License Number</LabelAtom>
                  <InputAtom
                    id="license-number"
                    type="text"
                    value={licenseNumber}
                    onChange={e => setLicenseNumber(e.target.value)}
                    placeholder="HC-2024-001"
                  />
                  <TextAtom variant="small" className="text-gray-500 mt-1">
                    Required for medical records and reports
                  </TextAtom>
                </div>
                <div>
                  <LabelAtom htmlFor="npi-number">NPI Number</LabelAtom>
                  <InputAtom
                    id="npi-number"
                    type="text"
                    value={npiNumber}
                    onChange={e => setNpiNumber(e.target.value)}
                    placeholder="1234567890"
                    maxLength={10}
                  />
                  <TextAtom variant="small" className="text-gray-500 mt-1">
                    National Provider Identifier for billing
                  </TextAtom>
                </div>
              </div>

              <div>
                <LabelAtom htmlFor="tax-id">Tax ID / EIN</LabelAtom>
                <InputAtom
                  id="tax-id"
                  type="text"
                  value={taxId}
                  onChange={e => setTaxId(e.target.value)}
                  placeholder="12-3456789"
                />
                <TextAtom variant="small" className="text-gray-500 mt-1">
                  Employer Identification Number for tax purposes
                </TextAtom>
              </div>
            </div>

            {/* Legacy Address Field (for backward compatibility) */}
            <div className="hidden">
              <LabelAtom htmlFor="facility-address">Facility Address</LabelAtom>
              <InputAtom
                id="facility-address"
                type="text"
                value={facilityAddress}
                onChange={e => setFacilityAddress(e.target.value)}
                placeholder="Enter your facility address"
              />
            </div>
          </div>
        </DashboardCardAtom>

        {/* Admin Security */}
        <DashboardCardAtom>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DynamicIconAtom name="Shield" className="h-5 w-5 text-gray-600" />
                <TextAtom variant="h3" weight="semibold" className="text-gray-900">
                  Admin Security
                </TextAtom>
              </div>

              {/* Dev button to remove password */}
              {hasExistingPassword && process.env.NODE_ENV === 'development' && (
                <ButtonAtom
                  onClick={handleRemovePassword}
                  disabled={isRemovingPassword}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  {isRemovingPassword ? 'Removing...' : 'Remove Password (Dev)'}
                </ButtonAtom>
              )}
            </div>

            {hasExistingPassword ? (
              // Password change form (when password exists)
              <div className="space-y-4">
                <TextAtom variant="small" className="text-gray-600">
                  A master password is currently set. To change it, enter your current password and
                  then set a new one.
                </TextAtom>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <LabelAtom htmlFor="current-password" required>
                      Current Password
                    </LabelAtom>
                    <InputAtom
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    {!currentPasswordValid && currentPassword === '' && (
                      <TextAtom variant="small" className="text-red-500 mt-1">
                        Current password is required to change password
                      </TextAtom>
                    )}
                  </div>

                  <div>
                    <LabelAtom htmlFor="new-password">New Password</LabelAtom>
                    <InputAtom
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <TextAtom variant="small" className="text-gray-500 mt-1">
                      {isChangingPassword
                        ? 'Leave blank to keep current password'
                        : 'Minimum 8 characters'}
                    </TextAtom>
                  </div>

                  <div>
                    <LabelAtom htmlFor="confirm-new-password">Confirm New Password</LabelAtom>
                    <InputAtom
                      id="confirm-new-password"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    {newPassword && confirmPassword && !passwordsMatch && (
                      <TextAtom variant="small" className="text-red-500 mt-1">
                        Passwords do not match
                      </TextAtom>
                    )}
                    {newPassword && confirmPassword && passwordsMatch && passwordValid && (
                      <TextAtom variant="small" className="text-green-600 mt-1">
                        Passwords match ✓
                      </TextAtom>
                    )}
                    {newPassword && !passwordValid && (
                      <TextAtom variant="small" className="text-red-500 mt-1">
                        Password must be at least 8 characters
                      </TextAtom>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Initial password setup form (when no password exists)
              <div className="space-y-4">
                <TextAtom variant="small" className="text-amber-600 bg-amber-50 p-3 rounded-md">
                  ⚠️ No master password is set. Set one to enable CNA account access via master
                  password.
                </TextAtom>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <LabelAtom htmlFor="new-password" required>
                      Master Password
                    </LabelAtom>
                    <InputAtom
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter master password"
                    />
                    <TextAtom variant="small" className="text-gray-500 mt-1">
                      Minimum 8 characters. Used to access any CNA account.
                    </TextAtom>
                  </div>

                  <div>
                    <LabelAtom htmlFor="confirm-new-password" required>
                      Confirm Password
                    </LabelAtom>
                    <InputAtom
                      id="confirm-new-password"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm master password"
                    />
                    {newPassword && confirmPassword && !passwordsMatch && (
                      <TextAtom variant="small" className="text-red-500 mt-1">
                        Passwords do not match
                      </TextAtom>
                    )}
                    {newPassword && confirmPassword && passwordsMatch && passwordValid && (
                      <TextAtom variant="small" className="text-green-600 mt-1">
                        Passwords match ✓
                      </TextAtom>
                    )}
                    {newPassword && !passwordValid && (
                      <TextAtom variant="small" className="text-red-500 mt-1">
                        Password must be at least 8 characters
                      </TextAtom>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DashboardCardAtom>

        {/* Operations */}
        <DashboardCardAtom>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <DynamicIconAtom name="Users" className="h-5 w-5 text-gray-600" />
              <TextAtom variant="h3" weight="semibold" className="text-gray-900">
                Operations
              </TextAtom>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <LabelAtom htmlFor="max-residents">Maximum Residents per CNA</LabelAtom>
                <DropdownAtom
                  value={maxResidentsPerCNA}
                  onValueChange={setMaxResidentsPerCNA}
                  options={maxResidentsOptions}
                  placeholder="Select max residents"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckboxAtom
                    id="shift-alerts"
                    checked={shiftAlerts}
                    onCheckedChange={setShiftAlerts}
                  />
                  <div>
                    <LabelAtom htmlFor="shift-alerts" className="font-medium text-gray-900 mb-0">
                      Shift Change Alerts
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Email notifications for shift changes
                    </TextAtom>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CheckboxAtom
                    id="adl-reminders"
                    checked={adlReminders}
                    onCheckedChange={setAdlReminders}
                  />
                  <div>
                    <LabelAtom htmlFor="adl-reminders" className="font-medium text-gray-900 mb-0">
                      ADL Reminders
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Email alerts for missed or overdue ADL checks
                    </TextAtom>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCardAtom>

        {/* Shift Configuration */}
        <DashboardCardAtom>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <DynamicIconAtom name="Clock" className="h-5 w-5 text-gray-600" />
              <TextAtom variant="h3" weight="semibold" className="text-gray-900">
                Shift Configuration
              </TextAtom>
            </div>
            <ShiftTemplateManagerMolecule />
          </div>
        </DashboardCardAtom>
      </div>
    </AdminPageLayoutTemplate>
  );
}
