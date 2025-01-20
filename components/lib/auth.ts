import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Функция для проверки VPN
export async function checkVPN(ip: string): Promise<boolean> {
    try {
        const response = await axios.get(`https://v2.api.iphub.info/ip/${ip}`, {
            headers: {
                'X-Key': process.env.IPHUB_API_KEY!, // Ваш API-ключ от IPHub
            },
        });
        return response.data.block === 1; // Если block === 1, то это VPN/прокси
    } catch (error) {
        console.error('Ошибка при проверке VPN:', error);
        return false;
    }
}

// Функция для обновления истории входов
export async function updateLoginHistory(userId: number, ip: string, isVPN: boolean) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    const loginHistory = user?.loginHistory || [];
    const existingEntry = loginHistory.find((entry: any) => entry.ip === ip);

    if (existingEntry) {
        // Обновляем существующую запись
        existingEntry.lastLogin = new Date().toISOString();
        existingEntry.vpn = isVPN;
        existingEntry.loginCount += 1;
    } else {
        // Добавляем новую запись
        loginHistory.push({
            ip,
            lastLogin: new Date().toISOString(),
            vpn: isVPN,
            loginCount: 1,
        });
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            loginHistory,
        },
    });
}
