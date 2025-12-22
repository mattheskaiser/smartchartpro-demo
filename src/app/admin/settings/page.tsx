'use client';

import { useState } from 'react';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { SelectAtom } from '@/components/atoms/Select.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';

export default function Settings() {
  const [facilityName, setFacilityName] = useState('SmartChart Pro Facility');
  const [timezone, setTimezone] = useState('EST');
  const [shiftNotifications, setShiftNotifications] = useState(true);
  const [adlAlerts, setAdlAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleFacilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <TextAtom variant="h1" weight="bold" className="text-gray-900">
            Settings
          </TextAtom>
          <TextAtom variant="body" className="text-gray-600 mt-2">
            Manage your facility settings and notification preferences.
          </TextAtom>
        </div>

        {/* Facility Settings */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-3">
          <div>
            <TextAtom variant="h2" weight="semibold" className="text-gray-900">
              Facility Settings
            </TextAtom>
            <TextAtom variant="body" className="text-gray-600 mt-2">
              Update your facility's basic information and preferences.
            </TextAtom>
          </div>

          <div className="lg:col-span-2">
            <CardAtom>
              <form onSubmit={handleFacilitySubmit}>
                <div className="space-y-6">
                  <div>
                    <LabelAtom htmlFor="facility-name" required>
                      Facility Name
                    </LabelAtom>
                    <InputAtom
                      id="facility-name"
                      name="facility-name"
                      type="text"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      placeholder="Enter facility name"
                    />
                  </div>

                  <div>
                    <LabelAtom htmlFor="timezone" required>
                      Timezone
                    </LabelAtom>
                    <SelectAtom
                      id="timezone"
                      name="timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="EST">Eastern Standard Time (EST)</option>
                      <option value="CST">Central Standard Time (CST)</option>
                      <option value="MST">Mountain Standard Time (MST)</option>
                      <option value="PST">Pacific Standard Time (PST)</option>
                    </SelectAtom>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                  <ButtonAtom
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    loadingText="Saving..."
                  >
                    Save Changes
                  </ButtonAtom>
                </div>
              </form>
            </CardAtom>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-3">
          <div>
            <TextAtom variant="h2" weight="semibold" className="text-gray-900">
              Notification Settings
            </TextAtom>
            <TextAtom variant="body" className="text-gray-600 mt-2">
              Configure how and when you receive notifications.
            </TextAtom>
          </div>

          <div className="lg:col-span-2">
            <CardAtom>
              <form onSubmit={handleNotificationSubmit}>
                <div className="space-y-6">
                  <fieldset>
                    <legend className="text-sm font-semibold text-gray-900 mb-4">
                      Email Notifications
                    </legend>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center h-6">
                          <CheckboxAtom
                            id="shifts"
                            checked={shiftNotifications}
                            onCheckedChange={setShiftNotifications}
                          />
                        </div>
                        <div className="flex-1">
                          <LabelAtom htmlFor="shifts" className="font-medium text-gray-900 mb-0">
                            Shift Changes
                          </LabelAtom>
                          <TextAtom variant="small" className="text-gray-500">
                            Get notified when CNAs start or end their shifts.
                          </TextAtom>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex items-center h-6">
                          <CheckboxAtom
                            id="adl-alerts"
                            checked={adlAlerts}
                            onCheckedChange={setAdlAlerts}
                          />
                        </div>
                        <div className="flex-1">
                          <LabelAtom htmlFor="adl-alerts" className="font-medium text-gray-900 mb-0">
                            ADL Alerts
                          </LabelAtom>
                          <TextAtom variant="small" className="text-gray-500">
                            Receive alerts for missed or overdue ADL checks.
                          </TextAtom>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                  <ButtonAtom
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    loadingText="Saving..."
                  >
                    Save Changes
                  </ButtonAtom>
                </div>
              </form>
            </CardAtom>
          </div>
        </div>
      </div>
    </div>
  );
}
