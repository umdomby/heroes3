import { Header } from '@/components/header';
import { Admin } from '@/components/admin';
import type { Metadata } from 'next';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'HEROES 3',
};



export default async function HomeLayout({ children }: { children: React.ReactNode }) { // <-- Add children prop here

    return (
        <main className="min-h-screen">
            <Suspense>
                <Admin/>
                <Header/>
            </Suspense>
            {children}
        </main>
    );
}