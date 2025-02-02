"use server";
import { redirect } from 'next/navigation';
import {getUserSession} from "@/components/lib/get-user-session";
import {prisma} from "@/prisma/prisma-client";
import {AddEditPlayer} from "@/components/addEditPlayer";


export default async function AddPlayerPage() {
    const session = await getUserSession();

    if (!session) {
        return redirect('/not-auth');
    }

    const user = await prisma.user.findFirst({ where: { id: Number(session?.id) } });

    if (user?.role !== 'ADMIN') {
        return redirect('/');
    }
    const players = await prisma.player.findMany();

    return <AddEditPlayer user={user} players={players} />;
}