"use client"
import React, { useState } from 'react';
import { GameUserBet, User, Category, Product, ProductItem, $Enums } from '@prisma/client';
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { gameUserBetRegistrations } from "@/app/actions";
import GameUserBetStatus = $Enums.GameUserBetStatus;

// Компонент уведомления
const Notification: React.FC<{ message: string; duration: number; onClose: () => void }> = ({ message, duration, onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-4 bg-green-800 text-white rounded p-4"
            style={{ fontSize: '24px' }} // Adjust the font size as needed
        >
            {message}
        </div>
    );
};

interface Props {
    user: User;
    gameUserBets: (GameUserBet & {
        gameUser1Bet: User;
        gameUser2Bet: User | null;
        category: Category;
        product: Product;
        productItem: ProductItem;
        gameUserBetDetails: string;
        betUser1: number;
        gameUserBetOpen: boolean;
        statusUserBet: GameUserBetStatus;
    })[];
}

export const UserGame2Comp: React.FC<Props> = ({ user, gameUserBets }) => {
    const [showNotification, setShowNotification] = useState(false);

    return (
        <div>
            {showNotification && (
                <Notification
                    message="Вы успешно добавлены в игру"
                    duration={2000}
                    onClose={() => setShowNotification(false)}
                />
            )}
            <div className="flex justify-between items-center">
                <div>Points: {user?.points}</div>
                <Link className="text-blue-500" href="/user-game-create-2">Create game</Link>
            </div>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Name</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Bet</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Map</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Size</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Timer</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">State</TableHead>
                        <TableHead className="text-center overflow-hidden whitespace-nowrap w-[10%]">Telegram</TableHead>
                    </TableRow>
                </TableBody>
            </Table>
            {gameUserBets.map((bet) => {
                const [betInput, setBetInput] = useState<number>(bet.betUser1);
                const [descriptionInput, setDescriptionInput] = useState<string>("");
                const [errorMessage, setErrorMessage] = useState<string>("");

                const handleAddBet = async (gameUserBetId: number, betUser1: number) => {
                    if (betInput > user.points) {
                        alert("У вас недостаточно Points");
                        return;
                    }
                    if (betInput < betUser1) {
                        alert("Ставка должна быть не меньше, чем у User1");
                        return;
                    }
                    if (descriptionInput.length > 150) {
                        alert("Описание не должно превышать 150 символов");
                        return;
                    }

                    try {
                        await gameUserBetRegistrations({
                            userId: user.id,
                            betUser2: betInput,
                            gameUserBetDetails: descriptionInput,
                            gameUserBetId: gameUserBetId
                        });
                        setShowNotification(true); // Показать уведомление
                    } catch (error) {
                        console.error("Ошибка при добавлении в игру:", error);
                    }
                };

                return (
                    <div key={bet.id} className="border border-gray-700 mt-1">
                        <Accordion type="single" collapsible>
                            <AccordionItem value={`item-${bet.id}`}>
                                <AccordionTrigger className={user.id === bet.gameUser1Bet.id ? 'bg-gray-500' : ''}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.gameUser1Bet.fullName}</TableCell>
                                                <TableCell className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.betUser1}</TableCell>
                                                <TableCell className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.category.name}</TableCell>
                                                <TableCell className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.product.name}</TableCell>
                                                <TableCell className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.productItem.name}</TableCell>
                                                <TableCell className="text-center overflow-hidden whitespace-nowrap w-[10%]">{bet.statusUserBet}</TableCell>
                                                <TableCell className="text-center overflow-hidden whitespace-nowrap w-[10%]">
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
                                        <div className="mb-2">Description: {bet.gameUserBetDetails}</div>
                                        <div className="mb-2">Open Bet: {bet.gameUserBetOpen ? "Open" : "Closed"}</div>
                                        <div className="flex flex-col">
                                            <input
                                                type="number"
                                                value={betInput}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    setBetInput(value);

                                                    if (value > user.points) {
                                                        setErrorMessage("У вас недостаточно Points");
                                                    } else if (value < bet.betUser1) {
                                                        setErrorMessage(`Минимальное значение: ${bet.betUser1}`);
                                                    } else {
                                                        setErrorMessage("");
                                                    }
                                                }}
                                                placeholder="Your Bet"
                                                className="mb-2 p-2 border"
                                            />
                                            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                                            <input
                                                type="text"
                                                value={descriptionInput}
                                                onChange={(e) => setDescriptionInput(e.target.value)}
                                                placeholder="Description (max 150 chars)"
                                                className="mb-2 p-2 border"
                                            />
                                            {user.id === bet.gameUser1Bet.id ? (
                                                <div className="text-gray-500">Вы создатель этого события</div>
                                            ) : (
                                                <button
                                                    onClick={() => handleAddBet(bet.id, bet.betUser1)}
                                                    className="p-2 bg-blue-500 text-white"
                                                >
                                                    Add to Game
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                );
            })}
        </div>
    );
};