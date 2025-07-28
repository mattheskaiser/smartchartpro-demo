'use client';
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { Cog6ToothIcon, HomeIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline';

const sidebarNavigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Residents', href: '/admin/residents', icon: UserGroupIcon },
  { name: 'CNA Management', href: '/admin/cnas', icon: UsersIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export const AdminSidebarMolecule = () => {
  const pathname = usePathname();

  const isActiveItem = (href: string) => {
    // Exact match for dashboard (just /admin)
    if (href === '/admin') {
      return pathname === '/admin';
    }
    // For other routes, check if pathname starts with the href
    return pathname.startsWith(href);
  };

  return (
    <div className="hidden w-64 bg-white shadow-sm md:block rounded-2xl">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Admin Portal</h1>
      </div>
      <nav className="mt-5 px-2">
        {sidebarNavigation.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors duration-150 ease-in-out my-1',
              isActiveItem(item.href)
                ? 'bg-blue-100 text-blue-700 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon
              className={clsx(
                'mr-3 h-5 w-5',
                isActiveItem(item.href) ? 'text-blue-700' : 'text-gray-400'
              )}
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
