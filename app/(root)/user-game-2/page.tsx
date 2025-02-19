"use server";

import { prisma } from '@/prisma/prisma-client';
import React from "react";
import { getUserSession } from "@/components/lib/get-user-session";
import { UserGame2Comp } from "@/components/user-game-2-comp";
import {Container} from '@/components/container';

export default async function UserGame2Page() {
    const session = await getUserSession();
    let user = null;

    if (session) {
        user = await prisma.user.findFirst({ where: { id: Number(session?.id) } });
    }


    let gameUserBets = await prisma.gameUserBet.findMany({
            include: {
                gameUser1Bet: true,
                gameUser2Bet: true,
                category: true,
                product: true,
                productItem: true,
            },
    });


    return (
        <Container className="flex flex-col my-10 w-[96%]">
            <UserGame2Comp
                user={user}
                gameUserBets={gameUserBets}
            />
        </Container>
    );
}