'use client';

import React, { useState } from 'react';
import { addEditPlayer } from '@/app/actions';
import { Player, User } from "@prisma/client";

interface Props {
    user: User;
    players: Player[];
}

export const AddEditPlayer: React.FC<Props> = ({ user, players }) => {
    const [playerName, setPlayerName] = useState('');
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await addEditPlayer(selectedPlayerId, playerName);
            // Обновите состояние или перезагрузите страницу, чтобы отобразить изменения
            alert('Player saved successfully');
        } catch (error) {
            console.error('Failed to save player:', error);
            alert('Failed to save player');
        }
    };

    const handleEditClick = (player: Player) => {
        setPlayerName(player.name);
        setSelectedPlayerId(player.id);
    };

    return (
        <div>
            <h1>Manage Players</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter player name"
                    required
                />
                <button type="submit">
                    {selectedPlayerId ? 'Edit Player' : 'Add Player'}
                </button>
            </form>

            <h2>Existing Players</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        {player.name}
                        <button onClick={() => handleEditClick(player)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
