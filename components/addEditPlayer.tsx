'use client';

import React, { useState } from 'react';
import { addEditPlayer } from '@/app/actions';
import { Player, User } from "@prisma/client";
import { Input, Button} from "@/components/ui";
import {
    Table,
    TableBody,
    TableCell, TableHead, TableHeader,
    TableRow,
} from "@/components/ui/table";
interface Props {
    user: User;
    players: Player[];
    className?: string;
}

export const AddEditPlayer: React.FC<Props> = ({ user, players, className }) => {
    const [playerName, setPlayerName] = useState('');
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await addEditPlayer(selectedPlayerId, playerName);
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
        <div className={className}>
            <h1 className="text-3xl font-bold mb-4">Manage Players</h1>
            <form onSubmit={handleSubmit} className="mb-6">
                <Input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter player name"
                    required
                    className="mb-4"
                />
                <Button type="submit" className="bg-blue-500 text-white">
                    {selectedPlayerId ? 'Edit Player' : 'Add Player'}
                </Button>
            </form>

            <h2 className="text-2xl font-semibold mb-2">Existing Players</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Player Name</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {players.map((player) => (
                        <TableRow key={player.id}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleEditClick(player)} className="bg-green-500 text-white">
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
