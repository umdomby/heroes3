import { Container } from '@/components/container';
import { prisma } from '@/prisma/prisma-client';
import { redirect } from 'next/navigation';
import React, { Suspense } from "react";
import Loading from "@/app/(root)/loading";
import { getUserSession } from "@/components/lib/get-user-session";
import {OrderP2PClosed} from "@/components/OrderP2PClosed";

export default async function OrderP2PPendingPage() {
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

    // Запрос к базе данных
    const openOrders = await prisma.orderP2P.findMany({
        where: {
            OR: [
                { orderP2PUser1: { id: user.id } },
                { orderP2PUser2: { id: user.id } }
            ],
            orderP2PStatus: 'CLOSED'
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            orderP2PUser1: {
                select: {
                    id: true,
                    cardId: true,
                    // Добавьте другие необходимые поля
                }
            },
            orderP2PUser2: {
                select: {
                    id: true,
                    cardId: true,
                    // Добавьте другие необходимые поля
                }
            }
        }
    });


    return (
        <Container className="w-[100%]">
            <Suspense fallback={<Loading />}>
                <OrderP2PClosed user={user} openOrders={openOrders} />
            </Suspense>
        </Container>
    );
}
