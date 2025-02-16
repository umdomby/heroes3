"use client"
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

interface BetCLOSED {
    id: number;
    player1: { id: number; name: string };
    player2: { id: number; name: string };
    player3: { id: number; name: string }; // Added third player
    totalBetPlayer1: number;
    totalBetPlayer2: number;
    totalBetPlayer3: number; // Added total bet for third player
    oddsBetPlayer1: number;
    oddsBetPlayer2: number;
    oddsBetPlayer3: number; // Added odds for third player
    createdAt: Date;
    margin: number | null;
    winnerId: number | null;
}

interface Props {
    closedBets: BetCLOSED[];
}

export const BET_ALL_CLOSED_3: React.FC<Props> = ({ closedBets }) => {
    return (
        <div>
            {closedBets.map((bet) => {
                const formattedDate = new Date(bet.createdAt).toLocaleDateString();
                const isDraw = bet.winnerId === null;
                const isPlayer1Winner = bet.winnerId === bet.player1.id;
                const isPlayer2Winner = bet.winnerId === bet.player2.id;

                // Set player colors based on the outcome
                const player1Class = isDraw ? 'text-green-500' : (isPlayer1Winner ? 'text-green-500' : 'text-red-500');
                const player2Class = isDraw ? 'text-green-500' : (isPlayer2Winner ? 'text-green-500' : 'text-red-500');
                const player3Class = isDraw ? 'text-green-500' : (!isPlayer1Winner && !isPlayer2Winner ? 'text-green-500' : 'text-red-500');

                return (
                    <div key={bet.id} className="border border-gray-700 mt-1">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={`text-center overflow-hidden whitespace-nowrap w-[15%] ${player1Class}`}>
                                        <div>{bet.player1.name}</div>
                                    </TableCell>
                                    <TableCell className={`text-center overflow-hidden whitespace-nowrap w-[15%] ${player2Class}`}>
                                        <div>{bet.player2.name}</div>
                                    </TableCell>
                                    <TableCell className={`text-center overflow-hidden whitespace-nowrap w-[15%] ${player3Class}`}>
                                        <div>{bet.player3.name}</div>
                                    </TableCell>
                                    <TableCell className={`text-center overflow-hidden whitespace-nowrap w-[15%]`}>
                                    </TableCell>
                                    <TableCell className={`text-center overflow-hidden whitespace-nowrap w-[10%] ${player1Class}`}>
                                        <div>{Math.floor(bet.totalBetPlayer1 * 100) / 100}</div>
                                    </TableCell>
                                    <TableCell className={`text-center overflow-hidden whitespace-nowrap w-[10%] ${player2Class}`}>
                                        <div>{Math.floor(bet.totalBetPlayer2 * 100) / 100}</div>
                                    </TableCell>
                                    <TableCell className={`text-center overflow-hidden whitespace-nowrap w-[10%] ${player3Class}`}>
                                        <div>{Math.floor(bet.totalBetPlayer3 * 100) / 100}</div>
                                    </TableCell>
                                    <TableCell className={`text-center overflow-hidden whitespace-nowrap w-[10%]`}>
                                    </TableCell>
                                    <TableCell className="text-right overflow-hidden whitespace-nowrap w-[10%]">
                                        <div> {formattedDate}</div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                );
            })}
        </div>
    );
};
