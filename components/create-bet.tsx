
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBet } from '@/app/actions';
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
import { useState } from 'react';
import { Category, Product, ProductItem, User } from '@prisma/client';


const createBetSchema = z.object({
    player1: z.string().min(1, { message: 'Введите имя игрока 1' }),
    player2: z.string().min(1, { message: 'Введите имя игрока 2' }),
    oddsPlayer1: z.number().positive({ message: 'Коэффициент должен быть положительным числом' }),
    oddsPlayer2: z.number().positive({ message: 'Коэффициент должен быть положительным числом' }),
    categoryId: z.number().int(),
    productId: z.number().int(),
    productItemId: z.number().int(),
});

interface Props {
    user: User;
    categories: Category[];
    products: Product[];
    productItems: ProductItem[];
    className?: string;
}

export const CreateBet: React.FC<Props> = ({ user, categories, products, productItems, className }) => {
    const form = useForm<z.infer<typeof createBetSchema>>({
        resolver: zodResolver(createBetSchema),
        defaultValues: {
            player1: '',
            player2: '',
            oddsPlayer1: 1,
            oddsPlayer2: 1,
            categoryId: categories.length > 0 ? categories[0].id : null,
            productId: products.length > 0 ? products[0].id : null,
            productItemId: productItems.length > 0 ? productItems[0].id : null,
        },
    });

    const [createBetError, setCreateBetError] = useState<string | null>(null);

    const onSubmit = async (values: z.infer<typeof createBetSchema>) => {
        try {
            await createBet({ ...values, userId: user.id });
            form.reset();
            setCreateBetError(null);
        } catch (error) {
            // ... (error handling remains the same)
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="player1"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Player 1</FormLabel>
                            <FormControl>
                                <Input placeholder="Name for Player 1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Player 2 (similar to Player 1) */}
                <FormField
                    control={form.control}
                    name="player2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Player 2</FormLabel>
                            <FormControl>
                                <Input placeholder="Name for Player 2" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="oddsPlayer1"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Odds for Player 1</FormLabel>
                            <FormControl>
                                <Input placeholder="Odds" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="oddsPlayer2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Odds for Player 2</FormLabel>
                            <FormControl>
                                <Input placeholder="Odds" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* ... other FormFields (similar structure) */}
                <FormField // Example for categoryId - adjust other dropdowns similarly
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <select {...field}>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product</FormLabel>
                            <FormControl>
                                <select {...field}>
                                    {products.map((prod) => (
                                        <option key={prod.id} value={prod.id}>{prod.name}</option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="productItemId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Item</FormLabel>
                            <FormControl>
                                <select {...field}>
                                    {productItems.map((prodItem) => (
                                        <option key={prodItem.id} value={prodItem.id}>{prodItem.name}</option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Create Bet</Button>
                {createBetError && <p style={{ color: 'red' }}>{createBetError}</p>}
            </form>
        </Form>
    );
};