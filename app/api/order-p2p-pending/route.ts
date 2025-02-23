import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();


    const page = parseInt(resolvedSearchParams.page ?? '1', 10);
    const betsPerPage = 100;
    const skip = (page - 1) * betsPerPage;


    const sendUpdate = async () => {
        try {
            const openOrders = await prisma.orderP2P.findMany({
                where: {
                    OR: [
                        {
                            orderP2PUser1: { id: parseInt(userId)},
                            orderP2PStatus: { in: ['PENDING', 'CLOSED', 'RETURN'] }
                        },
                        {
                            orderP2PUser2: { id: parseInt(userId) },
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
                take: betsPerPage,
            });

            const totalOrders = await prisma.orderP2P.count({
                where: {
                    OR: [
                        {
                            orderP2PUser1: { id: parseInt(userId) },
                            orderP2PStatus: { in: ['PENDING', 'CLOSED', 'RETURN'] }
                        },
                        {
                            orderP2PUser2: { id: parseInt(userId) },
                            orderP2PStatus: { in: ['PENDING', 'CLOSED', 'RETURN'] }
                        }
                    ]
                }
            });

            const data = {
                openOrders,
                totalOrders
            };

            writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
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