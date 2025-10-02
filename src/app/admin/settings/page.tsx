'use client';

import { useState } from 'react';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';

export default function Settings() {
  const [shiftNotifications, setShiftNotifications] = useState(true);
  const [adlAlerts, setAdlAlerts] = useState(true);
  return (
    <div className="mx-auto max-w-7xl">
      <div className="space-y-10 divide-y divide-gray-900/10">
        {/* Facility Settings */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Facility Settings</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Update your facility's basic information and preferences.
            </p>
          </div>

          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="facility-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Facility Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="facility-name"
                      id="facility-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue="SmartChart Pro Facility"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Timezone
                  </label>
                  <div className="mt-2">
                    <select
                      id="timezone"
                      name="timezone"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue="EST"
                    >
                      <option>EST</option>
                      <option>CST</option>
                      <option>MST</option>
                      <option>PST</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Notification Settings
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configure how and when you receive notifications.
            </p>
          </div>

          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="max-w-2xl space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">
                    Email Notifications
                  </legend>
                  <div className="mt-6 space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <CheckboxAtom
                          id="shifts"
                          checked={shiftNotifications}
                          onCheckedChange={setShiftNotifications}
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label htmlFor="shifts" className="font-medium text-gray-900">
                          Shift Changes
                        </label>
                        <p className="text-gray-500">
                          Get notified when CNAs start or end their shifts.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <CheckboxAtom
                          id="adl-alerts"
                          checked={adlAlerts}
                          onCheckedChange={setAdlAlerts}
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label htmlFor="adl-alerts" className="font-medium text-gray-900">
                          ADL Alerts
                        </label>
                        <p className="text-gray-500">
                          Receive alerts for missed or overdue ADL checks.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
