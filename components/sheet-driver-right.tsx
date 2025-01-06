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
import {ArrowBigLeftDash} from "lucide-react";
import React from "react";

export function SheetDriverRight() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <ArrowBigLeftDash />
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>MENU</SheetTitle>
                    <SheetDescription>
                        LEFT
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