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

// Extended resident data for admin management
export const ADMIN_RESIDENTS = [
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

// Detailed resident data for resident detail page
export const MOCK_RESIDENT_DETAIL = {
  id: 1,
  name: 'Alice Thompson',
  imageUrl: '/placeholder.jpg',
  room: '101',
  status: 'independent',
  lastADL: '1 hour ago',
  assignedCNA: 'Sarah Johnson',
  dateOfBirth: '1945-03-15',
  admissionDate: '2023-01-15',
  emergencyContact: {
    name: 'John Thompson',
    relationship: 'Son',
    phone: '(555) 123-4567',
  },
  dnrStatus: {
    hasDNR: true,
    hasDNI: false,
    dnrDate: '2023-02-15',
    dniDate: undefined,
    physicianName: 'Dr. Sarah Mitchell',
    notes: 'DNR order signed by patient and family',
  },
  specialists: [
    {
      id: '1',
      name: 'Dr. Sarah Mitchell',
      specialty: 'primary-care',
      phone: '(555) 234-5678',
      email: 'sarah.mitchell@healthcenter.com',
      notes: 'Primary care physician, sees patient monthly',
    },
    {
      id: '2',
      name: 'Dr. Robert Chen',
      specialty: 'cardiologist',
      phone: '(555) 345-6789',
      email: 'robert.chen@cardiology.com',
      notes: 'Manages hypertension and heart health',
    },
  ],
  medicalInfo: {
    allergies: [
      { id: '1', name: 'Penicillin', severity: 'severe' as const, reaction: 'Anaphylaxis' },
      { id: '2', name: 'Shellfish', severity: 'moderate' as const, reaction: 'Hives and swelling' },
    ],
    conditions: [
      {
        id: '1',
        name: 'Diabetes Type 2',
        diagnosedDate: '2018-03-15',
        status: 'managed' as const,
        notes: 'Well controlled with medication',
      },
      {
        id: '2',
        name: 'Hypertension',
        diagnosedDate: '2020-07-22',
        status: 'active' as const,
        notes: 'Monitoring blood pressure daily',
      },
    ],
    medications: [
      {
        id: '1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        instructions: 'Take in the morning with water',
        startDate: '2020-07-22',
        status: 'current' as const,
      },
      {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        instructions: 'Take with meals to reduce stomach upset',
        startDate: '2018-03-15',
        status: 'current' as const,
      },
      {
        id: '3',
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        instructions: 'Take with food',
        startDate: '2019-01-10',
        endDate: '2023-06-15',
        status: 'past' as const,
        discontinuedReason: 'Stomach irritation',
      },
    ],
  },
  adlNeeds: ['bathing', 'dressing', 'mobility'],
  notes:
    'Patient prefers morning care routine. Needs assistance with mobility due to recent hip surgery.',
};

export type Resident = (typeof DUMMY_RESIDENTS)[number];
export type ResidentStatus = Resident['status'];
