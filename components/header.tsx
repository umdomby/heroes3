'use client';

import {cn} from '@/components/lib/utils';
import React from 'react';
import {Container} from './container';
import Image from 'next/image';
import Link from 'next/link';
import {ProfileButton} from './profile-button';
import {AuthModal} from './modals';
import {useSession} from "next-auth/react";
import {Access_admin} from "@/components/access_admin";
import {Access_user} from "@/components/access_user";
import {Access_no} from "@/components/access_no";


interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({className}) => {

    const { data: session } = useSession();
    const [openAuthModal, setOpenAuthModal] = React.useState(false);

    return (
        <header className={cn('border-b', className)}>
            <Container className="flex items-center justify-between py-3">
                {/* Левая часть */}
                <Link href="/">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={65}
                            height={65}
                            priority
                        />
                        <div>
                            <h1 className="text-2xl uppercase font-black">
                                HEROES<span className="text-red-500">3</span>
                            </h1>
                            <p className="text-sm text-gray-400 leading-3">SITE</p>
                        </div>
                    </div>
                </Link>


                {/* Правая часть */}
                <div className="flex items-center gap-3">
                    <div>
                        {session?.user?.role === 'ADMIN' && <Access_admin/>}
                        {session?.user?.role === 'USER' && <Access_user/>}
                        {!session && <Access_no/>}

                    </div>
                    <div>
                        <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)}/>
                        <ProfileButton onClickSignIn={() => setOpenAuthModal(true)}/>
                    </div>
                </div>
            </Container>
        </header>
    );
};
