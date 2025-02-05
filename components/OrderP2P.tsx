"use client";
import React, { useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { User, OrderP2P as OrderP2PType } from "@prisma/client";
import { createBuyOrder, createSellOrder, buyPayPointsOpen } from '@/app/actions.ts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
    user: User;
    openOrders: OrderP2PType[];
    className?: string;
}

export const OrderP2P: React.FC<Props> = ({ user, openOrders, className }) => {
    const [buyPoints, setBuyPoints] = useState<number>(0);
    const [sellPoints, setSellPoints] = useState<number>(0);
    const [selectedBankDetailsForBuy, setSelectedBankDetailsForBuy] = useState<any[]>([]);
    const [selectedBankDetailsForSell, setSelectedBankDetailsForSell] = useState<any[]>([]);
    const [selectedBankDetailsForInteraction, setSelectedBankDetailsForInteraction] = useState<any[]>([]);
    const [allowPartialBuy, setAllowPartialBuy] = useState<boolean>(false);
    const [allowPartialSell, setAllowPartialSell] = useState<boolean>(false);
    const [isBuySelectOpen, setIsBuySelectOpen] = useState<boolean>(false);
    const [isSellSelectOpen, setIsSellSelectOpen] = useState<boolean>(false);

    const handleSelectBankDetail = (detail: any, setSelectedDetails: React.Dispatch<React.SetStateAction<any[]>>) => {
        setSelectedDetails((prevDetails) => {
            if (prevDetails.includes(detail)) {
                return prevDetails.filter((d) => d !== detail);
            } else {
                return [...prevDetails, { ...detail, price: 0 }];
            }
        });
    };

    const handleSelectAllBankDetails = (setSelectedDetails: React.Dispatch<React.SetStateAction<any[]>>, closeSelect: React.Dispatch<React.SetStateAction<boolean>>) => {
        setSelectedDetails(user.bankDetails.map((detail: any) => ({ ...detail, price: 0 })));
        closeSelect(false);
    };

    const handleClearBankDetails = (setSelectedDetails: React.Dispatch<React.SetStateAction<any[]>>, closeSelect: React.Dispatch<React.SetStateAction<boolean>>) => {
        setSelectedDetails([]);
        closeSelect(false);
    };

    const handlePriceChange = (index: number, value: string, setSelectedDetails: React.Dispatch<React.SetStateAction<any[]>>) => {
        const price = parseInt(value, 10);
        setSelectedDetails((prevDetails) => {
            const newDetails = [...prevDetails];
            newDetails[index].price = isNaN(price) ? 0 : price;
            return newDetails;
        });
    };

    const handleCreateOrder = async (points: number, selectedDetails: any[], allowPartial: boolean, createOrderFunc: Function, successMessage: string, errorMessage: string) => {
        try {
            await createOrderFunc(points, selectedDetails, allowPartial);
            alert(successMessage);
        } catch (error) {
            console.error(errorMessage, error);
            alert(errorMessage);
        }
    };

    const handleConcludeDeal = async (order: OrderP2PType) => {
        if (order.orderP2PUser1Id === user.id) {
            alert('Вы не можете заключать сделку с самим собой');
            return;
        }

        try {
            await buyPayPointsOpen();
            alert('Сделка успешно заключена');
        } catch (error) {
            console.error('Ошибка при заключении сделки:', error);
            alert('Не удалось заключить сделку');
        }
    };

    const isCreateOrderDisabled = (points: number, selectedDetails: any[]) => {
        return points <= 0 || selectedDetails.length === 0 || selectedDetails.some(detail => detail.price <= 0);
    };

    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-lg font-semibold">Points: {Math.floor(user.points * 100) / 100}</p>
                </div>
            </div>
            <div className="flex space-x-4">
                <div className="w-1/2">
                    <h2 className="text-xl font-bold mb-2">Купить Points</h2>
                    <Input
                        type="number"
                        step="1"
                        value={buyPoints}
                        onChange={(e) => setBuyPoints(Number(e.target.value))}
                        placeholder="Сколько хотите купить"
                        className="mb-2"
                    />
                    <Select
                        open={isBuySelectOpen}
                        onOpenChange={setIsBuySelectOpen}
                        onValueChange={(detail) => handleSelectBankDetail(detail, setSelectedBankDetailsForBuy)}
                        placeholder="Выберите реквизиты банка"
                        className="mb-2"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Выберите реквизиты банка" />
                        </SelectTrigger>
                        <SelectContent>
                            <Button onClick={() => handleSelectAllBankDetails(setSelectedBankDetailsForBuy, setIsBuySelectOpen)} className="mb-2">Выбрать все</Button>
                            <Button onClick={() => handleClearBankDetails(setSelectedBankDetailsForBuy, setIsBuySelectOpen)} className="mb-2">Закрыть все</Button>
                            {user.bankDetails && user.bankDetails.map((detail, index) => (
                                <SelectItem key={index} value={detail}>
                                    {detail.name} - {detail.details}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedBankDetailsForBuy.map((detail, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <span>{detail.name} - {detail.details}</span>
                            <Input
                                type="number"
                                step="1"
                                value={detail.price.toString()}
                                onChange={(e) => handlePriceChange(index, e.target.value, setSelectedBankDetailsForBuy)}
                                placeholder="Цена"
                                className="ml-2"
                            />
                        </div>
                    ))}
                    <label className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={allowPartialBuy}
                            onChange={() => setAllowPartialBuy(!allowPartialBuy)}
                            className="mr-2"
                        />
                        Покупать частями
                    </label>
                    <Button onClick={() => handleCreateOrder(buyPoints, selectedBankDetailsForBuy, allowPartialBuy, createBuyOrder, 'Заявка на покупку успешно создана', 'Не удалось создать заявку на покупку')} className="w-full" disabled={isCreateOrderDisabled(buyPoints, selectedBankDetailsForBuy)}>Создать заявку</Button>
                </div>
                <div className="w-1/2">
                    <h2 className="text-xl font-bold mb-2">Продать Points</h2>
                    <Input
                        type="number"
                        step="1"
                        value={sellPoints}
                        onChange={(e) => setSellPoints(Number(e.target.value))}
                        placeholder="Сколько хотите продать"
                        className="mb-2"
                    />
                    <Select
                        open={isSellSelectOpen}
                        onOpenChange={setIsSellSelectOpen}
                        onValueChange={(detail) => handleSelectBankDetail(detail, setSelectedBankDetailsForSell)}
                        placeholder="Выберите реквизиты банка"
                        className="mb-2"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Выберите реквизиты банка" />
                        </SelectTrigger>
                        <SelectContent>
                            <Button onClick={() => handleSelectAllBankDetails(setSelectedBankDetailsForSell, setIsSellSelectOpen)} className="mb-2">Выбрать все</Button>
                            <Button onClick={() => handleClearBankDetails(setSelectedBankDetailsForSell, setIsSellSelectOpen)} className="mb-2">Закрыть все</Button>
                            {user.bankDetails && user.bankDetails.map((detail, index) => (
                                <SelectItem key={index} value={detail}>
                                    {detail.name} - {detail.details}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedBankDetailsForSell.map((detail, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <span>{detail.name} - {detail.details}</span>
                            <Input
                                type="number"
                                step="1"
                                value={detail.price.toString()}
                                onChange={(e) => handlePriceChange(index, e.target.value, setSelectedBankDetailsForSell)}
                                placeholder="Цена"
                                className="ml-2"
                            />
                        </div>
                    ))}
                    <label className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={allowPartialSell}
                            onChange={() => setAllowPartialSell(!allowPartialSell)}
                            className="mr-2"
                        />
                        Продавать частями
                    </label>
                    <Button onClick={() => handleCreateOrder(sellPoints, selectedBankDetailsForSell, allowPartialSell, createSellOrder, 'Заявка на продажу успешно создана', 'Не удалось создать заявку на продажу')} className="w-full" disabled={isCreateOrderDisabled(sellPoints, selectedBankDetailsForSell)}>Создать заявку</Button>
                </div>
            </div>
            <Accordion className="mt-4">
                {openOrders.map((order) => (
                    <AccordionItem key={order.id} className={order.orderP2PUser1Id === user.id ? 'bg-gray-200' : ''}>
                        <AccordionTrigger disabled={order.orderP2PUser1Id === user.id}>
                            {order.orderP2PUser1.cardId} хочет {order.orderP2PBuySell === 'BUY' ? 'купить' : 'продать'} {order.orderP2PPoints} points
                        </AccordionTrigger>
                        <AccordionContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{order.orderP2PPoints}</TableCell>
                                        <TableCell>{JSON.stringify(order.orderBankDetails)}</TableCell>
                                        <TableCell>{order.orderP2PPart ? 'Частями' : 'Целиком'}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Select
                                onValueChange={handleSelectBankDetailForInteraction}
                                placeholder="Выберите реквизиты банка для сделки"
                                className="mb-2"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите реквизиты банка" />
                                </SelectTrigger>
                                <SelectContent>
                                    {order.orderBankDetails && order.orderBankDetails.map((detail, index) => (
                                        <SelectItem key={index} value={detail}>
                                            {detail.name} - {detail.details}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={() => handleConcludeDeal(order)} disabled={order.orderP2PUser1Id === user.id}>
                                Заключить сделку
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};
