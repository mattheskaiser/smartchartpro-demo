import { PlusIcon } from '@heroicons/react/20/solid';
import { Badge } from '@/components/atoms/Badge';
import { Avatar } from '@/components/atoms/Avatar';

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

export default function ResidentManagement() {
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
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Resident
          </button>
        </div>
      </div>

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