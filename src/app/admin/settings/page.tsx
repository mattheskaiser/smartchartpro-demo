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
import { toast } from '@/lib/toast';

type SettingsData = {
  facilityName: string;
  facilityAddress: string;
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
  const [adminEmail, setAdminEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [maxResidentsPerCNA, setMaxResidentsPerCNA] = useState('8');
  const [shiftAlerts, setShiftAlerts] = useState(true);
  const [adlReminders, setAdlReminders] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Password validation
  const passwordsMatch = masterPassword === confirmPassword;
  const passwordValid = masterPassword.length >= 8;
  const hasExistingPassword = masterPassword === '********'; // Indicates existing password
  const isChangingPassword = masterPassword !== '********' && masterPassword !== '';
  const canSave = facilityName && adminEmail && (hasExistingPassword || (isChangingPassword && passwordsMatch && passwordValid));

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
          setAdminEmail(data.adminEmail || '');
          // Handle existing password (shown as *******)
          if (data.masterPassword === '********') {
            setMasterPassword('********');
            setConfirmPassword('********');
          } else {
            setMasterPassword(data.masterPassword || '');
            setConfirmPassword(data.masterPassword || '');
          }
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

  const handleSave = async () => {
    if (!canSave) return;

    setIsSaving(true);
    try {
      const settingsData: SettingsData = {
        facilityName,
        facilityAddress,
        adminEmail,
        masterPassword: masterPassword === '********' ? '' : masterPassword, // Don't send masked password
        maxResidentsPerCNA,
        shiftAlerts,
        adlReminders,
      };

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });

      if (response.ok) {
        toast({
          title: 'Settings saved',
          description: 'Your settings have been saved successfully',
          type: 'success',
        });

        // If password was updated, show it as masked
        if (masterPassword !== '********' && masterPassword) {
          setMasterPassword('********');
          setConfirmPassword('********');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'There was an error saving your settings. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPageLayoutTemplate
        title="Settings"
        subtitle="Configure essential settings to get your facility up and running."
      >
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <DashboardCardAtom key={index}>
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </DashboardCardAtom>
          ))}
        </div>
      </AdminPageLayoutTemplate>
    );
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

            <div>
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
            <div className="flex items-center gap-2">
              <DynamicIconAtom name="Shield" className="h-5 w-5 text-gray-600" />
              <TextAtom variant="h3" weight="semibold" className="text-gray-900">
                Admin Security
              </TextAtom>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <LabelAtom htmlFor="master-password" required>
                  Master Password for CNA Accounts
                </LabelAtom>
                <InputAtom
                  id="master-password"
                  type="password"
                  value={masterPassword}
                  onChange={e => {
                    const newValue = e.target.value;
                    setMasterPassword(newValue);
                    // Clear confirm password when changing from masked state
                    if (masterPassword === '********' && newValue !== '********') {
                      setConfirmPassword('');
                    }
                  }}
                  placeholder={masterPassword === '********' ? 'Leave blank to keep current password' : 'Enter master password'}
                />
                <TextAtom variant="small" className="text-gray-500 mt-1">
                  {masterPassword === '********'
                    ? 'Password is set. Enter a new password to change it (minimum 8 characters).'
                    : 'Minimum 8 characters. Used to access any CNA account.'
                  }
                </TextAtom>
              </div>
              <div>
                <LabelAtom htmlFor="confirm-password" required>
                  Confirm Master Password
                </LabelAtom>
                <InputAtom
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder={masterPassword === '********' ? 'Leave blank to keep current password' : 'Confirm master password'}
                />
                {confirmPassword && confirmPassword !== '********' && !passwordsMatch && (
                  <TextAtom variant="small" className="text-red-500 mt-1">
                    Passwords do not match
                  </TextAtom>
                )}
                {confirmPassword && confirmPassword !== '********' && passwordsMatch && passwordValid && (
                  <TextAtom variant="small" className="text-green-600 mt-1">
                    Passwords match ✓
                  </TextAtom>
                )}
                {masterPassword && masterPassword !== '********' && !passwordValid && (
                  <TextAtom variant="small" className="text-red-500 mt-1">
                    Password must be at least 8 characters
                  </TextAtom>
                )}
              </div>
            </div>
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