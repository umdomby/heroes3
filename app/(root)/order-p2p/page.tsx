// /app/(root)/order-p2p/page.tsx
"use server"
import { Container } from '@/components/container';
import { prisma } from '@/prisma/prisma-client';
import { redirect } from 'next/navigation';
import React, { Suspense } from "react";
import Loading from "@/app/(root)/loading";
import { getUserSession } from "@/components/lib/get-user-session";
import { OrderP2PComponent } from "@/components/OrderP2PComponent";
import Link from "next/link";
import { checkAndCloseOrderP2PTime, updateCurrencyRatesIfNeeded, getCourseValuta } from "@/app/actions";

export default async function OrderP2PPage() {
    const session = await getUserSession();

    if (!session) {
        return redirect('/');
    }

    const user = await prisma.user.findFirst({
        where: { id: Number(session?.id) },
    });

    if (!user || user.role === 'BANED') {
        return redirect('/');
    }

    if (user.telegram === null || user.telegram === undefined || user.telegram === '') {
        return (
            <div className="text-center">
                <p className="text-green-500">Заполните:</p>
                <p>
                    Настройки Telegram
                </p>
                <p>
                    <Link href="/profile" className="text-blue-500">Profile</Link>
                </p>
            </div>
        );
    }

    await updateCurrencyRatesIfNeeded();
    await checkAndCloseOrderP2PTime();

    const openOrders = await prisma.orderP2P.findMany({
        where: { orderP2PStatus: 'OPEN' },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            orderP2PUser1: {
                select: {
                    id: true,
                    cardId: true,
                    telegram: true,
                }
            },
            orderP2PUser2: {
                select: {
                    id: true,
                    cardId: true,
                    telegram: true,
                }
            }
        }
    });

    openOrders.sort((a, b) => {
        const isAUserOrder = a.orderP2PUser1Id === user.id || a.orderP2PUser2Id === user.id;
        const isBUserOrder = b.orderP2PUser1Id === user.id || b.orderP2PUser2Id === user.id;

        if (isAUserOrder && !isBUserOrder) return -1;
        if (!isAUserOrder && isBUserOrder) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const pendingOrdersCount = await prisma.orderP2P.count({
        where: {
            orderP2PStatus: 'PENDING',
            OR: [
                { orderP2PUser1Id: user.id },
                { orderP2PUser2Id: user.id }
            ]
        }
    });

    // Fetch the latest exchange rates
    const exchangeRates = await getCourseValuta();

    return (
        <Container className="w-[100%]">
            <Suspense fallback={<Loading />}>
                <OrderP2PComponent
                    user={user}
                    openOrders={openOrders}
                    pendingOrdersCount={pendingOrdersCount}
                    exchangeRates={exchangeRates} // Pass exchange rates as a prop
                />
            </Suspense>
        </Container>
    );
}
