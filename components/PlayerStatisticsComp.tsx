'use client';
import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PlayerStatistic } from "@prisma/client";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import {Button} from "@/components/ui";

interface PlayerStatisticWithRelations extends PlayerStatistic {
    turnirBet?: { name: string };
    category?: { name: string };
    player?: { name: string };
}

interface PlayerStatisticsProps {
    playerStatistics: PlayerStatisticWithRelations[];
    currentPage: number;
    totalPages: number;
}

export function PlayerStatisticsComp({ playerStatistics, currentPage, totalPages }: PlayerStatisticsProps) {
    const router = useRouter();

    const handlePageChange = (newPage: number) => {
        router.push(`?page=${newPage}`);
    };

    return (
        <div>
            <div className="pagination-buttons flex justify-center m-6">
                <Button className="h-7 mx-2"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                >
                    Предыдущая
                </Button>
                <span>Страница {currentPage} из {totalPages}</span>
                <Button className="h-7 mx-2"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                >
                    Следующая
                </Button>
            </div>

            <Table>
                <TableBody>
                        <TableRow >
                            <TableCell>id</TableCell>
                            <TableCell>turnir</TableCell>
                            <TableCell>map</TableCell>
                            <TableCell>player</TableCell>
                            <TableCell>gold</TableCell>
                            <TableCell>security</TableCell>
                            <TableCell>win</TableCell>
                            <TableCell>color</TableCell>
                            <TableCell>link</TableCell>
                        </TableRow>
                </TableBody>
            </Table>
            <Table>
                <TableBody>
                    {playerStatistics.map((stat) => (
                        <TableRow key={stat.id}>
                            <TableCell className="text-orange-500">{stat.id || 'N/A'}</TableCell>
                            <TableCell className="text-green-500">{stat.turnirBet?.name || 'N/A'}</TableCell>
                            <TableCell className="text-blue-500">{stat.category?.name || 'N/A'}</TableCell>
                            <TableCell className="text-purple-500">{stat.player?.name}</TableCell>
                            <TableCell className="text-yellow-500">{stat.gold}</TableCell>
                            <TableCell className="text-red-500">{stat.security || 'N/A'}</TableCell>
                            <TableCell className="text-teal-500">{stat.win ? 'win' : 'los'}</TableCell>
                            <TableCell className="text-pink-500">{stat.color || 'N/A'}</TableCell>
                            <TableCell className="text-gray-500">
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
            <div className="pagination-buttons flex justify-center m-6">
                <Button className="h-7 mx-2"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                >
                    Предыдущая
                </Button>
                <span>Страница {currentPage} из {totalPages}</span>
                <Button className="h-7 mx-2"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                >
                    Следующая
                </Button>
            </div>
        </div>
    );
}