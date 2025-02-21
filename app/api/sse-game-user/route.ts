import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/prisma-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendUpdate = async () => {
        const gameUserBets = await prisma.gameUserBet.findMany({
            include: {
                gameUser1Bet: true,
                gameUser2Bet: true,
                category: true,
                product: true,
                productItem: true,
            },
        });

        res.write(`data: ${JSON.stringify(gameUserBets)}\n\n`);
    };

    // Simulate database change listener
    const interval = setInterval(sendUpdate, 5000); // Adjust the interval as needed

    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
}