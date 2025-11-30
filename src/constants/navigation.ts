import { ChartBarIcon, Cog6ToothIcon, HomeIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline';

// Admin sidebar navigation
export const ADMIN_NAVIGATION = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Residents', href: '/admin/residents', icon: UserGroupIcon },
  { name: 'CNAs', href: '/admin/cnas', icon: UsersIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
] as const;

// Bottom navigation item for charting workflow
export const ADMIN_BOTTOM_NAVIGATION = [
  { name: 'Start Charting', href: '/start', icon: ChartBarIcon },
] as const;

export type AdminNavItem = (typeof ADMIN_NAVIGATION)[number];
export type AdminBottomNavItem = (typeof ADMIN_BOTTOM_NAVIGATION)[number];
