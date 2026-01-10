import { icons } from 'lucide-react';

// Admin sidebar navigation
export const ADMIN_NAVIGATION = [
  { name: 'Dashboard', href: '/admin', icon: 'House' as keyof typeof icons },
  { name: 'Residents', href: '/admin/residents', icon: 'Users' as keyof typeof icons },
  { name: 'CNAs', href: '/admin/cnas', icon: 'UserRound' as keyof typeof icons },
  { name: 'Shifts', href: '/admin/shifts', icon: 'Calendar' as keyof typeof icons },
  { name: 'Settings', href: '/admin/settings', icon: 'Settings' as keyof typeof icons },
] as const;

// Bottom navigation item for charting workflow
export const ADMIN_BOTTOM_NAVIGATION = [
  { name: 'Start Charting', href: '/charting/start', icon: 'Hospital' as keyof typeof icons },
] as const;

export type AdminNavItem = (typeof ADMIN_NAVIGATION)[number];
export type AdminBottomNavItem = (typeof ADMIN_BOTTOM_NAVIGATION)[number];
