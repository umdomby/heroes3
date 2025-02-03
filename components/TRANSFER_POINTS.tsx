"use client";
import React, {useEffect, useState} from 'react';
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

interface Transfer {
    transferUser1Id: number;
    transferUser2Id: number | null; // Allow null
    transferPoints: number;
    createdAt: Date;
    transferUser1: { cardId: string };
    transferUser2: { cardId: string } | null; // Allow null
}

interface Props {
    user: User;
    transferHistory: Transfer[];
    className?: string;
}

export const TRANSFER_POINTS: React.FC<Props> = ({ user, transferHistory, className }) => {
    const [cardId, setCardId] = useState('');
    const [points, setPoints] = useState(50);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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
            setSuccessMessage('Баллы успешно переданы');
            setShowDialog(false);
            setTimeout(() => setSuccessMessage(''), 3000); // Убираем сообщение через 3 секунды
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
                    onChange={(e) => {
                        const value = e.target.value;
                        setPoints(value === '' ? '' : Number(value));
                    }}
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

            {successMessage && (
                <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
                    {successMessage}
                </div>
            )}

            <Table className="mt-6">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Дата</TableHead>
                        <TableHead className="text-center">Тип</TableHead>
                        <TableHead className="text-center">ID карты</TableHead>
                        <TableHead className="text-center">Баллы</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transferHistory.map((transfer, index) => (
                        <TableRow key={index}>
                            <TableCell className="text-center">{new Date(transfer.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-center">{transfer.transferUser1Id === user.id ? 'Исходящий' : 'Входящий'}</TableCell>
                            <TableCell className="text-center">{transfer.transferUser1Id === user.id ? transfer.transferUser2.cardId : transfer.transferUser1.cardId}</TableCell>
                            <TableCell className="text-center">{transfer.transferUser1Id === user.id ? `-${transfer.transferPoints}` : `+${transfer.transferPoints}`}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
