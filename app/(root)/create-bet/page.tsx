import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/components/lib/get-user-session';
import { redirect } from 'next/navigation';
import { CreateBetForm } from '@/components/create-bet-form';
import { Suspense } from 'react';
import Loading from "@/app/(root)/loading";
import {clientCreateBet} from "@/app/actions";


async function fetchData() {
    const session = await getUserSession();

    if (!session) {
        redirect('/not-auth');
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(session.id) } });
        const categories = await prisma.category.findMany();
        const products = await prisma.product.findMany();
        const productItems = await prisma.productItem.findMany();
        return { user, categories, products, productItems };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { user: null, categories: [], products: [], productItems: [] };
    }
}


export default async function CreateBetPage() {
    const { user, categories, products, productItems } = await fetchData();

    if (!user) {
        redirect('/not-auth');
    }


    return (
        <Suspense fallback={<Loading />}>
            <CreateBetForm
                user={user}
                categories={categories}
                products={products}
                productItems={productItems}
                createBet={clientCreateBet}
            />
        </Suspense>
    );
}