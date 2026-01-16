'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { TextAtom } from '@/components/atoms/Text.atom';

export function UserMenuMolecule() {
    const { data: session } = useSession();
    const router = useRouter();

    if (!session?.user) {
        return null;
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    const handleChangePassword = () => {
        router.push('/profile/change-password');
    };

    return (
        <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <DynamicIconAtom
                    name={session.user.role === 'ADMIN' ? 'Shield' : 'UserRound'}
                    size="sm"
                    className="text-gray-600"
                />
                <div className="flex flex-col">
                    <TextAtom variant="small" className="font-medium text-gray-900 leading-tight">
                        {session.user.cnaName || session.user.email}
                    </TextAtom>
                    <BadgeAtom
                        variant={session.user.role === 'ADMIN' ? 'info' : 'success'}
                        className="text-xs"
                    >
                        {session.user.role}
                    </BadgeAtom>
                </div>
            </div>

            <ButtonAtom variant="ghost" size="sm" onClick={handleChangePassword}>
                <DynamicIconAtom name="KeyRound" size="sm" className="mr-1" />
                <span className="hidden sm:inline">Password</span>
            </ButtonAtom>

            <ButtonAtom variant="ghost" size="sm" onClick={handleLogout}>
                <DynamicIconAtom name="LogOut" size="sm" className="mr-1" />
                <span className="hidden sm:inline">Logout</span>
            </ButtonAtom>
        </div>
    );
}
