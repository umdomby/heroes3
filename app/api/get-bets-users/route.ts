import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { BetStatus } from '@prisma/client'; // Импортируйте тип BetStatus

export async function GET() {
    try {

        const bets = await prisma.bet.findMany({
            where: { status: 'OPEN_USERS' }, // Применяем фильтр по статусу
            orderBy: { createdAt: 'asc' }, // Сортировка по дате создания
            include: {
                player1: true,
                player2: true,
                creator: true,
                participants: {
                    include: {
                        user: true, // Включаем данные о пользователе
                    },
                },
                category: true,
                product: true,
                productItem: true,
            },
        });

        return NextResponse.json(bets); // Возвращаем список ставок
    } catch (error) {
        console.error('Ошибка при получении ставок:', error);
        return new NextResponse('Ошибка сервера', { status: 500 });
    }
}
