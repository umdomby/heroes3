"use client";
import React, {useState} from 'react';
import {createTurnir, updateTurnir, deleteTurnir} from '@/app/actions';
import {Button, Input} from "@/components/ui";

interface Turnir {
    id: number;
    titleTurnir: string;
    textTurnirTurnir: string;
    startPointsTurnir: number;
}

interface User {
    id: number;
    fullName: string;
    role: string;
}

interface Props {
    className?: string;
    user: User;
    turnirs: Turnir[];
}

export const TURNIR_ADMIN: React.FC<Props> = ({className, user, turnirs: initialTurnirs}) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [startPoints, setStartPoints] = useState(0);
    const [turnirs, setTurnirs] = useState<Turnir[]>(initialTurnirs);

    const handleCreate = async () => {
        try {
            const newTurnir = await createTurnir({
                titleTurnir: title,
                textTurnirTurnir: text,
                startPointsTurnir: startPoints
            });
            setTurnirs([...turnirs, newTurnir]);
            alert('Турнир успешно создан');
        } catch (error) {
            console.error('Ошибка при создании турнира:', error);
            alert('Не удалось создать турнир');
        }
    };

    const handleUpdate = async (id: number, updatedData: Partial<Turnir>) => {
        try {
            const updatedTurnir = await updateTurnir(id, updatedData);
            setTurnirs(turnirs.map(t => (t.id === id ? updatedTurnir : t)));
            alert('Турнир успешно обновлен');
        } catch (error) {
            console.error('Ошибка при обновлении турнира:', error);
            alert('Не удалось обновить турнир');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteTurnir(id);
            setTurnirs(turnirs.filter(t => t.id !== id));
            alert('Турнир успешно удален');
        } catch (error) {
            console.error('Ошибка при удалении турнира:', error);
            alert('Не удалось удалить турнир');
        }
    };

    return (
        <div className={className}>
            <h2>Создать турнир</h2>
            <div><Input type="text" placeholder="Название турнира" value={title}
                        onChange={(e) => setTitle(e.target.value)}/></div>
            <div><Input type="text" placeholder="Описание турнира" value={text}
                        onChange={(e) => setText(e.target.value)}/></div>
            <div><Input type="number" placeholder="Начальные очки" value={startPoints}
                        onChange={(e) => setStartPoints(Number(e.target.value))}/></div>
            <div><Button onClick={handleCreate}>Создать</Button></div>


            <h2>Существующие турниры</h2>
            {turnirs.length === 0 ? (
                <p>Турниры отсутствуют</p>
            ) : (
                <div className="my-5">
                    {turnirs.map(turnir => (
                        <div className="my-5" key={turnir.id}>
                            <div>
                                <Input
                                    type="text"
                                    value={turnir.titleTurnir}
                                    onChange={(e) => handleUpdate(turnir.id, {titleTurnir: e.target.value})}
                                />
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    value={turnir.textTurnirTurnir}
                                    onChange={(e) => handleUpdate(turnir.id, {textTurnirTurnir: e.target.value})}
                                />
                            </div>
                            <div>
                                <Input
                                    type="number"
                                    value={turnir.startPointsTurnir}
                                    onChange={(e) => handleUpdate(turnir.id, {startPointsTurnir: Number(e.target.value)})}
                                />
                            </div>

                            <div>
                                <Button onClick={() => handleDelete(turnir.id)}>Удалить</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
