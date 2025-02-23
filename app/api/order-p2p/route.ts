import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

export async function GET(request: Request) {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    const sendUpdate = async () => {
        try {

            const openOrders = await prisma.orderP2P.findMany({
                where: {orderP2PStatus: 'OPEN'},
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


            const pendingOrdersCount = await prisma.orderP2P.count({
                where: {
                    orderP2PStatus: 'PENDING',
                    // orderP2PUser1Id: user.id,
                    OR: [
                        { orderP2PCheckUser1: null },
                        { orderP2PCheckUser2: null }
                    ]
                }
            });

            writer.write(encoder.encode(`data: ${JSON.stringify(openOrders)}\n\n`));
        } catch (error) {
            console.error('Failed to fetch data:', error);
            writer.write(encoder.encode('data: {"error": "Failed to fetch data"}\n\n'));
        }
    };

    const interval = setInterval(sendUpdate, 5000);

    request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        writer.close();
    });

    return new NextResponse(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
