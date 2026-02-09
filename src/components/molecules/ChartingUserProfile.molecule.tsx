'use client';

import { useSession, signOut } from 'next-auth/react';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { useEffect } from 'react';

export function ChartingUserProfileMolecule() {
  const { data: session, status } = useSession();

  // Debug: Log session data
  useEffect(() => {
    if (session) {
      console.log('Session data:', session);
      console.log('User data:', session.user);
      console.log('CNA Image Data:', session.user?.cnaImageData);
    }
  }, [session]);

  // Show skeleton while loading
  if (status === 'loading' || !session?.user) {
    return (
      <div className="flex items-center space-x-3">
        <AvatarAtom src={undefined} alt="Loading..." size="sm" showSkeleton={true} />
        <div className="flex flex-col space-y-1">
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  // Get the avatar source - could be imageData or imageUrl
  const avatarSrc = session.user.cnaImageData || undefined;
  console.log('Avatar src being used:', avatarSrc);

  return (
    <div className="flex items-center space-x-3">
      {/* Avatar on the left */}
      <AvatarAtom
        src={avatarSrc}
        alt={session.user.cnaName || session.user.email || 'User'}
        size="sm"
      />

      {/* Name and logout button stacked on the right */}
      <div className="flex flex-col space-y-1">
        <TextAtom variant="small" className="font-medium text-gray-900 leading-tight">
          {session.user.cnaName || session.user.email}
        </TextAtom>
        <ButtonAtom
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-xs h-6 px-2 justify-start border-red-500 text-red-600 hover:bg-red-50"
        >
          <DynamicIconAtom name="LogOut" size="sm" className="mr-1" />
          Logout
        </ButtonAtom>
      </div>
    </div>
  );
}
