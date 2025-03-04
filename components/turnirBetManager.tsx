'use client';
import React, { useState } from "react";
import { adminTrurnirBetPage } from "@/app/actions";
import { Button, Input } from "@/components/ui";
import { TurnirBet } from "@prisma/client";

// Определяем интерфейс для параметров компонента
interface TurnirBetManagerProps {
    turnirBets: TurnirBet[];
}

function TurnirBetManager({ turnirBets }: TurnirBetManagerProps) {
    const [newTurnirName, setNewTurnirName] = useState('');
    const [turnirNames, setTurnirNames] = useState(turnirBets);
    const [alertMessage, setAlertMessage] = useState('');

    const handleAddTurnir = async () => {
        try {
            const response = await adminTrurnirBetPage({ action: 'add', turnirName: newTurnirName });
            if (response.success) {
                setTurnirNames([...turnirNames, { id: response.id, name: newTurnirName }]);
                setNewTurnirName('');
                showAlert('Турнир успешно добавлен');
            } else {
                showAlert(response.message);
            }
        } catch (error) {
            console.error('Ошибка при добавлении турнира:', error);
        }
    };

    const handleEditTurnir = async (id: number, newName: string) => {
        try {
            const response = await adminTrurnirBetPage({ action: 'edit', id, turnirName: newName });
            if (response.success) {
                setTurnirNames(turnirNames.map(t => t.id === id ? { ...t, name: newName } : t));
                showAlert('Турнир успешно обновлен');
            }
        } catch (error) {
            console.error('Ошибка при редактировании турнира:', error);
        }
    };

    const handleDeleteTurnir = async (id: number) => {
        try {
            const response = await adminTrurnirBetPage({ action: 'delete', id });
            if (response.success) {
                setTurnirNames(turnirNames.filter(t => t.id !== id));
                showAlert('Турнир успешно удален');
            }
        } catch (error) {
            console.error('Ошибка при удалении турнира:', error);
        }
    };

    const showAlert = (message: string) => {
        setAlertMessage(message);
        setTimeout(() => {
            setAlertMessage('');
        }, 3000); // Показываем сообщение на 3 секунды
    };

    return (
        <div>
            <h1>Управление турнирами</h1>
            <div className="flex my-3">
                <Input
                    className="mx-3 w-[50%] h-6"
                    type="text"
                    value={newTurnirName}
                    onChange={(e) => setNewTurnirName(e.target.value)}
                    placeholder="Название нового турнира"
                />
                <Button className='h-6' onClick={handleAddTurnir}>Добавить турнир</Button>
            </div>
            <div>
                {turnirNames.map(turnir => (
                    <div className="my-2 flex" key={turnir.id}>
                        <Input
                            className="mx-3 w-[50%] h-6"
                            type="text"
                            value={turnir.name}
                            onChange={(e) => setTurnirNames(turnirNames.map(t => t.id === turnir.id ? { ...t, name: e.target.value } : t))}
                        />
                        <Button className='h-6' onClick={() => handleEditTurnir(turnir.id, turnir.name)}>Сохранить</Button>
                        <Button className='h-6' onClick={() => handleDeleteTurnir(turnir.id)}>Удалить</Button>
                    </div>
                ))}
            </div>
            {alertMessage && <div className="alert">{alertMessage}</div>}
        </div>
    );
}

export default TurnirBetManager;
