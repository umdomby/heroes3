"use client";
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHeader,
    TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";
import { getEmailByCardId, transferPoints } from "@/app/actions";

interface Props {
    user: User;
    className?: string;
}

export const TRANSFER_POINTS: React.FC<Props> = ({ user, className }) => {
    const [cardId, setCardId] = useState('');
    const [points, setPoints] = useState(50);
    const [transferHistory, setTransferHistory] = useState([]);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    const handleTransfer = async () => {
        if (points < 50 || points > user.points) {
            alert('Недопустимое количество баллов');
            return;
        }

        const { email, error } = await getEmailByCardId(cardId);

        if (email) {
            setRecipientEmail(email);
            setShowDialog(true);
        } else {
            alert(error || 'Пользователь не найден');
        }
    };

    const confirmTransfer = async () => {
        const result = await transferPoints(cardId, points);

        if (result) {
            alert('Баллы успешно переданы');
            setTransferHistory([...transferHistory, { cardId, points }]);
            setShowDialog(false);
        } else {
            alert('Передача не удалась');
        }
    };

    return (
        <div className={`p-4 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-lg font-semibold">Баллы: {Math.floor(user.points * 100) / 100}</p>
                </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleTransfer(); }} className="space-y-4">
                <Input
                    type="text"
                    placeholder="ID карты получателя"
                    value={cardId}
                    onChange={(e) => setCardId(e.target.value)}
                    required
                    className="w-full"
                />
                <Input
                    type="number"
                    min="50"
                    max={user.points}
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    required
                    className="w-full"
                />
                <Button type="submit" className="w-full bg-blue-500 text-white">Передать баллы</Button>
            </form>

            {showDialog && (
                <div className="dialog mt-4 p-4 border rounded shadow-lg">
                    <p>Email получателя: {recipientEmail}</p>
                    <Button onClick={() => navigator.clipboard.writeText(recipientEmail)} className="mr-2">Копировать Email</Button>
                    <Button onClick={confirmTransfer} className="bg-green-500 text-white">Подтвердить передачу</Button>
                </div>
            )}

            <Table className="mt-6">
                <TableHeader>
                    <TableRow>
                        <TableHead>ID карты</TableHead>
                        <TableHead>Баллы</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transferHistory.map((transfer, index) => (
                        <TableRow key={index}>
                            <TableCell>{transfer.cardId}</TableCell>
                            <TableCell>{transfer.points}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
