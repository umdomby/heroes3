"use client";
import React, {useEffect, useState} from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {OrderP2P, User, BuySell, OrderP2PStatus} from "@prisma/client";
import { Button } from "@/components/ui/button";
import { confirmBuyOrderUser2, confirmBuyOrderCreator, confirmSellOrderUser2, confirmSellOrderCreator } from '@/app/actions';
import {DateTime} from "next-auth/providers/kakao";

interface OrderP2PWithUser extends OrderP2P {
    orderP2PUser1: {
        id: number;
        cardId: string;
        fullName: string;
    };
    orderP2PUser2?: {
        id: number;
        cardId: string;
        fullName: string;
    };
    id:number;
    orderP2PPrice : number;
    orderP2PPoints : number;
    orderP2PCheckUser1 : boolean;
    orderP2PCheckUser2 : boolean;
    orderP2PBuySell : BuySell;
    orderP2PUser1Id : number;
    orderP2PUser2Id : number;
    createdAt : DateTime;
    orderP2PStatus : OrderP2PStatus;
    orderBankDetails : JSON;
}

interface Props {
    openOrders: OrderP2P[];
    className?: string;
    user: User;
}

export const OrderP2PPending: React.FC<Props> = ({ user, openOrders, className }) => {
    const [orders, setOpenOrders] = useState<OrderP2PWithUser[]>(openOrders as OrderP2PWithUser[]);

    useEffect(() => {
        setOpenOrders(openOrders as OrderP2PWithUser[]);
    }, [openOrders]);

    const handleConfirm = async (order: OrderP2PWithUser, isCreator: boolean) => {
        if (order.orderP2PBuySell === 'BUY') {
            if (isCreator) {
                await confirmBuyOrderCreator(order.id);
            } else {
                await confirmBuyOrderUser2(order.id);
            }
        } else {
            if (isCreator) {
                await confirmSellOrderCreator(order.id);
            } else {
                await confirmSellOrderUser2(order.id);
            }
        }
    };

    return (
        <div className={className}>
            Points: {user.points}
            <Accordion className="border border-gray-300 mt-4" type="multiple">
                {orders.map((order) => (
                    <AccordionItem key={order.id} value={order.id.toString()}>
                        <AccordionTrigger>
                            <Table>
                                <TableBody>
                                    <TableRow className="no-hover-bg">
                                        <TableCell className="w-1/4">{order.orderP2PUser1.cardId}</TableCell>
                                        <TableCell className="w-1/4">
                                            хочет {order.orderP2PBuySell === 'BUY' ? 'купить' : 'продать'}
                                        </TableCell>
                                        <TableCell className="w-1/4">Points: {order.orderP2PPoints}</TableCell>
                                        <TableCell className="w-1/4">{new Date(order.createdAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </AccordionTrigger>
                        <AccordionContent className="border-b border-gray-200">
                            <div className="flex justify-center space-x-4">
                                <div className="flex flex-col items-center border p-4">
                                    <p>User 1: {order.orderP2PUser1.fullName}</p>
                                    <p>Card ID: {order.orderP2PUser1.cardId}</p>
                                    <p>Points: {order.orderP2PPoints}</p>

                                    {order.orderP2PBuySell === 'BUY' &&
                                        <Button
                                            onClick={() => handleConfirm(order, true)}
                                            disabled={order.orderP2PUser1Id !== user.id || order.orderP2PCheckUser1}
                                        >
                                            Подтвердить оплату {order.orderP2PPrice}
                                        </Button>
                                    }

                                    {/*{order.orderP2PBuySell === 'SELL' &&*/}

                                    {/*    <Button*/}
                                    {/*        onClick={() => handleConfirm(order, true)}*/}
                                    {/*        disabled={order.orderP2PCheckUser1 || (order.orderP2PBuySell === 'BUY' && !order.orderP2PCheckUser2)}*/}
                                    {/*    >*/}
                                    {/*        Подтвердить перевод {order.orderP2PPoints} Points*/}
                                    {/*    </Button>*/}
                                    {/*}*/}

                                </div>

                                <div className="flex flex-col items-center border p-4">
                                    {order.orderBankDetails.map((detail, index) => (
                                        <div key={index} className="mb-2">
                                            <h3 className="font-bold">{order.orderP2PPrice} {detail.name}</h3>
                                            <p>Price one Point = {detail.price}</p>
                                            <p>Details: {detail.details}</p>
                                            <p>Description: {detail.description}</p>
                                        </div>
                                    ))}
                                    <p>User1: {order.orderP2PUser1.fullName} - {order.orderP2PCheckUser1 ? "Да" : "Нет"}</p>
                                    <p>User2: {order.orderP2PUser2.fullName} - {order.orderP2PCheckUser2 ? "Да" : "Нет"}</p>
                                    <p>{order.orderP2PStatus === "PENDING" && "Сделка ждет завершения"}</p>
                                    <p>{order.orderP2PStatus === "CLOSED" && "Сделка завершена"}</p>
                                </div>

                                <div className="flex flex-col items-center border p-4">
                                    <p>User 2: {order.orderP2PUser2?.fullName}</p>
                                    <p>Card ID: {order.orderP2PUser2?.cardId || 'Ожидание'}</p>
                                    <p>Points: {order.orderP2PPoints}</p>

                                    {/*{order.orderP2PBuySell === 'SELL' &&*/}
                                    {/*    <Button*/}
                                    {/*        onClick={() => handleConfirm(order, false)}*/}
                                    {/*        disabled={order.orderP2PCheckUser2 || (order.orderP2PBuySell === 'SELL' && !order.orderP2PCheckUser1)}*/}
                                    {/*    >*/}
                                    {/*        Подтвердить оплату*/}
                                    {/*    </Button>*/}
                                    {/*}*/}
                                    {order.orderP2PBuySell === 'BUY' &&
                                        <Button
                                            onClick={() => handleConfirm(order, false)}
                                            disabled={order.orderP2PUser2Id !== user.id || !order.orderP2PCheckUser1 || order.orderP2PCheckUser2}
                                        >
                                            Подтвердить оплату {order.orderP2PPrice}
                                        </Button>
                                    }
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};
