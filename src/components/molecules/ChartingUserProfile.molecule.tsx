'use client';

import { useSession, signOut } from 'next-auth/react';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';

export function ChartingUserProfileMolecule() {
    const { data: session } = useSession();

    if (!session?.user) {
        return null;
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <div className="flex items-center space-x-3 px-3 py-2 bg-gray-100 rounded-lg">
            {/* Avatar on the left */}
            <AvatarAtom
                src={undefined}
                alt={session.user.cnaName || session.user.email || 'User'}
                size="md"
            />

            {/* Name and logout button stacked on the right */}
            <div className="flex flex-col space-y-1">
                <TextAtom variant="small" className="font-medium text-gray-900 leading-tight">
                    {session.user.cnaName || session.user.email}
                </TextAtom>
                <ButtonAtom
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-xs h-6 px-2 justify-start"
                >
                    <DynamicIconAtom name="LogOut" size="sm" className="mr-1" />
                    Logout
                </ButtonAtom>
            </div>
        </div>
    );
}
