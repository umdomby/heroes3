'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from 'react';
import { Category, Product, ProductItem, User, Player } from '@prisma/client';
import { clientCreateBet } from "@/app/actions";

const createBetSchema = z.object({
    player1Id: z.coerce.number().int(), // Только целые числа
    player2Id: z.coerce.number().int(), // Только целые числа
    totalBetPlayer1: z.number().int().min(50, { message: 'Минимальная ставка на игрока 1: 50 баллов' }), // Только целые числа
    totalBetPlayer2: z.number().int().min(50, { message: 'Минимальная ставка на игрока 2: 50 баллов' }), // Только целые числа
    categoryId: z.coerce.number().int(), // Только целые числа
    productId: z.coerce.number().int(), // Только целые числа
    productItemId: z.coerce.number().int(), // Только целые числа
});

interface Props {
    user: User;
    categories: Category[];
    products: Product[];
    productItems: ProductItem[];
    players: Player[];
    createBet: typeof clientCreateBet;
}

export const CreateBetForm: React.FC<Props> = ({ user, categories, products, productItems, players, createBet }) => {
    const form = useForm<z.infer<typeof createBetSchema>>({
        resolver: zodResolver(createBetSchema),
        defaultValues: {
            player1Id: players[0]?.id,
            player2Id: players[1]?.id,
            totalBetPlayer1: 50,
            totalBetPlayer2: 50,
            categoryId: categories[0]?.id,
            productId: products[0]?.id,
            productItemId: productItems[0]?.id,
        },
    });

    const [createBetError, setCreateBetError] = useState<string | null>(null);

    const onSubmit = async (values: z.infer<typeof createBetSchema>) => {
        const { totalBetPlayer1, totalBetPlayer2 } = values;

        // Проверка на минимальную сумму ставки
        if (totalBetPlayer1 < 50 || totalBetPlayer2 < 50) {
            setCreateBetError('Минимальная ставка на каждого игрока: 50 баллов');
            return;
        }

        // Проверка баланса пользователя
        const totalBetAmount = totalBetPlayer1 + totalBetPlayer2;
        if (user.points < totalBetAmount) {
            setCreateBetError('Недостаточно баллов для создания ставки');
            return;
        }

        // Рассчитываем коэффициенты
        const totalBets = totalBetPlayer1 + totalBetPlayer2;
        const currentOdds1 = totalBets / totalBetPlayer1;
        const currentOdds2 = totalBets / totalBetPlayer2;

        const betData = {
            ...values,
            currentOdds1,
            currentOdds2,
            creatorId: user.id,
            totalBetPlayer1: totalBetPlayer1,
            totalBetPlayer2: totalBetPlayer2,
        };

        try {
            await createBet(betData);
            form.reset();
            setCreateBetError(null);
        } catch (error) {
            if (error instanceof Error) {
                setCreateBetError(error.message);
            } else {
                setCreateBetError("Произошла неизвестная ошибка");
            }
        }
    };

    return (
        <div>
            <div>Ваши баллы: {user?.points}</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Поле выбора Player 1 */}
                    <FormField
                        control={form.control}
                        name="player1Id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Player 1</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {players.map((player) => (
                                            <option key={player.id} value={player.id}>{player.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Поле выбора Player 2 */}
                    <FormField
                        control={form.control}
                        name="player2Id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Player 2</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {players.map((player) => (
                                            <option key={player.id} value={player.id}>{player.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Поле для ставки на Player 1 */}
                    <FormField
                        control={form.control}
                        name="totalBetPlayer1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ставка на Player 1</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Сумма ставки"
                                        type="number"
                                        {...field}
                                        value={field.value === undefined ? '' : field.value}
                                        onChange={(e) => {
                                            const value = e.target.valueAsNumber;
                                            if (Number.isInteger(value)) { // Проверка на целое число
                                                field.onChange(value);
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Поле для ставки на Player 2 */}
                    <FormField
                        control={form.control}
                        name="totalBetPlayer2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ставка на Player 2</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Сумма ставки"
                                        type="number"
                                        {...field}
                                        value={field.value === undefined ? '' : field.value}
                                        onChange={(e) => {
                                            const value = e.target.valueAsNumber;
                                            if (Number.isInteger(value)) { // Проверка на целое число
                                                field.onChange(value);
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Поле выбора категории */}
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Поле выбора продукта */}
                    <FormField
                        control={form.control}
                        name="productId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Поле выбора элемента продукта */}
                    <FormField
                        control={form.control}
                        name="productItemId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Item</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {productItems.map((productItem) => (
                                            <option key={productItem.id} value={productItem.id}>{productItem.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Кнопка отправки формы */}
                    <Button type="submit">Create Bet</Button>

                    {/* Отображение ошибки */}
                    {createBetError && <p style={{ color: 'red' }}>{createBetError}</p>}
                </form>
            </Form>
        </div>
    );
};
