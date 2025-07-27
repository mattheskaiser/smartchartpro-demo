"use client";
import { PlusIcon } from '@heroicons/react/20/solid';
import { Badge } from '@/components/atoms/Badge';
import { Avatar } from '@/components/atoms/Avatar';
import { useState } from 'react';

const residents = [
  {
    id: 1,
    name: 'Alice Thompson',
    imageUrl: '/placeholder.jpg',
    room: '101',
    status: 'independent',
    lastADL: '1 hour ago',
    assignedCNA: 'Sarah Johnson',
  },
  {
    id: 2,
    name: 'Robert Wilson',
    imageUrl: '/placeholder.jpg',
    room: '102',
    status: 'partial',
    lastADL: '2 hours ago',
    assignedCNA: 'Michael Chen',
  },
  {
    id: 3,
    name: 'Mary Davis',
    imageUrl: '/placeholder.jpg',
    room: '103',
    status: 'full',
    lastADL: '30 minutes ago',
    assignedCNA: 'Emily Davis',
  },
];

const adlOptions = [
  'bathing',
  'dressing',
  'eating',
  'toileting',
  'mobility',
  'health',
];

export default function ResidentManagement() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    room: '',
    status: 'independent',
    adls: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdlChange = (adl: string) => {
    setForm((prev) => ({
      ...prev,
      adls: prev.adls.includes(adl)
        ? prev.adls.filter((a) => a !== adl)
        : [...prev.adls, adl],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would add the resident to your backend or state
    setShowModal(false);
    setForm({ name: '', room: '', status: 'independent', adls: [] });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Resident Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage residents, their care levels, and CNA assignments
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Resident
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">Add Resident</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room</label>
                <input
                  type="text"
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="independent">Independent</option>
                  <option value="partial">Partial</option>
                  <option value="full">Full</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ADLs</label>
                <div className="flex flex-wrap gap-2">
                  {adlOptions.map((adl) => (
                    <label key={adl} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={form.adls.includes(adl)}
                        onChange={() => handleAdlChange(adl)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      {adl.charAt(0).toUpperCase() + adl.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resident List */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Resident
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Room
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Last ADL
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Assigned CNA
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {residents.map((resident) => (
                    <tr key={resident.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Avatar src={resident.imageUrl} alt={resident.name} />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{resident.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {resident.room}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <Badge variant={resident.status as 'info' | 'warning' | 'success'}>
                          {resident.status}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {resident.lastADL}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {resident.assignedCNA}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <span className="mx-2 text-gray-300">|</span>
                        <button className="text-indigo-600 hover:text-indigo-900">View ADLs</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 