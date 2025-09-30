'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { 
  Cog6ToothIcon, 
  HomeIcon, 
  UserGroupIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Residents', href: '/admin/residents', icon: UserGroupIcon },
  { name: 'CNA Management', href: '/admin/cnas', icon: UsersIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export const AdminSidebarMolecule = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Admin Portal</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              isActive(item.href)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon
              className={clsx(
                'mr-3 h-5 w-5',
                isActive(item.href) ? 'text-blue-700' : 'text-gray-400'
              )}
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};