// server page
"use server";
import { redirect } from 'next/navigation';
import { getUserSession } from "@/components/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import React from "react";
import { Container } from "@/components/container";
import { PlayerStatisticsComp } from "@/components/PlayerStatisticsComp";

export default async function PlayerStatisticsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const session = await getUserSession();

    if (!session) {
        return redirect('/');
    }

    const user = await prisma.user.findFirst({ where: { id: Number(session?.id) } });

    if (user?.role !== 'ADMIN') {
        return redirect('/');
    }

    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || '1', 10);
    const pageSize = 100;
    const skip = (page - 1) * pageSize;

    const playerStatistics = await prisma.playerStatistic.findMany({
        skip,
        take: pageSize,
        include: {
            turnirBet: true,
            category: true,
            player: true,
        },
    });

    // Debugging: Log the data to ensure it's an array
    console.log("Loaded playerStatistics:", playerStatistics);

    if (!Array.isArray(playerStatistics)) {
        console.error("playerStatistics is not an array:", playerStatistics);
        return null; // или обработайте ошибку соответствующим образом
    }

    return (
        <Container className="w-[96%]">
            <PlayerStatisticsComp playerStatistics={playerStatistics} />
        </Container>
    );
}
