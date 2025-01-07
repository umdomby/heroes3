import { Header } from '@/components/header';
import { TopBar } from '@/components/top-bar';
import { prisma } from '@/prisma/prisma-client';
import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Image from "next/image";

export const metadata: Metadata = {
    title: 'GAME RECORD ONLINE',
};



async function fetchData() {
    try {
        const [product, category, productItem] = await prisma.$transaction([
            prisma.product.findMany(),
            prisma.category.findMany(),
            prisma.productItem.findMany(),
        ]);
        return { product, category, productItem };
    } catch (e) {
        console.error('Database Error:', e);
        return { product: [], category: [], productItem: [] }; // Return empty arrays on error
    }
}


export default async function HomeLayout({ children }: { children: React.ReactNode }) { // <-- Add children prop here
    const data = await fetchData()

    return (

        <main className="min-h-screen">
            <Suspense>
                <Header/>
                <div style={{width: "50%", margin: "0 auto"}}>
                    <Image
                        src="/h3.gif"
                        alt="Logo"
                        width={100}
                        height={65}
                        style={{width: '100%', height: 'auto'}} // Explicitly set width and height here
                        priority
                    />
                </div>
                {/*<TopBar category={data.category} product={data.product} productItem={data.productItem} />*/}
            </Suspense>
            {children} {/* <-- Render children here */}
        </main>
    );
}