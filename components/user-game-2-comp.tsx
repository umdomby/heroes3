'use client';

import React from 'react';
import {GameUserBet, User, Category, Product, ProductItem, $Enums} from '@prisma/client';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import GameUserBetStatus = $Enums.GameUserBetStatus;

interface Props {
    user: User;
    gameUserBets: (GameUserBet & {
        gameUser1Bet: User;
        gameUser2Bet: User | null;
        category: Category;
        product: Product;
        productItem: ProductItem;
        gameUserBetDetails : string;
        betUser1 : number;
        gameUserBetOpen : boolean;
        statusUserBet: GameUserBetStatus;
    })[];
}

export const UserGame2Comp: React.FC<Props> = ({ user, gameUserBets }) => {
    return (
        <div>
            <div>Ваши баллы: {user.points}</div>
            <Table>
                <TableBody>
                    {gameUserBets.map((bet) => (
                        <TableRow key={bet.id}>
                            <TableCell className="text-center">{bet.gameUser1Bet.fullName}</TableCell>
                            <TableCell className="text-center">{bet?.betUser1}</TableCell>
                            <TableCell className="text-center">{bet.category.name}</TableCell>
                            <TableCell className="text-center">{bet.product.name}</TableCell>
                            <TableCell className="text-center">{bet.productItem.name}</TableCell>
                            <TableCell className="text-center">{bet.gameUserBetDetails}</TableCell>
                            <TableCell className="text-center">{bet.gameUserBetOpen ? "Open" : "Closed"}</TableCell>
                            <TableCell className="text-center">{bet.statusUserBet}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
