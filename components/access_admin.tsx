"use client"
import React from 'react';
import Link from 'next/link';
import { ModeToggle } from "@/components/buttonTheme";
import { Button } from "@/components/ui";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

interface Props {
    className?: string;
}

export const Access_admin: React.FC<Props> = ({ className }) => {

    const [open, setOpen] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [delayHandler, setDelayHandler] = React.useState<number | null>(null);


    return (
        <div className={className}>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger
                    asChild
                    className="width-[20%]"
                    onMouseEnter={() => {
                        if (delayHandler) clearTimeout(delayHandler);
                        setIsHovered(true);
                        setDelayHandler(window.setTimeout(() => {
                            setOpen(true);
                        }, 200));
                    }}
                    onMouseLeave={() => {
                        if (delayHandler) clearTimeout(delayHandler);
                        setIsHovered(false);
                        setDelayHandler(window.setTimeout(() => {
                            if (!isHovered) setOpen(false);
                        }, 200));
                    }}
                >
                    <Button variant="outline" className="h-5 w-full">ADMIN</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuRadioGroup>
                        <Link href="/">
                            <DropdownMenuRadioItem value="home" className="cursor-pointer">
                                HOME
                            </DropdownMenuRadioItem>
                        </Link>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                    ADMIN OPTIONS
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-56">
                                <DropdownMenuRadioGroup>
                                    <Link href="/bet-create-2">
                                        <DropdownMenuRadioItem value="bet-create" className="cursor-pointer">
                                            ADMIN CREATE BET 2
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/bet-create-3">
                                        <DropdownMenuRadioItem value="bet-create-3" className="cursor-pointer">
                                            ADMIN CREATE BET 3
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/bet-create-4">
                                        <DropdownMenuRadioItem value="bet-create-4" className="cursor-pointer">
                                            ADMIN CREATE BET 4
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/add-player">
                                        <DropdownMenuRadioItem value="add-player" className="cursor-pointer">
                                            ADMIN ADD PLAYER
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/admin-user">
                                        <DropdownMenuRadioItem value="admin-user" className="cursor-pointer">
                                            ADMIN USER
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/bet-closed-admin-2">
                                        <DropdownMenuRadioItem value="bet-closed-admin" className="cursor-pointer">
                                            ADMIN BET CLOSED 2
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/bet-closed-admin-3">
                                        <DropdownMenuRadioItem value="bet-closed-admin-3" className="cursor-pointer">
                                            ADMIN BET CLOSED 3
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/bet-closed-admin-4">
                                        <DropdownMenuRadioItem value="bet-closed-admin-4" className="cursor-pointer">
                                            ADMIN BET CLOSED 4
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/order-p2p-pending-admin">
                                        <DropdownMenuRadioItem value="order-p2p-pending-admin" className="cursor-pointer">
                                            ADMIN P2P PENDING
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/order-p2p-closed-admin">
                                        <DropdownMenuRadioItem value="order-p2p-closed-admin" className="cursor-pointer">
                                            ADMIN P2P CLOSED
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/transfer-points-admin">
                                        <DropdownMenuRadioItem value="transfer-points-admin" className="cursor-pointer">
                                            ADMIN TRANSFER
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/transfer-points-admin/bet-found">
                                        <DropdownMenuRadioItem value="transfer-points-admin-bet-found" className="cursor-pointer">
                                            ADMIN BET FOUND
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/statistics">
                                        <DropdownMenuRadioItem value="statistics" className="cursor-pointer">
                                            ADMIN STATISTICS
                                        </DropdownMenuRadioItem>
                                    </Link>
                                    <Link href="/tur-admin">
                                        <DropdownMenuRadioItem value="tur-admin" className="cursor-pointer">
                                            ADMIN ТУРНИРЫ
                                        </DropdownMenuRadioItem>
                                    </Link>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuRadioItem value="user-game-create-2" className="cursor-pointer">
                            GAME USER 2 CREATE
                        </DropdownMenuRadioItem>
                        <Link href="/user-game-2">
                            <DropdownMenuRadioItem value="user-game-2" className="cursor-pointer">
                                GAME USER 2
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/user-game-closed-2">
                            <DropdownMenuRadioItem value="user-game-closed-2" className="cursor-pointer">
                                GAME USER 2 CLOSED
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/bet-closed-2-3-4">
                            <DropdownMenuRadioItem value="bet-closed-2-3-4" className="cursor-pointer">
                                BET CLOSED ALL
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/bet-closed-2">
                            <DropdownMenuRadioItem value="bet-closed-2" className="cursor-pointer">
                                BET CLOSED 2
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/bet-closed-3">
                            <DropdownMenuRadioItem value="bet-closed-3" className="cursor-pointer">
                                BET CLOSED 3
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/bet-closed-4">
                            <DropdownMenuRadioItem value="bet-closed-4" className="cursor-pointer">
                                BET CLOSED 4
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/bet-winn-lose-closed-2">
                            <DropdownMenuRadioItem value="bet-winn-lose-closed-2" className="cursor-pointer">
                                WINN/LOSE PLAYERS 2
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/bet-winn-lose-closed-3">
                            <DropdownMenuRadioItem value="bet-winn-lose-closed-3" className="cursor-pointer">
                                WINN/LOSE PLAYERS 3
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/bet-winn-lose-closed-4">
                            <DropdownMenuRadioItem value="bet-winn-lose-closed-4" className="cursor-pointer">
                                WINN/LOSE PLAYERS 4
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/transfer-points">
                            <DropdownMenuRadioItem value="transfer-points" className="cursor-pointer">
                                TRANSFER
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/order-p2p">
                            <DropdownMenuRadioItem value="order-p2p" className="cursor-pointer">
                                P2P
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/order-p2p-pending">
                            <DropdownMenuRadioItem value="order-p2p-pending" className="cursor-pointer">
                                P2P PENDING
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/order-p2p-closed">
                            <DropdownMenuRadioItem value="order-p2p-closed" className="cursor-pointer">
                                P2P CLOSED
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/turnir">
                            <DropdownMenuRadioItem value="turnir" className="cursor-pointer">
                                ТУРНИРЫ
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/statistics">
                            <DropdownMenuRadioItem value="statistics" className="cursor-pointer">
                                STATISTICS
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/rating">
                            <DropdownMenuRadioItem value="rating" className="cursor-pointer">
                                RATING
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/manual">
                            <DropdownMenuRadioItem value="manual" className="cursor-pointer">
                                MANUAL
                            </DropdownMenuRadioItem>
                        </Link>
                        <Link href="/contacts">
                            <DropdownMenuRadioItem value="bet-closed" className="cursor-pointer">
                                CONTACTS
                            </DropdownMenuRadioItem>
                        </Link>
                        <DropdownMenuRadioItem value="create-bet"><ModeToggle /></DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
