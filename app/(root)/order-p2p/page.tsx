import { Container } from '@/components/container';
import { prisma } from '@/prisma/prisma-client';
import { redirect } from 'next/navigation';
import React, { Suspense } from "react";
import Loading from "@/app/(root)/loading";
import { getUserSession } from "@/components/lib/get-user-session";
import { OrderP2P } from "@/components/OrderP2P"; // Ensure this import matches your OrderP2P component

export default async function OrderP2PPage() {
    const session = await getUserSession();

    if (!session) {
        return redirect('/not-auth');
    }

    const user = await prisma.user.findFirst({
        where: { id: Number(session?.id) },
    });

    if (!user) {
        return redirect('/not-auth');
    }

    // Fetch open orders directly
    const openOrders = await prisma.orderP2P.findMany({
        where: { orderP2PStatus: 'OPEN' },
        include: {
            orderP2PUser1: true,
            orderP2PUser2: true,
        }
    });


    return (
        <Container className="w-[100%]">
            <Suspense fallback={<Loading />}>
                <OrderP2P user={user} openOrders={openOrders} />
            </Suspense>
        </Container>
    );
}
