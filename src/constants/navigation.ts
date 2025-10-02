import { Cog6ToothIcon, HomeIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline';

// Admin sidebar navigation
export const ADMIN_NAVIGATION = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Residents', href: '/admin/residents', icon: UserGroupIcon },
  { name: 'CNAs', href: '/admin/cnas', icon: UsersIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
] as const;

export type AdminNavItem = (typeof ADMIN_NAVIGATION)[number];