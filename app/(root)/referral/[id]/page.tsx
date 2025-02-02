"use server";
import { redirect } from 'next/navigation';
import { getUserSession } from "@/components/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import axios from 'axios';

export default async function ReferralPage({
                                                params
                                           }:{
                                                params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getUserSession();

    if (session) {
        return redirect('/');
    }

    let ip = 'unknown';

    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        ip = response.data.ip;
    } catch (error) {
        console.error('Ошибка при получении IP-адреса:', error);
        return redirect('/');
    }

    const userId = Number(id);
    console.log('userId ' + userId)

    const allUsers = await prisma.user.findMany();
    let ipExists = false;
    for (const user of allUsers) {
        if (user.loginHistory && Array.isArray(user.loginHistory)) {
            const hasIP = user.loginHistory.some((entry: any) => entry.ip === ip);
            if (hasIP) {
                ipExists = true;
                break;
            }
        }
    }

    if (ipExists) {
        return redirect('/');
    }

    const referralIpExists = await prisma.referralUserIpAddress.findFirst({
        where: { referralIpAddress: String(ip) }
    });
    console.log('referralIpExists ' + referralIpExists)
    if (referralIpExists) {
        return redirect('/');
    }

    try {
        await prisma.referralUserIpAddress.create({
            data: {
                referralUserId: userId,
                referralIpAddress: ip
            }
        });
    } catch (error) {
        console.error('Ошибка при сохранении IP адреса:', error);
        throw new Error('Не удалось сохранить IP адрес');
    }


    return redirect('/');
}
