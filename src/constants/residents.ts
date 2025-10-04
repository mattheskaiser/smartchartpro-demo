// Basic resident data for selection screens
export const DUMMY_RESIDENTS = [
  {
    id: '1',
    name: 'Alice Johnson',
    imageUrl: 'https://i.pravatar.cc/150?img=1',
    room: '101',
    status: 'independent' as const,
  },
  {
    id: '2',
    name: 'Bob Smith',
    imageUrl: 'https://i.pravatar.cc/150?img=2',
    room: '102',
    status: 'partial' as const,
  },
  {
    id: '3',
    name: 'Carol Williams',
    imageUrl: 'https://i.pravatar.cc/150?img=3',
    room: '103',
    status: 'full' as const,
  },
  {
    id: '4',
    name: 'David Brown',
    imageUrl: 'https://i.pravatar.cc/150?img=4',
    room: '104',
    status: 'independent' as const,
  },
  {
    id: '5',
    name: 'Emma Davis',
    imageUrl: 'https://i.pravatar.cc/150?img=5',
    room: '105',
    status: 'partial' as const,
  },
  {
    id: '6',
    name: 'Frank Miller',
    imageUrl: 'https://i.pravatar.cc/150?img=6',
    room: '106',
    status: 'independent' as const,
  },
  {
    id: '7',
    name: 'Grace Wilson',
    imageUrl: 'https://i.pravatar.cc/150?img=7',
    room: '107',
    status: 'full' as const,
  },
  {
    id: '8',
    name: 'Henry Taylor',
    imageUrl: 'https://i.pravatar.cc/150?img=8',
    room: '108',
    status: 'partial' as const,
  },
  {
    id: '9',
    name: 'Isabel Anderson',
    imageUrl: 'https://i.pravatar.cc/150?img=9',
    room: '109',
    status: 'independent' as const,
  },
  {
    id: '10',
    name: 'Jack Thomas',
    imageUrl: 'https://i.pravatar.cc/150?img=10',
    room: '110',
    status: 'full' as const,
  },
] as const;

export type Resident = (typeof DUMMY_RESIDENTS)[number];
export type ResidentStatus = Resident['status'];
