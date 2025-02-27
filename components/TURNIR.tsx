"use client";
import React, { useState } from 'react';
import { playerTurnirAdd, playerTurnirDelete, playerTurnirAdminUpdate, playerTurnirAdminDelete } from '@/app/actions';
import { Button, Input } from "@/components/ui";

interface User {
    id: number;
    fullName: string;
    role: string;
    points: number;
}

interface Turnir {
    id: number;
    titleTurnir: string;
    startPointsTurnir: number;
}

interface TurnirPlayer {
    id: number;
    userId: number;
    turnirId: number;
    startPointsPlayer: number;
}

interface Props {
    className?: string;
    user: User;
    turnirs: Turnir[];
}

export const TURNIR: React.FC<Props> = ({ className, user, turnirs }) => {
    const [selectedTurnir, setSelectedTurnir] = useState<number | null>(null);
    const [players, setPlayers] = useState<TurnirPlayer[]>([]);

    const handleAddPlayer = async () => {
        if (!selectedTurnir) return;

        try {
            const response = await playerTurnirAdd(user.id, selectedTurnir);
            alert(response.message);
            // Обновите список игроков, если необходимо
        } catch (error) {
            console.error('Ошибка при добавлении игрока:', error);
            alert('Не удалось добавить игрока');
        }
    };

    const handleDeletePlayer = async (playerId: number) => {
        try {
            const response = await playerTurnirDelete(user.id, playerId);
            alert(response.message);
            // Обновите список игроков, если необходимо
        } catch (error) {
            console.error('Ошибка при удалении игрока:', error);
            alert('Не удалось удалить игрока');
        }
    };

    const handleAdminUpdatePlayer = async (playerId: number, newPoints: number, newTurnirId: number) => {
        try {
            const response = await playerTurnirAdminUpdate(playerId, newPoints, newTurnirId);
            alert(response.message);
            // Обновите список игроков, если необходимо
        } catch (error) {
            console.error('Ошибка при обновлении игрока:', error);
            alert('Не удалось обновить игрока');
        }
    };

    const handleAdminDeletePlayer = async (playerId: number) => {
        try {
            const response = await playerTurnirAdminDelete(playerId);
            alert(response.message);
            // Обновите список игроков, если необходимо
        } catch (error) {
            console.error('Ошибка при удалении игрока администратором:', error);
            alert('Не удалось удалить игрока');
        }
    };

    return (
        <div className={className}>
            <h2>Турниры</h2>
            <select onChange={(e) => setSelectedTurnir(Number(e.target.value))}>
                <option value="">Выберите турнир</option>
                {turnirs.map(turnir => (
                    <option key={turnir.id} value={turnir.id}>
                        {turnir.titleTurnir}
                    </option>
                ))}
            </select>
            <Button onClick={handleAddPlayer}>Добавить в турнир</Button>

            {user.role === 'ADMIN' && (
                <div>
                    <h2>Управление игроками</h2>
                    {players.map(player => (
                        <div key={player.id}>
                            <span>Игрок ID: {player.userId}</span>
                            <Input
                                type="number"
                                value={player.startPointsPlayer}
                                onChange={(e) => handleAdminUpdatePlayer(player.id, Number(e.target.value), player.turnirId)}
                            />
                            <Button onClick={() => handleAdminDeletePlayer(player.id)}>Удалить игрока</Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};