import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import React from "react";
import Link from "next/link";
import {Category, Product, ProductItem} from "@prisma/client";

interface Props {
    category: Category[];
    product: Product[];
    productItem: ProductItem[];
    className?: string;
}

export const DropmenuTopLeft: React.FC<Props> = ({category, product, productItem}) => {
    const [open, setOpen] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [delayHandler, setDelayHandler] = React.useState<number | null>(null);

    const [productFindState, setProductFindState] = React.useState<Product[]>(product);
    const [productItemFindState, setProductItemFindState] = React.useState<ProductItem[]>(productItem);

    const productFind = (id : Number) => {
        let array = []
        for (let i = 0; i < product.length; i++) {
            if (product[i].categoryId === id) {
                array.push(product[i]);
            }
        }
        setProductFindState(array);
    }

    const productItemFind = (id : Number) => {
        let array = []
        for (let i = 0; i < productItem.length; i++) {
            if (productItem[i].productId === id) {

                array.push(productItem[i]);
            }
        }
        setProductItemFindState(array);
    }



    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>

            <DropdownMenuTrigger
                asChild
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
                <div>Game List</div>
            </DropdownMenuTrigger>


            <DropdownMenuContent  >


                {category.map((item) => (
                    <div key={item.id} >
                        <DropdownMenuGroup>


                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger  style={{height:"25px"}} onMouseEnter={() => productFind(item.id)}>
                                    <Link href={`/game/${item.name.replaceAll(" ", "-")}`}>{item.name}</Link>
                                </DropdownMenuSubTrigger>


                                <DropdownMenuPortal>

                                    <DropdownMenuSubContent>
                                        {productFindState.map((products) => (
                                            <div key={products.id}>

                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger style={{height:"16px"}}  onMouseEnter={() => productItemFind(products.id)}>
                                                        <Link href={`/game/${item.name.replaceAll(" ", "-")}/${products.name.replaceAll(" ", "-")}`}><li></li></Link>


                                                        {products.name}
                                                    </DropdownMenuSubTrigger>

                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            {productItemFindState.map((productsItem) => (
                                                                <div key={productsItem.id}>
                                                                    <DropdownMenuSub>
                                                                            <Link href={`/game/${item.name.replaceAll(" ", "-")}/${products.name.replaceAll(" ", "-")}/${(productsItem.name).replaceAll(" ", "-")}`}>
                                                                                <DropdownMenuItem style={{height:"16px"}} >{productsItem.name}</DropdownMenuItem>
                                                                            </Link>
                                                                    </DropdownMenuSub>
                                                                </div>
                                                            ))}
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>

                                                </DropdownMenuSub>

                                            </div>
                                        ))}

                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>



                            </DropdownMenuSub>


                        </DropdownMenuGroup>
                    </div>
                ))}



            </DropdownMenuContent>
        </DropdownMenu>
    );
};
