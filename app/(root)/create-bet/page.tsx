
import {prisma} from '@/prisma/prisma-client';
import {getUserSession} from '@/components/lib/get-user-session';
import {redirect} from 'next/navigation';
import {CreateBet} from "@/components/create-bet";
import {Container} from "@/components";
import {Suspense} from "react";
import Loading from "@/app/(root)/loading";

export default async function AdminPage() {
    const session = await getUserSession();

    if (!session) {
        return redirect('/not-auth');
    }

    const user = await prisma.user.findFirst({where: {id: Number(session?.id)}});
    const product = await prisma.product.findMany();
    const category = await prisma.category.findMany();
    const productItem = await prisma.productItem.findMany();

    if (user) {
        return (

                <Suspense fallback={<Loading />}>
                <CreateBet user={user} category={category} product={product} productItem={productItem}/>;
                </Suspense>

        );
    } else {
        return redirect('/not-auth');
    }
}