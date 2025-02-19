'use client';

import React from 'react';
import { GameUserBet, User, Category, Product, ProductItem } from '@prisma/client';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface Props {
    user: User;
    gameUserBets: (GameUserBet & {
        gameUser1Bet: User;
        gameUser2Bet: User | null;
        category: Category;
        product: Product;
        productItem: ProductItem;
    })[];
}

export const UserGame2Comp: React.FC<Props> = ({ user, gameUserBets }) => {
    return (
        <div>
            <div>Ваши баллы: {user?.points}</div>
            <Table>
                <TableBody>
                    {gameUserBets.map((bet) => (
                        <TableRow key={bet.id}>
                            <TableCell>{bet.gameUser1Bet.fullName}</TableCell>
                            <TableCell>{bet.betUser1}</TableCell>
                            <TableCell>{bet.gameUserBetDetails}</TableCell>
                            <TableCell>{bet.category.name}</TableCell>
                            <TableCell>{bet.product.name}</TableCell>
                            <TableCell>{bet.productItem.name}</TableCell>
                            <TableCell>{bet.gameUserBetOpen ? "Open" : "Closed"}</TableCell>
                            <TableCell>{bet.statusUserBet}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
