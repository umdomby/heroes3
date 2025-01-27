"use server";
import {prisma} from '@/prisma/prisma-client';
import {getUserSession} from '@/components/lib/get-user-session';
import {redirect} from 'next/navigation';
import {CreateBetForm} from '@/components/create-bet-form';
import {Suspense} from 'react';
import Loading from "@/app/(root)/loading";
import {clientCreateBet} from "@/app/actions";
import {Container} from '@/components/container';

async function fetchData() {
    const session = await getUserSession();

    if (!session) {
        redirect('/not-auth');
    }

    try {
        const [user, categories, products, productItems, players] = await prisma.$transaction([
            prisma.user.findUnique({where: {id: parseInt(session.id)}}),
            prisma.category.findMany(),
            prisma.product.findMany(),
            prisma.productItem.findMany(),
            prisma.player.findMany(),

        ]);
        return {user, categories, products, productItems, players};
    } catch (error) {
        console.error("Error fetching data:", error);
        return {user: null, categories: [], products: [], productItems: [], players: []};
    }
}


export default async function CreateBetPage() {
    const {user, categories, products, productItems, players} = await fetchData();

    if (!user) {
        redirect('/not-auth');
    }


    return (
        <Container className="flex flex-col my-10">
            <Suspense fallback={<Loading/>}>
                <CreateBetForm
                    user={user}
                    categories={categories}
                    products={products}
                    productItems={productItems}
                    players={players}
                    createBet={clientCreateBet}
                />
            </Suspense>
        </Container>
    );
}