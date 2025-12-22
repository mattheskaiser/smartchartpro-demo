'use client';

import { useState } from 'react';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { SelectAtom } from '@/components/atoms/Select.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';

export default function Settings() {
  // Facility Settings
  const [facilityName, setFacilityName] = useState('SmartChart Pro Facility');
  const [facilityAddress, setFacilityAddress] = useState('123 Healthcare Ave, Medical City, MC 12345');
  const [facilityPhone, setFacilityPhone] = useState('(555) 123-4567');
  const [timezone, setTimezone] = useState('EST');
  const [licenseNumber, setLicenseNumber] = useState('HC-2024-001');

  // Notification Settings
  const [shiftNotifications, setShiftNotifications] = useState(true);
  const [adlAlerts, setAdlAlerts] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [reportNotifications, setReportNotifications] = useState(false);

  // Security Settings
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [auditLogging, setAuditLogging] = useState(true);

  // System Settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [dataRetention, setDataRetention] = useState('7');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // CNA Management Settings
  const [maxResidentsPerCNA, setMaxResidentsPerCNA] = useState('8');
  const [shiftOverlapTime, setShiftOverlapTime] = useState('15');
  const [autoAssignResidents, setAutoAssignResidents] = useState(false);

  // ADL & Care Settings
  const [adlReminderInterval, setAdlReminderInterval] = useState('2');
  const [requireAdlNotes, setRequireAdlNotes] = useState(true);
  const [autoMarkOverdue, setAutoMarkOverdue] = useState(true);
  const [adlCompletionWindow, setAdlCompletionWindow] = useState('4');

  // Reporting Settings
  const [reportingFrequency, setReportingFrequency] = useState('weekly');
  const [includePhotos, setIncludePhotos] = useState(false);
  const [autoGenerateReports, setAutoGenerateReports] = useState(true);
  const [reportRecipients, setReportRecipients] = useState('admin@facility.com');

  // Compliance Settings
  const [hipaaLogging, setHipaaLogging] = useState(true);
  const [requireDigitalSignatures, setRequireDigitalSignatures] = useState(false);
  const [medicationDoubleCheck, setMedicationDoubleCheck] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
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
            Manage your facility settings, security preferences, and system configuration.
          </TextAtom>
        </div>

        {/* Facility Information */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            Facility Information
          </TextAtom>
          <CardAtom>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <LabelAtom htmlFor="facility-name" required>
                    Facility Name
                  </LabelAtom>
                  <InputAtom
                    id="facility-name"
                    type="text"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="Enter facility name"
                  />
                </div>
                <div>
                  <LabelAtom htmlFor="license-number" required>
                    License Number
                  </LabelAtom>
                  <InputAtom
                    id="license-number"
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="Enter license number"
                  />
                </div>
              </div>

              <div>
                <LabelAtom htmlFor="facility-address">
                  Facility Address
                </LabelAtom>
                <InputAtom
                  id="facility-address"
                  type="text"
                  value={facilityAddress}
                  onChange={(e) => setFacilityAddress(e.target.value)}
                  placeholder="Enter complete address"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <LabelAtom htmlFor="facility-phone">
                    Phone Number
                  </LabelAtom>
                  <InputAtom
                    id="facility-phone"
                    type="tel"
                    value={facilityPhone}
                    onChange={(e) => setFacilityPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <LabelAtom htmlFor="timezone" required>
                    Timezone
                  </LabelAtom>
                  <SelectAtom
                    id="timezone"
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
            </div>
          </CardAtom>
        </div>

        {/* CNA Management */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            CNA Management
          </TextAtom>
          <CardAtom>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <LabelAtom htmlFor="max-residents">
                    Maximum Residents per CNA
                  </LabelAtom>
                  <SelectAtom
                    id="max-residents"
                    value={maxResidentsPerCNA}
                    onChange={(e) => setMaxResidentsPerCNA(e.target.value)}
                  >
                    <option value="6">6 Residents</option>
                    <option value="8">8 Residents</option>
                    <option value="10">10 Residents</option>
                    <option value="12">12 Residents</option>
                  </SelectAtom>
                </div>
                <div>
                  <LabelAtom htmlFor="shift-overlap">
                    Shift Overlap Time (minutes)
                  </LabelAtom>
                  <SelectAtom
                    id="shift-overlap"
                    value={shiftOverlapTime}
                    onChange={(e) => setShiftOverlapTime(e.target.value)}
                  >
                    <option value="0">No Overlap</option>
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                  </SelectAtom>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center h-6">
                  <CheckboxAtom
                    id="auto-assign"
                    checked={autoAssignResidents}
                    onCheckedChange={setAutoAssignResidents}
                  />
                </div>
                <div className="flex-1">
                  <LabelAtom htmlFor="auto-assign" className="font-medium text-gray-900 mb-0">
                    Auto-assign Residents
                  </LabelAtom>
                  <TextAtom variant="small" className="text-gray-500">
                    Automatically assign new residents to CNAs based on workload and shift.
                  </TextAtom>
                </div>
              </div>
            </div>
          </CardAtom>
        </div>

        {/* ADL & Care Settings */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            ADL & Care Management
          </TextAtom>
          <CardAtom>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <LabelAtom htmlFor="adl-reminder">
                    ADL Reminder Interval (hours)
                  </LabelAtom>
                  <SelectAtom
                    id="adl-reminder"
                    value={adlReminderInterval}
                    onChange={(e) => setAdlReminderInterval(e.target.value)}
                  >
                    <option value="1">Every Hour</option>
                    <option value="2">Every 2 Hours</option>
                    <option value="3">Every 3 Hours</option>
                    <option value="4">Every 4 Hours</option>
                  </SelectAtom>
                </div>
                <div>
                  <LabelAtom htmlFor="completion-window">
                    ADL Completion Window (hours)
                  </LabelAtom>
                  <SelectAtom
                    id="completion-window"
                    value={adlCompletionWindow}
                    onChange={(e) => setAdlCompletionWindow(e.target.value)}
                  >
                    <option value="2">2 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="6">6 Hours</option>
                    <option value="8">8 Hours</option>
                  </SelectAtom>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="require-notes"
                      checked={requireAdlNotes}
                      onCheckedChange={setRequireAdlNotes}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="require-notes" className="font-medium text-gray-900 mb-0">
                      Require Notes for ADL Completion
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      CNAs must add notes when completing ADL activities.
                    </TextAtom>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="auto-overdue"
                      checked={autoMarkOverdue}
                      onCheckedChange={setAutoMarkOverdue}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="auto-overdue" className="font-medium text-gray-900 mb-0">
                      Auto-mark Overdue ADLs
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Automatically flag ADL activities that exceed the completion window.
                    </TextAtom>
                  </div>
                </div>
              </div>
            </div>
          </CardAtom>
        </div>

        {/* Reporting Settings */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            Reporting & Documentation
          </TextAtom>
          <CardAtom>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <LabelAtom htmlFor="report-frequency">
                    Report Generation Frequency
                  </LabelAtom>
                  <SelectAtom
                    id="report-frequency"
                    value={reportingFrequency}
                    onChange={(e) => setReportingFrequency(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </SelectAtom>
                </div>
                <div>
                  <LabelAtom htmlFor="report-recipients">
                    Report Recipients (Email)
                  </LabelAtom>
                  <InputAtom
                    id="report-recipients"
                    type="email"
                    value={reportRecipients}
                    onChange={(e) => setReportRecipients(e.target.value)}
                    placeholder="admin@facility.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="auto-reports"
                      checked={autoGenerateReports}
                      onCheckedChange={setAutoGenerateReports}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="auto-reports" className="font-medium text-gray-900 mb-0">
                      Auto-generate Reports
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Automatically generate and email reports based on the schedule above.
                    </TextAtom>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="include-photos"
                      checked={includePhotos}
                      onCheckedChange={setIncludePhotos}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="include-photos" className="font-medium text-gray-900 mb-0">
                      Include Photos in Reports
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Include resident and CNA profile photos in generated reports.
                    </TextAtom>
                  </div>
                </div>
              </div>
            </div>
          </CardAtom>
        </div>

        {/* Compliance Settings */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            Compliance & Regulations
          </TextAtom>
          <CardAtom>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="hipaa-logging"
                      checked={hipaaLogging}
                      onCheckedChange={setHipaaLogging}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="hipaa-logging" className="font-medium text-gray-900 mb-0">
                      HIPAA Compliance Logging
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Log all access to protected health information for HIPAA compliance.
                    </TextAtom>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="digital-signatures"
                      checked={requireDigitalSignatures}
                      onCheckedChange={setRequireDigitalSignatures}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="digital-signatures" className="font-medium text-gray-900 mb-0">
                      Require Digital Signatures
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Require CNAs to digitally sign off on completed care activities.
                    </TextAtom>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="medication-double-check"
                      checked={medicationDoubleCheck}
                      onCheckedChange={setMedicationDoubleCheck}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="medication-double-check" className="font-medium text-gray-900 mb-0">
                      Medication Double-Check
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Require two staff members to verify medication administration.
                    </TextAtom>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <DynamicIconAtom name="Info" className="h-5 w-5 text-blue-400" />
                  <div className="ml-3">
                    <TextAtom variant="small" className="text-blue-800">
                      <strong>Note:</strong> These compliance settings help meet regulatory requirements. Consult with your compliance officer before making changes.
                    </TextAtom>
                  </div>
                </div>
              </div>
            </div>
          </CardAtom>
        </div>

        {/* Notification Settings */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            Notification Settings
          </TextAtom>
          <CardAtom>
            <div className="space-y-6">
              <fieldset>
                <legend className="text-sm font-semibold text-gray-900 mb-4">
                  Email & Alert Preferences
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

                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-6">
                      <CheckboxAtom
                        id="medication-reminders"
                        checked={medicationReminders}
                        onCheckedChange={setMedicationReminders}
                      />
                    </div>
                    <div className="flex-1">
                      <LabelAtom htmlFor="medication-reminders" className="font-medium text-gray-900 mb-0">
                        Medication Reminders
                      </LabelAtom>
                      <TextAtom variant="small" className="text-gray-500">
                        Get reminders for medication administration times.
                      </TextAtom>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-6">
                      <CheckboxAtom
                        id="emergency-alerts"
                        checked={emergencyAlerts}
                        onCheckedChange={setEmergencyAlerts}
                      />
                    </div>
                    <div className="flex-1">
                      <LabelAtom htmlFor="emergency-alerts" className="font-medium text-gray-900 mb-0">
                        Emergency Alerts
                      </LabelAtom>
                      <TextAtom variant="small" className="text-gray-500">
                        Immediate notifications for emergency situations.
                      </TextAtom>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-6">
                      <CheckboxAtom
                        id="report-notifications"
                        checked={reportNotifications}
                        onCheckedChange={setReportNotifications}
                      />
                    </div>
                    <div className="flex-1">
                      <LabelAtom htmlFor="report-notifications" className="font-medium text-gray-900 mb-0">
                        Daily Reports
                      </LabelAtom>
                      <TextAtom variant="small" className="text-gray-500">
                        Receive daily summary reports via email.
                      </TextAtom>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </CardAtom>
        </div>

        {/* Security Settings */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            Security & Access
          </TextAtom>
          <CardAtom>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <LabelAtom htmlFor="session-timeout">
                    Session Timeout (minutes)
                  </LabelAtom>
                  <SelectAtom
                    id="session-timeout"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="120">2 Hours</option>
                  </SelectAtom>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="password-change"
                      checked={requirePasswordChange}
                      onCheckedChange={setRequirePasswordChange}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="password-change" className="font-medium text-gray-900 mb-0">
                      Require Regular Password Changes
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Force users to change passwords every 90 days.
                    </TextAtom>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="two-factor"
                      checked={twoFactorAuth}
                      onCheckedChange={setTwoFactorAuth}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="two-factor" className="font-medium text-gray-900 mb-0">
                      Two-Factor Authentication
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Require additional verification for login.
                    </TextAtom>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="audit-logging"
                      checked={auditLogging}
                      onCheckedChange={setAuditLogging}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="audit-logging" className="font-medium text-gray-900 mb-0">
                      Audit Logging
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Log all user actions for compliance and security.
                    </TextAtom>
                  </div>
                </div>
              </div>
            </div>
          </CardAtom>
        </div>

        {/* System Settings */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            System Configuration
          </TextAtom>
          <CardAtom>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <LabelAtom htmlFor="backup-frequency">
                    Backup Frequency
                  </LabelAtom>
                  <SelectAtom
                    id="backup-frequency"
                    value={backupFrequency}
                    onChange={(e) => setBackupFrequency(e.target.value)}
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </SelectAtom>
                </div>
                <div>
                  <LabelAtom htmlFor="data-retention">
                    Data Retention (years)
                  </LabelAtom>
                  <SelectAtom
                    id="data-retention"
                    value={dataRetention}
                    onChange={(e) => setDataRetention(e.target.value)}
                  >
                    <option value="5">5 Years</option>
                    <option value="7">7 Years</option>
                    <option value="10">10 Years</option>
                    <option value="indefinite">Indefinite</option>
                  </SelectAtom>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="auto-backup"
                      checked={autoBackup}
                      onCheckedChange={setAutoBackup}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="auto-backup" className="font-medium text-gray-900 mb-0">
                      Automatic Backups
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Automatically backup data according to the schedule above.
                    </TextAtom>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center h-6">
                    <CheckboxAtom
                      id="maintenance-mode"
                      checked={maintenanceMode}
                      onCheckedChange={setMaintenanceMode}
                    />
                  </div>
                  <div className="flex-1">
                    <LabelAtom htmlFor="maintenance-mode" className="font-medium text-gray-900 mb-0">
                      Maintenance Mode
                    </LabelAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Temporarily disable access for system maintenance.
                    </TextAtom>
                  </div>
                </div>
              </div>

              {maintenanceMode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <DynamicIconAtom name="TriangleAlert" className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <TextAtom variant="small" className="text-yellow-800">
                        <strong>Warning:</strong> Maintenance mode will prevent all users from accessing the system.
                      </TextAtom>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardAtom>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <ButtonAtom
            variant="primary"
            size="lg"
            onClick={handleSave}
            isLoading={isSaving}
            loadingText="Saving Settings..."
          >
            Save All Settings
          </ButtonAtom>
        </div>
      </div>
    </div>
  );
}
