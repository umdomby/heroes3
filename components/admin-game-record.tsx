'use client';
import React, {Suspense, useEffect} from 'react';
import {GameRecords, User} from '@prisma/client';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Container} from "@/components/container";


interface Props {
    data: User;
    gameRecords: any[];
}

export const AdminGameRecord: React.FC<Props> = ({data, gameRecords}) => {

    return (
        <Container className="w-[100%]">
            <Table>
                <TableCaption>Gamerecord.online</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[12%] text-left">Player</TableHead>
                        <TableHead className="w-[12%]">Category</TableHead>
                        <TableHead className="w-[12%]">Game</TableHead>
                        <TableHead className="w-[12%]">Road</TableHead>
                        <TableHead className="w-[12%] text-right">Time</TableHead>
                        <TableHead className="w-[7%]">Image</TableHead>
                        <TableHead className="w-[7%] text-right">Link</TableHead>
                    </TableRow>
                </TableHeader>


                <Suspense>
                    {
                        gameRecords.map((records, index) => (

                            <TableBody key={index}>
                                <TableRow>
                                    <TableCell className="font-medium">{records.user.fullName}</TableCell>
                                    <TableCell>{records.category.name}</TableCell>
                                    <TableCell>{records.product.name}</TableCell>
                                    <TableCell>{records.productItem.name}</TableCell>
                                    <TableCell className="text-right">{records.timestate.substring(3)}</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell className="text-right">Video</TableCell>
                                </TableRow>
                            </TableBody>

                        ))}
                </Suspense>
            </Table>
        </Container>
    );
};
