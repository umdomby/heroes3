import {prisma} from '@/prisma/prisma-client';
import {getUserSession} from '@/components/lib/get-user-session';
import {redirect} from 'next/navigation';
import {CreateBet} from "@/components/create-bet";
import {Container} from "@/components";
import {Suspense} from "react";
import Loading from "@/app/(root)/loading";


async function fetchData() {
    try {
        const session = await getUserSession();

        if (!session) {
            return redirect('/not-auth');
        }

        const [user, product, category, productItem] = await prisma.$transaction([
            prisma.user.findFirst({where: {id: Number(session?.id)}}),
            prisma.category.findMany(),
            prisma.product.findMany(),
            prisma.productItem.findMany(),
        ]);
        return {user, category, product, productItem};
    } catch (e) {
        console.error('Database Error:', e);
        return {user: [], category: [], product: [], productItem: []}; // Return empty arrays on error
    }
}


export default async function AdminPage() {

    const data = await fetchData()

    if (data.user) {
        return (
            <Suspense fallback={<Loading/>}>
                <CreateBet user={data.user} category={data.category} product={data.product}
                           productItem={data.productItem}/>;
            </Suspense>
        );
    } else {
        return redirect('/not-auth');
    }
}