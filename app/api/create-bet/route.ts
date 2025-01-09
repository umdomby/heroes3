import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import * as z from 'zod';
import { useSession } from 'next-auth/react';
import {redirect} from "next/navigation";



const createBetSchema = z.object({
    player1: z.string().min(1, { message: 'Введите имя игрока 1' }),
    player2: z.string().min(1, { message: 'Введите имя игрока 2' }),
    oddsPlayer1: z.number().gt(1, { message: 'Коэффициент должен быть больше 1' }),
    oddsPlayer2: z.number().gt(1, { message: 'Коэффициент должен быть больше 1' }),
    categoryId: z.number().int(),
    productId: z.number().int(),
    productItemId: z.number().int(),
});


export async function POST(request: Request) {
    try {
        const { data: session } = useSession();

        const user = await prisma.user.findFirst({ where: { id: Number(session?.id) } });

        if (!user) {
            return redirect('/not-auth');
        }

        const data = await request.json();

        const validatedData = createBetSchema.parse(data);

        const createdBet = await prisma.bet.create({
            data: {
                // ... другие поля ставки,
                creatorId: Number(user.id), // ID пользователя из сессии
            },
        });

        return NextResponse.json({ message: 'Ставка успешно создана', bet: createdBet });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 400 });
        }
        console.error('Ошибка при создании ставки:', error);
        return new NextResponse('Ошибка сервера', { status: 500 });
    }
}
