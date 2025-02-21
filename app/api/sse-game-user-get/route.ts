import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/prisma-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const gameUserBets = await prisma.gameUserBet.findMany({
            include: {
                gameUser1Bet: true,
                gameUser2Bet: true,
                category: true,
                product: true,
                productItem: true,
            },
        });
        res.status(200).json(gameUserBets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}