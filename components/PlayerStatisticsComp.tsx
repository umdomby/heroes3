'use client';
import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PlayerStatistic } from "@prisma/client";
import Link from "next/link";


interface PlayerStatisticWithRelations extends PlayerStatistic {
    turnirBet?: { name: string };
    category?: { name: string };
    player?: { name: string };
}

interface PlayerStatisticsProps {
    playerStatistics: PlayerStatisticWithRelations[];
}

export function PlayerStatisticsComp({ playerStatistics }: PlayerStatisticsProps) {
    const getColor = (color: string) => {
        switch (color) {
            case 'RED': return 'text-red-500';
            case 'BLUE': return 'text-blue-500';
            case 'GREEN': return 'text-green-500';
            case 'YELLOW': return 'text-yellow-500';
            case 'PURPLE': return 'text-purple-500';
            case 'ORANGE': return 'text-orange-500';
            case 'TEAL': return 'text-teal-500';
            case 'PINK': return 'text-pink-500';
            default: return '';
        }
    };

    const getCityName = (city: string) => {
        switch (city) {
            case 'CASTLE': return 'ЗАМОК';
            case 'RAMPART': return 'ОПЛОТ';
            case 'TOWER': return 'БАШНЯ';
            case 'INFERNO': return 'ИНФЕРНО';
            case 'NECROPOLIS': return 'НЕКРОПОЛИС';
            case 'DUNGEON': return 'ТЕМНИЦА';
            case 'STRONGHOLD': return 'ЦИТАДЕЛЬ';
            case 'FORTRESS': return 'КРЕПОСТЬ';
            case 'CONFLUX': return 'СОПРЯЖЕНИЕ';
            case 'COVE': return 'ПРИЧАЛ';
            case 'FACTORY': return 'ФАБРИКА';
            default: return '';
        }
    };

    return (
        <Table>
            <TableBody>
                {playerStatistics.map((stat) => (
                    <TableRow key={stat.id}>
                        <TableCell>{stat.turnirBet?.name || 'N/A'}</TableCell>
                        <TableCell>{stat.category?.name || 'N/A'}</TableCell>
                        <TableCell>{stat.player?.name}</TableCell>
                        <TableCell>{stat.gold}</TableCell>
                        <TableCell>{stat.security || 'N/A'}</TableCell>
                        <TableCell>{stat.win ? 'win' : 'los'}</TableCell>
                        <TableCell>{stat.color || 'N/A'}</TableCell>
                        <TableCell>
                            {stat.link ? (
                                <Link href={stat.link} target="_blank" rel="noopener noreferrer">
                                    Открыть ссылку
                                </Link>
                            ) : 'N/A'}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
