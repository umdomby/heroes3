'use client';
import React, { useState } from 'react';
import { Bet, PlayerChoice, User } from '@prisma/client';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { placeBet, closeBet } from '@/app/actions';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form'

const fetcher = (...args: any) => fetch(...args).then(res => res.json());

const placeBetSchema = z.object({
    amount: z.number().positive({ message: 'Сумма должна быть положительным числом' }),
    player: z.nativeEnum(PlayerChoice),
});

interface Props {
    user: User | null;
    className?: string;
}

export const HEROES_CLIENT: React.FC<Props> = ({ className, user }) => {
    const form = useForm<z.infer<typeof placeBetSchema>>({
        resolver: zodResolver(placeBetSchema),
        defaultValues: {
            amount: 0,
            player: PlayerChoice.PLAYER1,
        },
    });

    const { data: session } = useSession();
    const { data: bets, error, isLoading, mutate } = useSWR('/api/get-bets', fetcher);
    const [placeBetError, setPlaceBetError] = useState<string | null>(null);

    if (!session) {
        return redirect('/not-auth');
    }

    if (isLoading) {
        return <div>Загрузка данных...</div>;
    }

    if (error) {
        return <div>Ошибка при загрузке данных: {error.message}</div>;
    }

    if (!bets) {
        return <div>Нет данных</div>;
    }

    const handlePlaceBet = async (bet: Bet, values: z.infer<typeof placeBetSchema>) => {
        try {
            if (!user) {
                throw new Error("Пользователь не найден");
            }

            await placeBet({
                betId: bet.id,
                userId: user.id,
                amount: values.amount,
                player: values.player,
            });
            mutate();
            form.reset();
            setPlaceBetError(null); // Clear any previous errors
        } catch (err) {
            if (err instanceof Error) {
                setPlaceBetError(err.message);
            } else {
                setPlaceBetError('Неизвестная ошибка');
            }
            console.error('Error placing bet:', err);
        }
    };

    const handleCloseBet = async (betId: number, winnerId: number) => {
        try {
            await closeBet(betId, winnerId);
            mutate();
        } catch (error) {
            console.error('Error closing bet:', error);
        }
    };

    return (
        <div>
            {bets.map((bet) => ( // Map over the bets array
                <div key={bet.id} className="border border-gray-300 p-4 mt-4">
                    <h3>{bet.player1} vs {bet.player2}</h3>
                    {/* ... other bet information */}

                    {bet.status === 'OPEN' && (
                        <div>
                            <p>Ваши баллы: {user?.points}</p>
                            <p>Текущие ставки: {bet.currentOdds1} - {bet.currentOdds2}</p>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit((values) => handlePlaceBet(bet, values))}>
                                    {/* ... (Form fields remain the same) */}
                                </form>
                            </Form>
                            {placeBetError && <p className="text-red-500">{placeBetError}</p>}
                        </div>
                    )}

                    {bet.status === 'OPEN' && bet.creatorId === user?.id && (
                        <div className="flex gap-2">
                            <Button onClick={() => handleCloseBet(bet.id, bet.creatorId)}>Создатель выиграл</Button>
                            <Button onClick={() => handleCloseBet(bet.id, bet?.participants[0]?.userId)}>Акцептор выиграл</Button>
                        </div>
                    )}

                    {/* ... other parts of your component for each bet */}
                </div>
            ))}
        </div>
    );
};