"use server";

import { prisma } from '@/prisma/prisma-client';
import React, { Suspense } from "react";

import { getUserSession } from "@/components/lib/get-user-session";





export default async function UserGame2Page() {
    const session = await getUserSession();
    let user = null;

    if (session) {
        user = await prisma.user.findFirst({ where: { id: Number(session?.id) } });
    }

    const isTelegramEmpty = user && (!user.telegram || user.telegram.trim() === '');

    return (
        <div>

        </div>
    );
}
