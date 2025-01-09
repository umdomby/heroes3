'use client';
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {createBet} from '@/app/actions';
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
import {useSession} from 'next-auth/react';
import {redirect} from 'next/navigation';
import {Category, Product, ProductItem, User} from '@prisma/client';
import {Container} from "@/components/container";

const createBetSchema = z.object({
    player1: z.string().min(1, {message: 'Введите имя игрока 1'}),
    player2: z.string().min(1, {message: 'Введите имя игрока 2'}),
    oddsPlayer1: z.number().positive({message: 'Коэффициент должен быть положительным числом'}),
    oddsPlayer2: z.number().positive({message: 'Коэффициент должен быть положительным числом'}),
    categoryId: z.number().int(),
    productId: z.number().int(),
    productItemId: z.number().int(),
});

interface Props {
    user: User;
    category: Category[];
    product: Product[];
    productItem: ProductItem[];
    className?: string;
}

export const CreateBet: React.FC<Props> = ({user, category, product, productItem, className}) => {
    const form = useForm<z.infer<typeof createBetSchema>>({
        resolver: zodResolver(createBetSchema),
        defaultValues: {
            player1: '',
            player2: '',
            oddsPlayer1: 1,
            oddsPlayer2: 1,
            categoryId: category[0]?.id || 1,
            productId: product[0]?.id || 1,
            productItemId: productItem[0]?.id || 1,
        },
    });

    const {data: session, status} = useSession();
    const [createBetError, setCreateBetError] = useState<string | null>(null);

    const onSubmit = async (values: z.infer<typeof createBetSchema>) => {
        try {
            await createBet(values);
            form.reset();
            setCreateBetError(null);
        } catch (error) {
            if (error instanceof Error) {
                setCreateBetError(error.message);
            } else {
                setCreateBetError('Неизвестная ошибка');
            }
            console.error("Error creating bet:", error);
        }
    };

    return (
        <Container className="flex flex-col my-10">
            <Form {...form}>


                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Category Dropdown */}
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {category.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {/* Product Dropdown (similar to Category) */}
                    <FormField
                        control={form.control}
                        name="productId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Product</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {product.map((prod) => (
                                            <option key={prod.id} value={prod.id}>{prod.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Product Item Dropdown (similar to Category) */}
                    <FormField
                        control={form.control}
                        name="productItemId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Product Item</FormLabel>
                                <FormControl>
                                    <select {...field}>
                                        {productItem.map((prodItem) => (
                                            <option key={prodItem.id} value={prodItem.id}>{prodItem.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {/* Player 1 */}
                    <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="player1"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Player 1</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name for Player 1" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Player 2 (similar to Player 1) */}
                    <FormField  // Example for player1 - adjust other fields similarly
                        control={form.control}
                        name="player2"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Player 2</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name for Player 2" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />


                    {/* Odds for Player 1 */}
                    <FormField
                        control={form.control}
                        name="oddsPlayer1"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Odds for Player 1</FormLabel>
                                <FormControl>
                                    <Input placeholder="Odds" type="number" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Odds for Player 2 (similar to Odds for Player 1) */}
                    <FormField
                        control={form.control}
                        name="oddsPlayer2"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Odds for Player 2</FormLabel>
                                <FormControl>
                                    <Input placeholder="Odds" type="number" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    </div>

                    <Button type="submit">Create Bet</Button>
                    {createBetError && <p style={{color: 'red'}}>{createBetError}</p>}
                </form>
            </Form>
        </Container>
    );
};