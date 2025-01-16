'use client';
import React, { useEffect, useState } from 'react';
import { Bet as PrismaBet, Player, PlayerChoice, User, BetParticipant } from '@prisma/client';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { placeBet, closeBet } from '@/app/actions';
import { unstable_batchedUpdates } from 'react-dom';

const fetcher = (url: string, options?: RequestInit) => fetch(url, options).then(res => res.json());

interface Bet extends PrismaBet {
    player1: Player;
    player2: Player;
    participants: BetParticipant[];
}

interface Props {
    user: User | null;
    className?: string;
}

// Цвета для игроков
const playerColors = {
    [PlayerChoice.PLAYER1]: 'text-blue-400 font-bold', // Синий для Player1
    [PlayerChoice.PLAYER2]: 'text-red-400 font-bold',  // Красный для Player2
};

export const HEROES_CLIENT: React.FC<Props> = ({ className, user }) => {
    const { data: session } = useSession();
    const { data: bets, error, isLoading, mutate } = useSWR<Bet[]>('/api/get-bets', fetcher);
    const [placeBetError, setPlaceBetError] = useState<string | null>(null);
    const [closeBetError, setCloseBetError] = useState<string | null>(null);
    const [selectedWinner, setSelectedWinner] = useState<number | null>(null);
    const [potentialProfit, setPotentialProfit] = useState<number | null>(null);

    useEffect(() => {
        let source = new EventSource('/api/sse');

        source.onmessage = (event) => {
            const data = JSON.parse(event.data);

            unstable_batchedUpdates(() => {
                if (data.type === 'create' || data.type === 'update' || data.type === 'delete') {
                    mutate();
                }
            });
        };

        source.onerror = (err) => {
            console.error('SSE Error:', err);
            source.close();
            setTimeout(() => {
                source = new EventSource('/api/sse');
            }, 5000);
        };

        return () => {
            source.close();
        };
    }, [mutate]);

    const handlePlaceBet = async (bet: Bet, amount: number, player: PlayerChoice) => {
        try {
            if (!user) {
                throw new Error("Пользователь не найден");
            }

            await placeBet({
                betId: bet.id,
                userId: user.id,
                amount,
                player,
            });

            mutate();
            setPlaceBetError(null);
        } catch (err) {
            if (err instanceof Error) {
                setPlaceBetError(err.message);
            } else {
                setPlaceBetError('Неизвестная ошибка');
            }
            console.error('Error placing bet:', err);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>, bet: Bet) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const amount = parseInt(formData.get('amount') as string, 10);

        if (isNaN(amount) || amount <= 0) {
            setPlaceBetError('Сумма должна быть положительным целым числом');
            return;
        }

        if (!user || user.points < amount) {
            setPlaceBetError('Недостаточно баллов для совершения ставки');
            return;
        }

        const player = formData.get('player') as PlayerChoice;
        handlePlaceBet(bet, amount, player);
    };

    const handleCloseBet = async (betId: number) => {
        if (!selectedWinner) {
            setCloseBetError('Выберите победителя!');
            return;
        }

        try {
            if (selectedWinner === null || selectedWinner === undefined) {
                throw new Error("Не выбран победитель.");
            }

            await closeBet(betId, selectedWinner);
            mutate();
            setSelectedWinner(null);
            setCloseBetError(null);
        } catch (error) {
            if (error instanceof Error) {
                setCloseBetError(error.message);
            } else {
                setCloseBetError('Не удалось закрыть ставку.');
            }
            console.error('Error closing bet:', error);
        }
    };

    if (!session) {
        return redirect('/not-auth');
    }

    if (isLoading) {
        return <div>Загрузка данных...</div>;
    }

    if (error) {
        return <div>Ошибка при загрузке данных: {error.message}</div>;
    }

    if (!bets) {
        return <div>Нет данных</div>;
    }

    return (
        <div>
            <p>Ваши баллы: {user?.points}</p>

            {/* Отображение всех ставок */}
            {bets.map((bet: Bet) => {
                const userBets = bet.participants.filter((p) => p.userId === user?.id);

                // Рассчитываем потенциальную прибыль для каждого исхода
                const profitIfPlayer1Wins = userBets
                    .filter((p) => p.player === PlayerChoice.PLAYER1)
                    .reduce((sum, p) => sum + p.profit, 0);

                const profitIfPlayer2Wins = userBets
                    .filter((p) => p.player === PlayerChoice.PLAYER2)
                    .reduce((sum, p) => sum + p.profit, 0);

                return (
                    <div key={bet.id} className="border border-gray-300 p-4 mt-4 rounded-lg shadow-sm">
                        {(() => {
                            const totalBetPlayer1 = bet.participants
                                .filter((p) => p.player === PlayerChoice.PLAYER1)
                                .reduce((sum, p) => sum + p.amount, bet.initBetPlayer1);

                            const totalBetPlayer2 = bet.participants
                                .filter((p) => p.player === PlayerChoice.PLAYER2)
                                .reduce((sum, p) => sum + p.amount, bet.initBetPlayer2);

                            const totalBets = totalBetPlayer1 + totalBetPlayer2;

                            const currentOdds1 = totalBets / totalBetPlayer1;
                            const currentOdds2 = totalBets / totalBetPlayer2;

                            return (
                                <h3 className="text-lg font-semibold">
                                    <span className={playerColors[PlayerChoice.PLAYER1]}>{bet.player1.name}</span> vs{' '}
                                    <span className={playerColors[PlayerChoice.PLAYER2]}>{bet.player2.name}</span> |{' '}
                                    Коэффициенты:{' '}
                                    <span className={playerColors[PlayerChoice.PLAYER1]}>{currentOdds1.toFixed(2)}</span> -{' '}
                                    <span className={playerColors[PlayerChoice.PLAYER2]}>{currentOdds2.toFixed(2)}</span> |{' '}
                                    Ставки на <span className={playerColors[PlayerChoice.PLAYER1]}>{bet.player1.name}</span>:{' '}
                                    <span className={playerColors[PlayerChoice.PLAYER1]}>{totalBetPlayer1}</span> |{' '}
                                    Ставки на <span className={playerColors[PlayerChoice.PLAYER2]}>{bet.player2.name}</span>:{' '}
                                    <span className={playerColors[PlayerChoice.PLAYER2]}>{totalBetPlayer2}</span>
                                </h3>
                            );
                        })()}

                        {/* Отображение ставок пользователя для текущей ставки (bet) */}
                        {userBets.length > 0 && (
                            <div className="mt-4 p-4 rounded-lg">
                                <h4 className="text-md font-semibold mb-2">Ваши ставки на этот матч:</h4>
                                {userBets.map((participant) => (
                                    <div key={participant.id} className="border border-gray-200 p-3 mb-3 rounded-md">
                                        <p>
                                            Ставка: <strong className={playerColors[participant.player]}>{participant.amount}</strong> на{' '}
                                            <strong className={playerColors[participant.player]}>
                                                {participant.player === PlayerChoice.PLAYER1 ? bet.player1.name : bet.player2.name}
                                            </strong>{','}
                                            {' '}Коэффициент: <span className={playerColors[participant.player]}>{participant.odds.toFixed(2)}</span>{','}
                                            {' '}Прибыль: <span className={playerColors[participant.player]}>{participant.profit.toFixed(2)}</span>{','}
                                            {' '}{new Date(participant.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}

                                {/* Потенциальная прибыль для каждого исхода */}
                                <div className="mt-4">
                                    <p>
                                        Если выиграет <span className={playerColors[PlayerChoice.PLAYER1]}>{bet.player1.name}</span>, вы получите:{' '}
                                        <span className={playerColors[PlayerChoice.PLAYER1]}>{profitIfPlayer1Wins.toFixed(2)}</span> баллов.
                                    </p>
                                    <p>
                                        Если выиграет <span className={playerColors[PlayerChoice.PLAYER2]}>{bet.player2.name}</span>, вы получите:{' '}
                                        <span className={playerColors[PlayerChoice.PLAYER2]}>{profitIfPlayer2Wins.toFixed(2)}</span> баллов.
                                    </p>
                                </div>
                            </div>
                        )}

                        {bet.status === 'OPEN' && (
                            <div>
                                <form onSubmit={(event) => handleSubmit(event, bet)}>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Сумма ставки"
                                        min="1"
                                        step="1"
                                        required
                                        className="border p-2 rounded w-full"
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value, 10);
                                            if (isNaN(value) || value <= 0) {
                                                setPlaceBetError('Сумма должна быть положительным целым числом');
                                                setPotentialProfit(null);
                                            } else if (user && user.points < value) {
                                                setPlaceBetError('Недостаточно баллов для совершения ставки');
                                                setPotentialProfit(null);
                                            } else {
                                                setPlaceBetError(null);
                                                const selectedPlayer = (e.target.form?.elements.namedItem('player') as RadioNodeList)?.value;
                                                if (selectedPlayer) {
                                                    const odds = selectedPlayer === PlayerChoice.PLAYER1 ? bet.currentOdds1 : bet.currentOdds2;
                                                    setPotentialProfit(value * odds);
                                                } else {
                                                    setPotentialProfit(null);
                                                }
                                            }
                                        }}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <label>
                                            <input
                                                type="radio"
                                                name="player"
                                                value={PlayerChoice.PLAYER1}
                                                required
                                                onChange={(e) => {
                                                    const amount = parseInt((e.target.form?.elements.namedItem('amount') as HTMLInputElement)?.value, 10);
                                                    if (!isNaN(amount) && amount > 0) {
                                                        setPotentialProfit(amount * bet.currentOdds1);
                                                    }
                                                }}
                                            />
                                            <span className={playerColors[PlayerChoice.PLAYER1]}>{bet.player1.name}</span>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="player"
                                                value={PlayerChoice.PLAYER2}
                                                required
                                                onChange={(e) => {
                                                    const amount = parseInt((e.target.form?.elements.namedItem('amount') as HTMLInputElement)?.value, 10);
                                                    if (!isNaN(amount) && amount > 0) {
                                                        setPotentialProfit(amount * bet.currentOdds2);
                                                    }
                                                }}
                                            />
                                            <span className={playerColors[PlayerChoice.PLAYER2]}>{bet.player2.name}</span>
                                        </label>
                                    </div>
                                    {potentialProfit !== null && (
                                        <p className="mt-2 text-green-600">
                                            Потенциальная прибыль: {potentialProfit.toFixed(2)} баллов
                                        </p>
                                    )}
                                    <Button type="submit" className="mt-2 w-full">
                                        Сделать ставку
                                    </Button>
                                </form>
                                {placeBetError && <p className="text-red-500">{placeBetError}</p>}
                            </div>
                        )}

                        {bet.status === 'OPEN' && bet.creatorId === user?.id && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Закрыть ставку</h4>
                                <div className="flex gap-2 mt-2">
                                    <label>
                                        <input
                                            type="radio"
                                            name="winner"
                                            value={bet.player1Id}
                                            onChange={() => setSelectedWinner(bet.player1Id)}
                                        />
                                        <span className={playerColors[PlayerChoice.PLAYER1]}>{bet.player1.name}</span> выиграл
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="winner"
                                            value={bet.player2Id}
                                            onChange={() => setSelectedWinner(bet.player2Id)}
                                        />
                                        <span className={playerColors[PlayerChoice.PLAYER2]}>{bet.player2.name}</span> выиграл
                                    </label>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => handleCloseBet(bet.id)}
                                    className="mt-2 w-full"
                                >
                                    Закрыть ставку
                                </Button>
                                {closeBetError && <p className="text-red-500">{closeBetError}</p>}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
