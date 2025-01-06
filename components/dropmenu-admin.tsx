import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Logs} from "lucide-react";
import Link from "next/link";
import {useSession} from "next-auth/react";


export function DropmenuAdmin() {

    const {data: session} = useSession();
    return (
        <div>
            {session && session?.user.role === 'ADMIN' &&
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Logs/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>ADMIN</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <Link href="/admin/category">
                                <DropdownMenuItem>
                                    CATEGORY
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/admin/product">
                                <DropdownMenuItem>
                                    PRODUCT
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/admin/product-item">
                                <DropdownMenuItem>
                                    PRODUCT ITEM
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/admin/game-record">
                                <DropdownMenuItem>
                                    GAME RECORD
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        </div>
    )
}
