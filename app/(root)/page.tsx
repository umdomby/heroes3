import { Container } from '@/components/container';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

import React, {Suspense} from "react";
import Loading from "@/app/(root)/loading";
import { InferGetServerSidePropsType } from 'next';
import {GameRecord_CLIENT} from "@/components/gameRecords_CLIENT";
import Link from "next/link";
import {Button} from "@/components/ui";
export const dynamic = 'force-dynamic'

export default async function Home({
                                               params,
                                               searchParams,
                                           }: {
    params: Promise<{ categoryPage: string }>;
    searchParams: Promise<{ page?: string | undefined }>;
}) {
    // Явно дожидаемся params (expected as a Promise)
    const { categoryPage } = await params;
    const resolvedSearchParams = await searchParams; // Ждём Promise
    const page = parseInt(resolvedSearchParams.page ?? '1', 30);
    const pageSize = 30;
    const offset = (page - 1) * pageSize;

    const gameRecords = await prisma.gameRecords.findMany({
        skip: offset,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: {
            user: true,
            product: true,
            productItem: true,
            category: true,
            carModel: true,
        },
    });

    const totalRecords = await prisma.gameRecords.count({});

    const totalPages = Math.ceil(totalRecords / pageSize);

    return (
        <Container className="flex flex-col my-10">
            <Suspense fallback={<Loading />}>
                <GameRecord_CLIENT gameRecords={gameRecords} />
                <div className="pagination-buttons flex justify-center mt-6">
                    <Link href={`/?page=${page - 1}`}>
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
                        <Link href={`/?page=${page + 1}`}>
                            <Button className="btn btn-primary mx-2 w-[100px]">
                                Next
                            </Button>
                        </Link>
                    )}
                </div>
            </Suspense>
        </Container>
    );
}