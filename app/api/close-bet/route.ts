import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import * as z from 'zod';


const closeBetSchema = z.object({
    betId: z.number().int(),
    winnerId: z.number().int(),
});




export async function POST(request: Request) {
    try {
        const { betId, winnerId } = closeBetSchema.parse(await request.json());


        const bet = await prisma.bet.findUniqueOrThrow({
            where: { id: betId },
            include: { creator: true, acceptor: true },
        });


        if (bet.status === 'CLOSED') {
            return new NextResponse('Ставка уже закрыта', { status: 400 });
        }


        // Логика расчета выигрыша (пример)
        let creatorPointsChange = 0;
        let acceptorPointsChange = 0;


        if (winnerId === bet.creatorId) {
            creatorPointsChange = 10; // Выигрыш создателя
            if (bet.acceptorId != null) {
                acceptorPointsChange = -10; // Проигрыш акцептора
            }


        } else if (bet.acceptorId != null && winnerId === bet.acceptorId) {
            creatorPointsChange = -10;
            acceptorPointsChange = 10;
        } else {
            return new NextResponse("Неверный ID победителя", {status: 400})
        }


        // Обновление данных в базе
        const updatedBet = await prisma.bet.update({
            where: { id: betId },
            data: { winnerId, status: 'CLOSED' },
            include: {
                creator: true,
                acceptor: true,
            }
        });


        await prisma.user.update({
            where: { id: bet.creatorId },
            data: { points: { increment: creatorPointsChange } },
        });


        if(bet.acceptorId) {
            await prisma.user.update({
                where: { id: bet.acceptorId },
                data: { points: { increment: acceptorPointsChange } },
            });
        }




        return NextResponse.json({ message: 'Ставка закрыта', bet: updatedBet });


    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 400 });
        }
        console.error('Ошибка при закрытии ставки:', error);
        return new NextResponse('Ошибка сервера', { status: 500 });
    }
}
