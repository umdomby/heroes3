'use client';

import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from 'react';
import {Category, Product, ProductItem, User, Player} from '@prisma/client';
import {clientCreateBet} from "@/app/actions";


const createBetSchema = z.object({
    player1Id: z.coerce.number(),
    player2Id: z.coerce.number(),
    initBetPlauer1: z.number().positive({message: 'Введите положительное число очков'}).min(50, {message: 'Минимальная ставка на игрока 1 должна быть 50 баллов'}),
    initBetPlauer2: z.number().positive({message: 'Введите положительное число очков'}).min(50, {message: 'Минимальная ставка на игрока 2 должна быть 50 баллов'}),
    categoryId: z.coerce.number(),
    productId: z.coerce.number(),
    productItemId: z.coerce.number(),
});

interface Props {
    user: User;
    categories: Category[];
    products: Product[];
    productItems: ProductItem[];
    players: Player[];
    createBet: typeof clientCreateBet;
}

export const CreateBetForm: React.FC<Props> = ({user, categories, products, productItems, players, createBet}) => {
    const form = useForm<z.infer<typeof createBetSchema>>({
        resolver: zodResolver(createBetSchema),
        defaultValues: {
            player1Id: players[0]?.id,
            player2Id: players[1]?.id,
            initBetPlauer1: 50, // Дефолтное значение 50
            initBetPlauer2: 50, // Дефолтное значение 50
            categoryId: categories[0]?.id,
            productId: products[0]?.id,
            productItemId: productItems[0]?.id,
        },
    });

    const [createBetError, setCreateBetError] = useState<string | null>(null);

    const onSubmit = async (values: z.infer<typeof createBetSchema>) => {
        if (values.initBetPlauer1 < 50 || values.initBetPlauer2 < 50) {
            setCreateBetError("Минимальная ставка на каждого игрока должна быть 50 баллов");
            return;
        }

        try {
            await createBet(values);
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
                    <FormField
                        control={form.control}
                        name="player1Id"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Player 1</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {players.map((player) => (
                                            <option key={player.id} value={player.id}>{player.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="player2Id"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Player 2</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {players.map((player) => (
                                            <option key={player.id} value={player.id}>{player.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="initBetPlauer1"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Bet Player 1</FormLabel> {/* Обновленная метка */}
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value === undefined ? '' : field.value}
                                        onChange={(e) => field.onChange(Number(e.target.valueAsNumber || 0))}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="initBetPlauer2"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Bet Player 2</FormLabel> {/* Обновленная метка */}
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value === undefined ? '' : field.value}
                                        onChange={(e) => field.onChange(Number(e.target.valueAsNumber || 0))}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="productId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Product</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {products.map((prod) => (
                                            <option key={prod.id} value={prod.id}>{prod.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="productItemId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Product Item</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {productItems.map((prodItem) => (
                                            <option key={prodItem.id} value={prodItem.id}>{prodItem.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Create Bet</Button>
                    {createBetError && <p style={{color: 'red'}}>{createBetError}</p>}
                </form>
            </Form>
        </div>
    );
};