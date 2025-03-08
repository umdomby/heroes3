'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Container} from "@/components/container";
import {Player} from "@prisma/client";
import Link from "next/link";
import {Button} from "@/components/ui";

interface Props {
    playerData: Player;
    className?: string;
}

export const Player_Data: React.FC<Props> = ({playerData}) => {
    const tournamentFields = [
        { name: "HeroesCup1deaL", data: playerData.HeroesCup1deaL },
        { name: "HeroesCup", data: playerData.HeroesCup },
        { name: "HeroesCup2", data: playerData.HeroesCup2 },
        { name: "HeroesCup3", data: playerData.HeroesCup3 },
        { name: "HC3PO", data: playerData.HC3PO },
        { name: "HC2PO", data: playerData.HC2PO },
    ];

    return (
        <Container>
            <Link href="/player">
                <Button className="mx-5 h-5">ИГРОКИ</Button>
            </Link>
            <Link href="/tournament">
                <Button className="mx-5 h-5">ТУРНИРЫ HEROES HUB</Button>
            </Link>
            <div className="text-2xl text-center">{playerData.name}</div>
            <Table>
                <TableCaption>Player Details</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Attribute</TableHead>
                        <TableHead>Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>{playerData.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Games Played</TableCell>
                        <TableCell>{playerData.countGame ?? 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Wins</TableCell>
                        <TableCell>{playerData.winGame ?? 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Losses</TableCell>
                        <TableCell>{playerData.lossGame ?? 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Win Rate (%)</TableCell>
                        <TableCell>{playerData.rateGame !== null && playerData.rateGame !== undefined ? playerData.rateGame.toFixed(2) : 'N/A'}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            {tournamentFields.map((tournament, index) => {
                const data = tournament.data as any; // Приведение к any для доступа к полям JSON
                return (
                    <Table key={index}>
                        <TableCaption>{tournament.name} Details</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Attribute</TableHead>
                                <TableHead>Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Tournament</TableCell>
                                <TableCell>{data?.tournament ?? 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Games Played</TableCell>
                                <TableCell>{data?.countGame ?? 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Wins</TableCell>
                                <TableCell>{data?.winGame ?? 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Losses</TableCell>
                                <TableCell>{data?.lossGame ?? 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Win Rate (%)</TableCell>
                                <TableCell>{data?.rateGame !== null && data?.rateGame !== undefined ? data.rateGame.toFixed(2) : 'N/A'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                );
            })}
        </Container>
    );
};
