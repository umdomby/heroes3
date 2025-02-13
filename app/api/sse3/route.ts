// Пример кода для обновления SSE
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

export async function GET(request: Request) {
    try {
        const headers = new Headers({
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Transfer-Encoding': 'chunked',
        });

        const stream = new ReadableStream({
            async start(controller) {
                const intervalId = setInterval(() => {
                    try {
                        const data = `data: ${JSON.stringify({ type: 'keep-alive' })}\n\n`;
                        controller.enqueue(new TextEncoder().encode(data));
                    } catch (error) {
                        clearInterval(intervalId);
                        controller.close();
                    }
                }, 15000);

                let lastUpdatedAt = new Date();

                const checkIntervalId = setInterval(async () => {
                    try {
                        const changes = await prisma.bet3.findMany({
                            where: {
                                updatedAt: {
                                    gt: lastUpdatedAt,
                                },
                            },
                        });

                        if (changes.length > 0) {
                            changes.forEach(change => {
                                const data = `data: ${JSON.stringify({ type: 'update', data: change })}\n\n`;
                                controller.enqueue(new TextEncoder().encode(data));
                            });

                            lastUpdatedAt = new Date();
                        }
                    } catch (error) {
                        clearInterval(checkIntervalId);
                        controller.close();
                    }
                }, 1000);

                request.signal.onabort = () => {
                    clearInterval(intervalId);
                    clearInterval(checkIntervalId);
                    controller.close();
                };
            },
        });

        return new NextResponse(stream, { headers });
    } catch (error) {
        return new NextResponse('Ошибка сервера', { status: 500 });
    }
}
