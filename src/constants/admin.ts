import { icons } from 'lucide-react';

// Dashboard statistics
export const DASHBOARD_STATS = [
  { name: 'Total CNAs', value: '12', icon: 'UserRound' as keyof typeof icons },
  { name: 'Active CNAs', value: '8', icon: 'Clock' as keyof typeof icons },
  { name: 'Total Residents', value: '45', icon: 'Users' as keyof typeof icons },
] as const;

// Recent activity data
export const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'shift_start',
    user: 'Sarah Johnson',
    description: 'Completed ADL round',
    timestamp: '2 hours ago',
    status: 'completed',
  },
  {
    id: 2,
    type: 'adl_complete',
    user: 'Michael Chen',
    description: 'Started shift',
    timestamp: '3 hours ago',
    status: 'active',
  },
  {
    id: 3,
    type: 'shift_end',
    user: 'Emily Davis',
    description: 'Updated resident status',
    timestamp: '4 hours ago',
    status: 'completed',
  },
] as const;

// CNA data for admin management
export const CNAS_DATA = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    status: 'active',
    shift: 'Morning',
    residents: 8,
    lastActive: '2 hours ago',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    status: 'active',
    shift: 'Evening',
    residents: 6,
    lastActive: '1 hour ago',
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    status: 'inactive',
    shift: 'Night',
    residents: 0,
    lastActive: '2 days ago',
  },
] as const;

export type DashboardStat = (typeof DASHBOARD_STATS)[number];
export type RecentActivity = (typeof RECENT_ACTIVITY)[number];
export type CNAData = (typeof CNAS_DATA)[number];
