'use server';
import {prisma} from '@/prisma/prisma-client';
import {getUserSession} from '@/components/lib/get-user-session';
import {notFound, redirect} from 'next/navigation';
import {EditGameRecord} from "@/components/edit-game-record";
import Link from "next/link";
import {Button} from "@/components/ui";
import React from "react";

export default async function AdminPage({
                                            searchParams,
                                        }: {
                                            searchParams: Promise<{ page?: string | undefined }>;
                                        }) {
    const session = await getUserSession();


    const resolvedSearchParams = await searchParams; // Ждём Promise
    const page = parseInt(resolvedSearchParams.page ?? '1', 20);
    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    if (!session) {
        return redirect('/not-auth');
    }

    const user = await prisma.user.findFirst({where: {id: Number(session?.id)}});
    const gameRecords = await prisma.gameRecords.findMany({
        skip: offset,
        take: pageSize,
        orderBy: {updatedAt: 'desc'},
        where: {
            userId: Number(session?.id)
        },
        include: {
            user: true,
            product: true,
            productItem: true,
            category: true,
            carModel: true,
        },
    });

    const totalRecords = await prisma.gameRecords.count({
        where: {
            userId: Number(session?.id)
        },
    });

    const totalPages = Math.ceil(totalRecords / pageSize);

    const carModel = await prisma.carModel.findMany();

    if (!user) {
        return notFound();
    }

    if (user) {
        return (
            <div>
                <EditGameRecord user={user} gameRecords={gameRecords} carModel={carModel}/>
                <div className="pagination-buttons flex justify-center mt-6">
                    <Link href={`/edit-record/?page=${page - 1}`}>
                        <Button
                            className="btn btn-primary mx-2 w-[100px]"
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                    </Link>
                    <span className="mx-3 text-lg font-semibold">
                        Page {page} of {totalPages}
                    </span>
                    {page < totalPages && (
                        <Link href={`/edit-record/?page=${page + 1}`}>
                            <Button className="btn btn-primary mx-2 w-[100px]">
                                Next
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        );

    } else {
        return redirect('/not-auth');
    }
}
