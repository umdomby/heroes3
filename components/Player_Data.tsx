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


interface Props {
    playerData: Player
    className?: string;
}

export const Player_Data: React.FC<Props> = ({playerData}) => {

    return (

        <div>
            {playerData.name}
        </div>

    );
};

