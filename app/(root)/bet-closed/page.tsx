"use server";
import { Container } from '@/components/container';
import { prisma } from '@/prisma/prisma-client';
import { redirect } from 'next/navigation';
import React, { Suspense } from "react";
import Loading from "@/app/(root)/loading";
import { getUserSession } from "@/components/lib/get-user-session";
import { HEROES_CLIENT_CLOSED } from "@/components/HEROES_CLIENT_CLOSED";

export default async function Home() {
    const session = await getUserSession();

    if (!session) {
        return redirect('/not-auth');
    }

    const user = await prisma.user.findFirst({ where: { id: Number(session?.id) } });

    if (!user) {
        return redirect('/not-auth');
    }

    // Получаем закрытые ставки, в которых участвовал пользователь
    const closedBets = await prisma.betCLOSED.findMany({
        where: {
            participantsCLOSED: {
                some: {
                    userId: user.id
                }
            }
        },
        include: {
            participantsCLOSED: {
                where: {
                    userId: user.id
                }
            },
            player1: true,
            player2: true,
            creator: true,
            category: true,
            product: true,
            productItem: true
        }
    });

    return (
        <Container className="w-[100%]">
            <Suspense fallback={<Loading />}>
                <HEROES_CLIENT_CLOSED user={user} closedBets={closedBets} />
            </Suspense>
        </Container>
    );
}