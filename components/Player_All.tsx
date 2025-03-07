'use client';

import React from 'react';
import {Suspense} from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Container} from "@/components/container";
import {Player} from "@prisma/client";
import Link from "next/link";


interface Props {
    playerAll: Player[]
    className?: string;
}

export const Player_All: React.FC<Props> = ({playerAll}) => {

    return (
        <Container>
            <Table>
                <TableCaption>List of Players</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {playerAll.map((player) => (
                        <TableRow key={player.id}>
                            <TableCell>
                                <Link className=" text-blue-500 cursor-pointer hover:text-green-500 " href={`/player/${player.id}`}>
                                    {player.name}
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>

    );
};

