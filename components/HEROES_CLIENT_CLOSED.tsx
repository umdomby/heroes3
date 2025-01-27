"use client";
import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

interface BetParticipantCLOSED {
    id: number;
    betCLOSEDId: number;
    userId: number;
    amount: number;
    odds: number;
    profit: number;
    player: string; // Assuming PlayerChoice is a string enum
    isWinner: boolean;
    createdAt: Date;
    margin: number;
    isCovered: string;
    overlap: number;
}

interface BetCLOSED {
    id: number;
    participantsCLOSED: BetParticipantCLOSED[];
    player1: { name: string };
    player2: { name: string };
    totalBetPlayer1: number;
    totalBetPlayer2: number;
    oddsBetPlayer1: number; // Текущий коэффициент для игрока 1
    oddsBetPlayer2: number; // Текущий коэффициент для игрока 2
    createdAt: Date;
    margin: number | null; // Разрешаем margin быть null
    winnerId: number | null; // ID победителя
}

interface Props {
    user: any;
    closedBets: BetCLOSED[];
}

export const HEROES_CLIENT_CLOSED: React.FC<Props> = ({ user, closedBets }) => {
    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <p>Ваши баллы: {user.points.toFixed(2)}</p>
                </div>
            </div>

            {closedBets.map((bet) => {
                // Фильтруем ставки, в которых участвовал текущий пользователь
                const userBets = bet.participantsCLOSED.filter((p: BetParticipantCLOSED) => p.userId === user.id);

                // Если пользователь не участвовал в этой ставке, пропускаем её
                if (userBets.length === 0) return null;

                const winnerName = bet.winnerId?.toString() === bet.player1.name ? bet.player1.name : bet.player2.name;

                return (
                    <div key={bet.id} className="border border-gray-700 mt-1">
                        <Accordion type="single" collapsible>
                            <AccordionItem value={`item-${bet.id}`}>
                                <AccordionTrigger>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                {/* Игрок 1 */}
                                                <TableCell className="text-ellipsis overflow-hidden whitespace-nowrap w-[25%]">
                                                    <div>{bet.player1.name}</div>
                                                    <div>{bet.totalBetPlayer1}</div>
                                                </TableCell>

                                                {/* Игрок 2 */}
                                                <TableCell className="text-ellipsis overflow-hidden whitespace-nowrap w-[25%]">
                                                    <div>{bet.player2.name}</div>
                                                    <div>{bet.totalBetPlayer2}</div>
                                                </TableCell>

                                                {/* Коэффициент для игрока 1 и 2 */}
                                                <TableCell className="w-[15%]">
                                                    <div>{bet.oddsBetPlayer1.toFixed(2)}</div>
                                                    <div>{bet.oddsBetPlayer2.toFixed(2)}</div>
                                                </TableCell>

                                                {/* Прибыль/убыток */}
                                                <TableCell className="text-ellipsis overflow-hidden whitespace-nowrap w-[40%]">
                                                    <div>
                                                        <span>{bet.player1.name}</span> :{' '}
                                                        <span>
                              {userBets
                                  .filter((p) => p.player === 'PLAYER1')
                                  .reduce((sum, p) => sum + p.profit, 0)
                                  .toFixed(2)}
                            </span>
                                                    </div>
                                                    <div>
                                                        <span>{bet.player2.name}</span> :{' '}
                                                        <span>
                              {userBets
                                  .filter((p) => p.player === 'PLAYER2')
                                  .reduce((sum, p) => sum + p.profit, 0)
                                  .toFixed(2)}
                            </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="m-1 p-4 rounded-lg">
                                        <h4 className="text-md font-semibold mb-2">Итоги матча:</h4>
                                        <p>
                                            Победитель: <strong>{winnerName}</strong>
                                        </p>
                                    </div>

                                    {userBets.length > 0 && (
                                        <div className="m-1 p-4 rounded-lg">
                                            <h4 className="text-md font-semibold mb-2">Ваши ставки на этот матч:</h4>
                                            {userBets.map((participant) => {
                                                // Рассчитываем процент перекрытия
                                                const overlapPercentage = participant.overlap > 0
                                                    ? ((participant.overlap / (participant.amount * participant.odds)) * 100).toFixed(2)
                                                    : 0;

                                                return (
                                                    <div key={participant.id}
                                                         className="border border-gray-200 p-1 mb-1 rounded-md">
                                                        <p>
                                                            Ставка: <strong>{participant.amount}</strong> на{' '}
                                                            <strong>
                                                                {participant.player === 'PLAYER1' ? bet.player1.name : bet.player2.name}
                                                            </strong>
                                                            {','} Коэффициент: <span>{participant.odds.toFixed(2)}</span>
                                                            {','} Прибыль: <span>{participant.profit.toFixed(2)}</span>
                                                            {','} Маржа: <span>{participant.margin !== null ? participant.margin.toFixed(2) : '0.00'}</span>
                                                            {','} {new Date(participant.createdAt).toLocaleString()}
                                                        </p>
                                                        {participant.isCovered ? (
                                                            <p>
                                                                <span className="text-green-500">
                                                                    Ваша ставка перекрыта на {participant.overlap.toFixed(2)} Points (
                                                                    {overlapPercentage}%)
                                                                </span>
                                                                <br/>
                                                                <span className="text-green-500">
                                                                    Прибыль от перекрытой части: {participant.profit.toFixed(2)} Points
                                                                </span>
                                                                <br/>
                                                            </p>
                                                        ) : (
                                                            <p>
                                                                <span className="text-yellow-500">
                                                                    Ваша ставка не перекрыта (0 Points, 0%)
                                                                </span>
                                                                <br/>
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                );
            })}
        </div>
    );
};
