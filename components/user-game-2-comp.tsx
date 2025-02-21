"use client"
import React, { useState, useEffect } from 'react';
import { GameUserBet, User, Category, Product, ProductItem, $Enums } from '@prisma/client';
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { gameUserBetRegistrations, removeGameUserBetRegistration } from "@/app/actions";
import GameUserBetStatus = $Enums.GameUserBetStatus;

interface Props {
    user: User;
}

export const UserGame2Comp: React.FC<Props> = ({ user }) => {
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
        gameUserBetDataUsers2 : JSON;
    })[]>([]);
    const [successButton, setSuccessButton] = useState<number | null>(null);
    const [betInputs, setBetInputs] = useState<{ [key: number]: number }>({});
    const [descriptionInputs, setDescriptionInputs] = useState<{ [key: number]: string }>({});
    const [errorMessages, setErrorMessages] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        // Fetch initial data
        const fetchData = async () => {
            try {
                const response = await fetch('/api/sse-game-user-get');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setGameUserBets(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();

        // Set up SSE
        const eventSource = new EventSource('/api/sse-game-user/route');
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setGameUserBets(data);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const handleRemoveBet = async (gameUserBetId: number) => {
        try {
            const result = await removeGameUserBetRegistration({
                userId: user.id,
                gameUserBetId: gameUserBetId
            });

            if (result) {
                console.log("Регистрация успешно удалена");
            }
        } catch (error) {
            console.error("Ошибка при удалении регистрации:", error);
        }
    };

    const handleAddBet = async (gameUserBetId: number, betUser1: number) => {
        const betInput = betInputs[gameUserBetId] || betUser1;
        const descriptionInput = descriptionInputs[gameUserBetId] || "";

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
            const result = await gameUserBetRegistrations({
                userId: user.id,
                betUser2: betInput,
                gameUserBetDetails: descriptionInput,
                gameUserBetId: gameUserBetId,
                userTelegram: user.telegram || "No Telegram"
            });

            if (result) {
                setSuccessButton(gameUserBetId);
                setTimeout(() => {
                    setSuccessButton(null);
                }, 2000);
            }
        } catch (error) {
            console.error("Ошибка при добавлении в игру:", error);
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
            {gameUserBets.map((bet) => (
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
                                    <div className="mb-2">Participants:</div>
                                    <ul>
                                        {Array.isArray(bet.gameUserBetDataUsers2) && bet.gameUserBetDataUsers2.map((participant, index) => (
                                            <li key={index} className="flex justify-between items-center">
                                                <span>
                                                    User ID: {participant.userId}, Bet: {participant.betUser2}, Details: {participant.gameUserBetDetails}, Telegram: {participant.userTelegram}
                                                </span>
                                                {participant.userId === user.id && (
                                                    <button
                                                        onClick={() => handleRemoveBet(bet.id)}
                                                        className="ml-2 p-1 bg-red-500 text-white rounded"
                                                    >
                                                        Удалить
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-col">
                                        <input
                                            type="number"
                                            value={betInputs[bet.id] || bet.betUser1}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                setBetInputs((prev) => ({ ...prev, [bet.id]: value }));

                                                if (value > user.points) {
                                                    setErrorMessages((prev) => ({ ...prev, [bet.id]: "У вас недостаточно Points" }));
                                                } else if (value < bet.betUser1) {
                                                    setErrorMessages((prev) => ({ ...prev, [bet.id]: `Минимальное значение: ${bet.betUser1}` }));
                                                } else {
                                                    setErrorMessages((prev) => ({ ...prev, [bet.id]: "" }));
                                                }
                                            }}
                                            placeholder="Your Bet"
                                            className="mb-2 p-2 border"
                                        />
                                        {errorMessages[bet.id] && <div className="text-red-500">{errorMessages[bet.id]}</div>}
                                        <input
                                            type="text"
                                            value={descriptionInputs[bet.id] || ""}
                                            onChange={(e) => setDescriptionInputs((prev) => ({ ...prev, [bet.id]: e.target.value }))}
                                            placeholder="Description (max 150 chars)"
                                            className="mb-2 p-2 border"
                                        />
                                        {user.id === bet.gameUser1Bet.id ? (
                                            <div className="text-gray-500">Вы создатель этого события</div>
                                        ) : (
                                            <button
                                                onClick={() => handleAddBet(bet.id, bet.betUser1)}
                                                className={`p-2 text-white transition-colors duration-300 ${
                                                    successButton === bet.id ? 'bg-green-500' : 'bg-blue-500'
                                                }`}
                                            >
                                                {successButton === bet.id ? 'Added!' : 'Add to Game'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            ))}
        </div>
    );
};
