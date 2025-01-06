'use client';
import React, {Suspense} from 'react';
import {Container} from "@/components/container";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ImageBlopDialog} from "@/components/image-blop-dialog";
import {VideoYouTube} from "@/components/video-you-tube";

interface Props {
    className?: string;
    medals: any[];
    countMedals: any[];
    categoryPage: string;
    productPage: string;
}

export const GameRecord_MEDAL: React.FC<Props> = ({medals, countMedals, categoryPage, productPage}) => {

    // console.log(medals);
    // console.log(countMedals);

    return (

            <Container className="w-[100%]">
                <h1 className="text-center text-2xl font-bold">{categoryPage.replaceAll("-"," ")} </h1>
                <div className="text-center text-md">{productPage.replaceAll("-"," ")}</div>
                <Table className="table-fixed">
                    <TableCaption>{productPage.replaceAll("-"," ")}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[30%] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                                <div>Road</div>
                            </TableHead>
                            <TableHead className="w-[22%] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                                <div>GOLD</div>
                            </TableHead>
                            <TableHead className="w-[22%] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                                <div>SILVER</div>
                            </TableHead>
                            <TableHead className="w-[22%] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                                <div>BRONZE</div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <Suspense>
                        {
                            medals.map((medal, index) => (
                                <TableBody key={index} className="border-b border-b-gray-800">
                                    <TableRow>
                                        <TableHead>
                                            <div
                                                className="text-ellipsis overflow-hidden whitespace-nowrap">{medal.productName}

                                            </div>
                                            <div>
                                                { medal.productImg !== null && <ImageBlopDialog img={medal.productImg}/>}
                                            </div>
                                        </TableHead>
                                        <TableCell>
                                            <div className="text-ellipsis overflow-hidden whitespace-nowrap">{medal.gold !== null && medal.gold.user.fullName}</div>
                                            <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                                                {medal.gold !== null && medal.gold.timestate.substring(3)}
                                                {medal.gold !== null && medal.gold.img !== null &&<ImageBlopDialog img={medal.gold.img}/>}
                                                {medal.gold !== null && medal.gold.video !== "" &&<VideoYouTube video={medal.gold.video}/>}
                                            </div>
                                            <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                                                {medal.gold !== null && medal.gold.carModel !== null && medal.gold.carModel.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                className="text-ellipsis overflow-hidden whitespace-nowrap">{medal.silver !== null && medal.silver.user.fullName}</div>
                                            <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                                                {medal.silver !== null && medal.silver.timestate.substring(3)}
                                                {medal.silver !== null && medal.silver.img !== null &&
                                                    <ImageBlopDialog img={medal.silver.img}/>}
                                                {medal.silver !== null && medal.silver.video !== "" &&
                                                    <VideoYouTube video={medal.silver.video}/>}
                                            </div>
                                            <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                                                {medal.silver !== null && medal.silver.carModel !== null && medal.silver.carModel.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                className="text-ellipsis overflow-hidden whitespace-nowrap">{medal.bronze !== null && medal.bronze.user.fullName}</div>
                                            <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                                                {medal.bronze !== null && medal.bronze.timestate.substring(3)}
                                                {medal.bronze !== null && medal.bronze.img !== null &&
                                                    <ImageBlopDialog img={medal.bronze.img}/>}
                                                {medal.bronze !== null && medal.bronze.video !== "" &&
                                                    <VideoYouTube video={medal.bronze.video}/>}
                                            </div>
                                            <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                                                {medal.bronze !== null && medal.bronze.carModel !== null && medal.bronze.carModel.name}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ))}
                    </Suspense>
                </Table>
                <Table className="table-fixed">
                    <TableCaption>{productPage.replaceAll("-"," ")}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%] overflow-hidden text-ellipsis whitespace-nowrap">
                                    <div>Player</div>
                                </TableHead>
                                <TableHead className="w-[15%] overflow-hidden text-center whitespace-nowrap">
                                    <div>GOLD</div>
                                </TableHead>
                                <TableHead className="w-[15%] overflow-hidden text-center whitespace-nowrap">
                                    <div>SILVER</div>
                                </TableHead>
                                <TableHead className="w-[15%] overflow-hidden text-center whitespace-nowrap">
                                    <div>BRONZE</div>
                                </TableHead>
                                <TableHead className="w-[15%] overflow-hidden text-center whitespace-nowrap">
                                    <div>PLATINUM</div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <Suspense>
                            { countMedals.map((medal, index) => (
                                <TableBody key={index} className="border-b border-b-gray-800">
                                    <TableRow>
                                        <TableHead>
                                            <div className="text-ellipsis overflow-hidden whitespace-nowrap">{medal.userName}</div>
                                        </TableHead>
                                        <TableCell>
                                            <div className="text-center overflow-hidden whitespace-nowrap">{medal.gold !== null && medal.gold}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-center overflow-hidden whitespace-nowrap">{medal.silver !== null && medal.silver}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-center overflow-hidden whitespace-nowrap">{medal.bronze !== null && medal.bronze}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-center overflow-hidden whitespace-nowrap">{medal.platinum !== null && medal.platinum}</div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ))}
                        </Suspense>
                    </Table>
            </Container>
    );
};

