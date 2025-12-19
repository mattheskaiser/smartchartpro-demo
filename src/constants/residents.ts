// Basic resident data for selection screens
export const DUMMY_RESIDENTS = [
  {
    id: '1',
    name: 'Alice Johnson',
    imageUrl: null,
    room: '101',
    status: 'independent' as const,
  },
  {
    id: '2',
    name: 'Bob Smith',
    imageUrl: null,
    room: '102',
    status: 'partial' as const,
  },
  {
    id: '3',
    name: 'Carol Williams',
    imageUrl: null,
    room: '103',
    status: 'full' as const,
  },
  {
    id: '4',
    name: 'David Brown',
    imageUrl: null,
    room: '104',
    status: 'independent' as const,
  },
  {
    id: '5',
    name: 'Emma Davis',
    imageUrl: null,
    room: '105',
    status: 'partial' as const,
  },
  {
    id: '6',
    name: 'Frank Miller',
    imageUrl: null,
    room: '106',
    status: 'independent' as const,
  },
  {
    id: '7',
    name: 'Grace Wilson',
    imageUrl: null,
    room: '107',
    status: 'full' as const,
  },
  {
    id: '8',
    name: 'Henry Taylor',
    imageUrl: null,
    room: '108',
    status: 'partial' as const,
  },
  {
    id: '9',
    name: 'Isabel Anderson',
    imageUrl: null,
    room: '109',
    status: 'independent' as const,
  },
  {
    id: '10',
    name: 'Jack Thomas',
    imageUrl: null,
    room: '110',
    status: 'full' as const,
  },
] as const;

export type Resident = (typeof DUMMY_RESIDENTS)[number];
export type ResidentStatus = Resident['status'];
