'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { ADMIN_NAVIGATION, ADMIN_BOTTOM_NAVIGATION } from '@/constants/navigation';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';

export const AdminSidebarMolecule = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-xl">
      <nav className="flex flex-col h-full p-4">
        <div className="space-y-2">
          {ADMIN_NAVIGATION.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center p-2 text-sm font-medium rounded-md group',
                isActive(item.href)
                  ? 'bg-secondary text-primary'
                  : 'text-lightGray hover:bg-gray-50 hover:text-darkGray'
              )}
            >
              <DynamicIconAtom
                name={item.icon}
                size="sm"
                className={clsx(
                  'mr-3 group-hover:text-darkGray',
                  isActive(item.href) ? 'text-primary group-hover:text-primary' : 'text-lightGray'
                )}
              />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t space-y-2">
          {ADMIN_BOTTOM_NAVIGATION.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center p-2 text-sm font-medium rounded-md group',
                isActive(item.href)
                  ? 'bg-secondary text-primary'
                  : 'text-lightGray hover:bg-gray-50 hover:text-darkGray'
              )}
            >
              <DynamicIconAtom
                name={item.icon}
                size="sm"
                className={clsx(
                  'mr-3 group-hover:text-darkGray',
                  isActive(item.href) ? 'text-primary group-hover:text-primary' : 'text-lightGray'
                )}
              />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};
