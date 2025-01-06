import { Button } from "@/components/ui/button"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {ArrowBigRightDash} from "lucide-react";
import React from "react";


export function SheetDriverLeft() {
    return (
        <Sheet>
            <SheetTrigger  asChild>
                <Button className="h-8 bg-gray-600 text-black ml-1" >
                    <div style={{cursor: "pointer", fontSize: "12px",}}>CONTACTS</div>
                </Button>

                {/*<ArrowBigRightDash />*/}
            </SheetTrigger>
            <SheetContent className="bg-secondary" side="left">
                <SheetHeader>
                    <SheetTitle>Contacts</SheetTitle>
                    <SheetDescription>
                        Telegram @navatar85
                    </SheetDescription>
                    <SheetDescription>
                        Email: umdom33@gmail.com
                    </SheetDescription>
                    <SheetDescription>
                        Viber: +375333814578
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">

                {/*<div className="grid grid-cols-4 items-center gap-4">*/}
                    {/*    <Label htmlFor="name" className="text-right">*/}
                    {/*        Name*/}
                    {/*    </Label>*/}
                    {/*    <Input id="name" value="Pedro Duarte" className="col-span-3" />*/}
                    {/*</div>*/}
                    {/*<div className="grid grid-cols-4 items-center gap-4">*/}
                    {/*    <Label htmlFor="username" className="text-right">*/}
                    {/*        Username*/}
                    {/*    </Label>*/}
                    {/*    <Input id="username" value="@peduarte" className="col-span-3" />*/}
                    {/*</div>*/}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">CLOSE</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}