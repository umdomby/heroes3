'use client';

import { cn } from '@/components/lib/utils';
import React from 'react';
import { Container } from './container';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileButton } from './profile-button';
import { AuthModal } from './modals';
import {DropmenuAdmin} from "@/components/dropmenu-admin";
import {ModeToggle} from "@/components/buttonTheme";


interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({  className }) => {
    const [openAuthModal, setOpenAuthModal] = React.useState(false);

    return (
        <header className={cn('border-b', className)}>
            <Container className="flex items-center justify-between py-3">
                {/* Левая часть */}
                <Link href="/">
                    <div className="flex items-center gap-4">
                        <Image src="/logo.webp" alt="Logo" width={65} height={65}/>
                        <div>
                            <h1 className="text-2xl uppercase font-black">GAME RECORD</h1>
                            <p className="text-sm text-gray-400 leading-3">ONLINE</p>
                        </div>
                    </div>
                </Link>


                {/* Правая часть */}
                <div className="flex items-center gap-3">
                    <ModeToggle/>
                    <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)}/>

                    <ProfileButton onClickSignIn={() => setOpenAuthModal(true)}/>
                    <DropmenuAdmin/>
                </div>
            </Container>
        </header>
    )
        ;
};
