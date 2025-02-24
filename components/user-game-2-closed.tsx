"use client"
import React, {useState, useEffect} from 'react';
import {GameUserBet, User, Category, Product, ProductItem, $Enums, WinGameUserBet} from '@prisma/client';
import {Table, TableBody, TableCell, TableRow, TableHead} from "@/components/ui/table";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import Link from "next/link";
import {
     gameRatingGameUsers, gameUserStartBet // Import the delete function
} from "@/app/actions";
import GameUserBetStatus = $Enums.GameUserBetStatus;
import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button, Input} from "@/components/ui";
import RatingUserEnum = $Enums.RatingUserEnum;

interface Props {
    user: User;
    gameUserBetsData : GameUserBet;
}

export const UserGame2Closed: React.FC<Props> = ({user, gameUserBetsData}) => {
    const [gameUserBets, setGameUserBets] = useState<(GameUserBet & {
        gameUser1Bet: User;
        gameUser2Bet: User | null;
        category: Category;
        product: Product;
        productItem: ProductItem;
        gameUserBetDetails: string;
        betUser1: number;
        gameUserBetOpen: boolean;
        statusUserBet: GameUserBetStatus;
        gameUserBetDataUsers2: JSON;
        checkWinUser1: WinGameUserBet | null;
        checkWinUser2: WinGameUserBet | null;
        gameUser1Rating: RatingUserEnum;
    })[]>([]);

    const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");


    useEffect(() => {
        setGameUserBets(gameUserBetsData);
    }, [gameUserBetsData]);


    const handleRating = async (gameUserBetId: number, userType: 'user1' | 'user2', rating: RatingUserEnum) => {
        try {
            await gameRatingGameUsers({
                gameUserBetId,
                user1Rating: userType === 'user1' ? rating : null,
                user2Rating: userType === 'user2' ? rating : null,
            });

            console.log('Рейтинг успешно отправлен');
        } catch (error) {
            console.error('Ошибка при отправке рейтинга:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>Points: {user?.points}</div>
                <Link className="text-blue-500" href="/user-game-create-2">Create game</Link>
            </div>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Set</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Bet</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Name</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Map</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Size</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Timer</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">State</TableHead>
                        <TableHead
                            className="text-center overflow-hidden whitespace-nowrap w-[10%]">Telegram</TableHead>
                    </TableRow>
                </TableBody>
            </Table>
            {gameUserBets.map((bet) => (
                <div key={bet.id} className="border border-gray-700 mt-1">
                    <Accordion type="single" collapsible>
                        <AccordionItem value={`item-${bet.id}`}>
                            <AccordionTrigger className={user.id === bet.gameUser1Bet.id ? 'text-red-500' : ''}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell
                                                className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.betUser1}</TableCell>
                                            <TableCell
                                                className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.gameUserBetOpen ? "Open" : "Closed"}</TableCell>
                                            <TableCell
                                                className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.gameUser1Bet.fullName}</TableCell>
                                            <TableCell
                                                className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.category.name}</TableCell>
                                            <TableCell
                                                className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.product.name}</TableCell>
                                            <TableCell
                                                className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.productItem.name}</TableCell>
                                            <TableCell
                                                className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.statusUserBet}</TableCell>
                                            <TableCell
                                                className="text-center overflow-hidden whitespace-nowrap w-[10%]">
                                                {bet.gameUser1Bet.telegram ? (
                                                    <Link
                                                        className="text-center text-blue-500 hover:text-green-300 font-bold"
                                                        href={bet.gameUser1Bet.telegram.replace(/^@/, 'https://t.me/')}
                                                        target="_blank"
                                                    >
                                                        {bet.gameUser1Bet.telegram}
                                                    </Link>
                                                ) : (
                                                    "No Telegram"
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-4">
                                    <div className="mb-2"><span
                                        className="text-green-500">Description: </span> {bet.gameUserBetDetails}</div>
                                    {bet.statusUserBet === "CLOSED" && (
                                        <div>
                                            <div className={
                                                bet.checkWinUser1 === WinGameUserBet.WIN ? 'text-green-500' :
                                                    bet.checkWinUser1 === WinGameUserBet.LOSS ? 'text-red-500' :
                                                        bet.checkWinUser1 === WinGameUserBet.DRAW ? 'text-yellow-500' : ''
                                            }>
                                                {bet.gameUser1Bet.telegram}, {" "} Bet: {bet.betUser1} {" "}
                                                {bet.gameUser1Rating !== null ? (
                                                    <span
                                                        className={bet.gameUser1Rating === RatingUserEnum.PLUS ? 'text-green-500' : 'text-red-500'}>
                                                        {bet.gameUser1Rating === RatingUserEnum.PLUS ? 'Плюс' : 'Минус'}
                                                    </span>
                                                ) : (
                                                    <div className="text-gray-500">нет голоса</div>
                                                )}
                                            </div>
                                            <div className={
                                                bet.checkWinUser2 === WinGameUserBet.WIN ? 'text-green-500' :
                                                    bet.checkWinUser2 === WinGameUserBet.LOSS ? 'text-red-500' :
                                                        bet.checkWinUser2 === WinGameUserBet.DRAW ? 'text-yellow-500' : ''
                                            }>
                                                {bet.gameUser2Bet?.telegram || "No Telegram"}, {" "} Bet: {bet.betUser2} {" "}
                                                {bet.gameUser2Rating !== null ? (
                                                    <span
                                                        className={bet.gameUser2Rating === RatingUserEnum.PLUS ? 'text-green-500' : 'text-red-500'}>
                                                        {bet.gameUser2Rating === RatingUserEnum.PLUS ? 'Плюс' : 'Минус'}
                                                    </span>
                                                ) : (
                                                    <div className="text-gray-500">Оппонент не голосовал</div>
                                                )}
                                            </div>

                                            {user.id === bet.gameUser1Bet.id && (
                                                <div>
                                                    <Button
                                                        onClick={() => handleRating(bet.id, 'user2', RatingUserEnum.PLUS)}
                                                        className={`${bet.gameUser2Rating === RatingUserEnum.PLUS ? 'bg-green-500' : 'bg-gray-500'} h-6`}
                                                    >
                                                        Плюс
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleRating(bet.id, 'user2', RatingUserEnum.MINUS)}
                                                        className={`${bet.gameUser2Rating === RatingUserEnum.MINUS ? 'bg-red-500' : 'bg-gray-500'} h-6`}
                                                    >
                                                        Минус
                                                    </Button>
                                                </div>
                                            )}

                                            {bet.gameUser2Bet && user.id === bet.gameUser2Bet.id && (
                                                <div>
                                                    <Button
                                                        onClick={() => handleRating(bet.id, 'user1', RatingUserEnum.PLUS)}
                                                        className={`${bet.gameUser1Rating === RatingUserEnum.PLUS ? 'bg-green-500' : 'bg-gray-500'} h-6`}
                                                    >
                                                        Плюс
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleRating(bet.id, 'user1', RatingUserEnum.MINUS)}
                                                        className={`${bet.gameUser1Rating === RatingUserEnum.MINUS ? 'bg-red-500' : 'bg-gray-500'} h-6`}
                                                    >
                                                        Минус
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div>Старт: {new Date(bet.createdAt).toLocaleString()}</div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            ))}
            <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
                <DialogContent>
                    <DialogTitle></DialogTitle>
                    <DialogDescription>{errorMessage}</DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    );
};