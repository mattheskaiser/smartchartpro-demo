'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ADMIN_NAVIGATION, ADMIN_BOTTOM_NAVIGATION } from '@/constants/navigation';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';

export const AdminSidebarMolecule = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
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

          {/* User Info */}
          {session?.user && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center space-x-3 px-2 py-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <DynamicIconAtom name="Shield" size="sm" className="text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <TextAtom variant="small" className="font-medium text-gray-900 truncate">
                    {session.user.email}
                  </TextAtom>
                  <BadgeAtom variant="info" className="text-xs mt-1">
                    {session.user.role}
                  </BadgeAtom>
                </div>
              </div>

              <ButtonAtom
                variant="ghost"
                className="w-full mt-2 justify-start"
                onClick={handleLogout}
              >
                <DynamicIconAtom name="LogOut" size="sm" className="mr-3" />
                Logout
              </ButtonAtom>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
