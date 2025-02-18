// /app/(root)/order-p2p-pending/page.tsx

import { Container } from '@/components/container';
import { prisma } from '@/prisma/prisma-client';
import { redirect } from 'next/navigation';
import React, { Suspense } from "react";
import Loading from "@/app/(root)/loading";
import { getUserSession } from "@/components/lib/get-user-session";
import { OrderP2PPending } from "@/components/OrderP2PPending";
import { checkAndCloseExpiredDeals } from '@/app/actions';

const PAGE_SIZE = 1; // Define the number of items per page

export default async function OrderP2PPendingPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const resolvedSearchParams = await searchParams; // Await the searchParams if it's a Promise
    await checkAndCloseExpiredDeals();

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
    if (user.role === 'BANED') {
        return redirect('/');
    }

    const page = parseInt(resolvedSearchParams.page ?? '1', 10);
    const skip = (page - 100) * PAGE_SIZE;

    const openOrders = await prisma.orderP2P.findMany({
        where: {
            OR: [
                {
                    orderP2PUser1: { id: user.id },
                    orderP2PStatus: { in: ['PENDING', 'CLOSED', 'RETURN'] }
                },
                {
                    orderP2PUser2: { id: user.id },
                    orderP2PStatus: { in: ['PENDING', 'CLOSED', 'RETURN'] }
                }
            ]
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            orderP2PUser1: {
                select: {
                    id: true,
                    cardId: true,
                    fullName: true,
                    telegram: true,
                }
            },
            orderP2PUser2: {
                select: {
                    id: true,
                    cardId: true,
                    fullName: true,
                    telegram: true,
                }
            }
        },
        skip: skip,
        take: PAGE_SIZE,
    });

    const totalOrders = await prisma.orderP2P.count({
        where: {
            OR: [
                {
                    orderP2PUser1: { id: user.id },
                    orderP2PStatus: { in: ['PENDING', 'CLOSED', 'RETURN'] }
                },
                {
                    orderP2PUser2: { id: user.id },
                    orderP2PStatus: { in: ['PENDING', 'CLOSED', 'RETURN'] }
                }
            ]
        }
    });

    const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

    return (
        <Container className="w-[100%]">
            <Suspense fallback={<Loading />}>
                <OrderP2PPending user={user} openOrders={openOrders} currentPage={page} totalPages={totalPages} />
            </Suspense>
        </Container>
    );
}