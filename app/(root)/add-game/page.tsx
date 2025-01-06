'use server';
import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/components/lib/get-user-session';
import { redirect } from 'next/navigation';
import {AddGame} from "@/components/add-game";

export default async function AdminPage() {
  const session = await getUserSession();

  if (!session) {
    return redirect('/not-auth');
  }

  const user = await prisma.user.findFirst({ where: { id: Number(session?.id) } });
  const product = await prisma.product.findMany();
  const category = await prisma.category.findMany();
  const productItem = await prisma.productItem.findMany();

  if (user) {
    return <AddGame user={user} category={category} product={product} productItem={productItem} />;
  }else{
    return redirect('/not-auth');
  }
}