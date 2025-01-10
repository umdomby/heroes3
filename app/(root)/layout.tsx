import { Header } from '@/components/header';
import { prisma } from '@/prisma/prisma-client';
import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import {getUserSession} from "@/components/lib/get-user-session";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: 'HEROES 3',
};

const session = await getUserSession();

const user = await prisma.user.findFirst({where: {id: Number(session?.id)}});

export default async function HomeLayout({ children }: { children: React.ReactNode }) { // <-- Add children prop here

    return (
        <main className="min-h-screen">
            <Suspense>
                <div style={{position: "absolute", top: "2px", right: "3%"}}>
                    {user.fullName}  <span style={{color: "green", fontWeight: "bold"}}> {user.points} </span> $
                </div>
                <Header/>
            </Suspense>
            {children}
        </main>
    );
}