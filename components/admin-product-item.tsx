'use client';
import React, {useEffect} from 'react';
import {Category, Product, ProductItem, User} from '@prisma/client';
import toast from 'react-hot-toast';
import {Container} from './container';
import {Title} from './title';
import {Button, Input} from '@/components/ui';
import {productItemDelete, productItemUpdate, productItemCreate, uploadImage, categoryUpdate} from '@/app/actions';
import ImageAddBlobScreen from "@/components/image-add-blop-screen";


interface Props {
    user: User;
    category: Category[];
    product: Product[];
    productItem: ProductItem[];
}

export const AdminProductItem: React.FC<Props> = ({user, category, product, productItem}) => {

    const [categoryNameState, setCategoryNameState] = React.useState('');
    const [productItemNameState, setProductItemNameState] = React.useState('');

    const [productState, setProductState] = React.useState<Product[]>(product);
    const [productFindState, setProductFindState] = React.useState<Product[]>([]);

    //const [productItemState, setProductItemState] = React.useState<ProductItem[]>(productItem);
    const [productItemFindState, setProductItemFindState] = React.useState<ProductItem[]>([]);
    const [productItemFindState2, setProductItemFindState2] = React.useState<ProductItem[]>([]);

    const [createState, setCreateState] = React.useState("");

    const categoryIdRef = React.useRef(null);
    const productIdRef = React.useRef(null);

    const blobRef = React.useRef<FormData | null>(null);

    useEffect(() => {
        //setProductItemState(productItem)
        let array: ProductItem[] = []
        if (productIdRef.current !== null) {
            for (let i = 0; i < productItem.length; i++) {
                if (productItem[i].productId === productIdRef.current) {
                    array.push(productItem[i]);
                }
            }
            setProductItemFindState(array);
            setProductItemFindState2(array);
            setCreateState('')
        }
    }, [productItem]);

    useEffect(() => {
        setProductItemFindState([]);
        setProductItemFindState2([]);
    }, [categoryIdRef]);

    const productFind = (item: any) => {
        categoryIdRef.current = item.id;
        let array = []
        for (let i = 0; i < productState.length; i++) {
            if (productState[i].categoryId === item.id) {
                array.push(productState[i]);
            }
        }
        setProductFindState(array);
        setCategoryNameState(item.name);
    }

    const productItemFind = (item: any) => {
        productIdRef.current = item.id;
        //console.log(productIdRef.current);
        let array = []
        for (let i = 0; i < productItem.length; i++) {
            if (productItem[i].productId === item.id) {
                array.push(productItem[i]);
            }
        }
        setProductItemFindState(array);
        setProductItemFindState2(array);
        setProductItemNameState(item.name);
    }


    const eventHandler = (data: any, value: any) => {
        setProductItemFindState2(
            productItemFindState.map((item) =>
                item.id === data.id ? {...item, name: value} : item
            )
        )
    };

    const handleFormDataReady = async (data: FormData) => {
        console.log("Получен объект FormData:", data);
        blobRef.current = data;
    };

    const handleFormDataReadyGo = async (data: FormData, productItem: any) => {
        console.log("Получен объект FormData:", data);
        await uploadImage(data as FormData).then(async blop => {
            if ('error' in blop) {
                return toast.error(`Failed to upload image: ${blop.error}`, {icon: '❌',});
            }
            toast.error('Image create 📝', {icon: '✅',});
            await productItemUpdate({
                id: productItem.id,
                name: productItem.name,
                img: blop.url,
            });
        });

        await fetch('/api/blop/del/' + encodeURIComponent(productItem.img), {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
    };

    const eventSubmitUpdate = async (data: any) => {
        try {
            if (data.name === '') {
                return toast.error('Ошибка при создании данных, пустое поле', {
                    icon: '❌',
                });
            }
            if (blobRef.current !== null) {
                await uploadImage(blobRef.current as FormData).then(async blop => {
                    if ('error' in blop) {
                        return toast.error(`Failed to upload image: ${blop.error}`, {icon: '❌',});
                    }
                    toast.error('Image create 📝', {icon: '✅',});
                    await productItemUpdate({
                        id: data.id,
                        name: data.name,
                        img: blop.url,
                    });

                });
            } else {
                await productItemUpdate({
                    id: data.id,
                    name: data.name,
                    img: data.img,
                });
            }
            toast.error('Данные обновлены 📝', {
                icon: '✅',
            });
        } catch (error) {
            return toast.error('Ошибка при обновлении данных', {
                icon: '❌',
            });
        }
    }
    const eventSubmitDelete = async (data: any) => {
        try {

            await productItemDelete({
                id: data.id,
            });
            console.log("777777777");
            await fetch('/api/blop/del/' + encodeURIComponent(data.img), {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
            });
            toast.error('Данные удалены📝', {
                icon: '✅',
            });
        } catch (error) {
            return toast.error('Ошибка при удалении данных', {
                icon: '❌',
            });
        }
    }
    const eventSubmitCreate = async () => {
        try {
            if (createState === '') {
                return toast.error('Error create data, filed empty', {
                    icon: '❌',
                });
            }
            if (blobRef.current !== null) {
                await uploadImage(blobRef.current as FormData).then(async blop => {
                    if ('error' in blop) {
                        return toast.error(`Failed to upload image: ${blop.error}`, {icon: '❌',});
                    }
                    toast.error('Image create 📝', {icon: '✅',});

                    await productItemCreate({
                        name: createState,
                        productId: productIdRef.current,
                        img: blop.url,
                    });
                });
            } else {
                await productItemCreate({
                    name: createState,
                    productId: productIdRef.current,
                    img: null,
                });
            }

            toast.error('Data create 📝', {
                icon: '✅',
            });
        } catch (error) {
            return toast.error('Error create data', {
                icon: '❌',
            });
        }
    }


    return (
        <Container className="mt-4">

            {/*<Title text={`#${data.role}`} size="md" className="font-bold"/>*/}

            {/*CATEGORY*/}
            <div className="flex-1">
                <div className="flex w-[100%]">
                    <div className="w-[50%]">
                        <Title text={`Category List`} size="md" className="font-bold"/>
                        {category.map((item) => (
                            <div key={item.id} className="flex w-full max-w-sm items-center space-x-2 mb-1">
                                <Button className="h-5" onClick={() => productFind(item)}>{item.name}</Button>
                            </div>
                        ))}
                    </div>

                    {/*PRODUCT_LIST*/}
                    <div className=" w-[50%]">
                        <Title text={`${categoryNameState}`} size="md" className="font-bold"/>
                        <Title text={`Product List`} size="xs"/>
                        {categoryIdRef.current !== null && productFindState.map((item, index) => (
                            <div key={item.id} className="flex w-full max-w-sm items-center space-x-2 mb-1">
                                {/*<p>{item.id}</p>*/}
                                <Button className="h-5"
                                        onClick={e => productItemFind(productFindState[index])}
                                >{item.name}</Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex w-[100%]">
                    {/*PRODUCT_ITEM_EDIT*/}
                    <div className="flex-1 w-[30%]">
                        <Title text={`${productItemNameState}`} size="md" className="font-bold"/>
                        <Title text={`Product Item Edit`} size="xs"/>
                        {productIdRef.current !== null && productItemFindState.map((item, index) => (
                            <div key={item.id} className="flex-1 w-full max-w-sm items-center space-x-2 mb-2
                                                            border border-gray-200">

                                {/*<p>{item.id}</p>*/}
                                <div>
                                    <ImageAddBlobScreen
                                        onFormDataReady={(formData) => handleFormDataReadyGo(formData, productItemFindState[index])}/>
                                </div>
                                <div className="flex">
                                    <Input className="h-5"
                                           type='text'
                                           defaultValue={item.name}
                                           onChange={e => eventHandler(productItemFindState[index], e.target.value)}
                                    />
                                    <Button className="h-5"
                                            type="submit"
                                            disabled={productItemFindState[index].name === productItemFindState2[index].name}
                                            onClick={() => eventSubmitUpdate(productItemFindState2[index])}
                                    >Up</Button>
                                    <Button className="h-5 mb-2 mr-1"
                                            type="submit"
                                            onClick={() => eventSubmitDelete(productItemFindState2[index])}
                                    >Del</Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/*PRODUCT_ITEM_CREATE*/}
                    <div className="flex-1 w-[25%] ml-5">
                        <Title text={`${productItemNameState}`} size="md" className="font-bold"/>
                        <Title text={`Product Add`} size="xs"/>
                        {productIdRef.current !== null &&
                            <div className="flex-1 w-[100%]">
                                <ImageAddBlobScreen onFormDataReady={handleFormDataReady}/>
                                <div className="w-[98%] text-ellipsis overflow-hidden whitespace-nowrap">
                                    <Input className="h-5"
                                           type='text'
                                           value={createState}
                                           onChange={e => {
                                               setCreateState(e.target.value)
                                           }}
                                    />
                                </div>
                                <div className="w-[98%] text-ellipsis overflow-hidden whitespace-nowrap">
                                    <Button className="h-5"
                                            type="submit"
                                            disabled={createState === ''}
                                            onClick={eventSubmitCreate}
                                    >Add</Button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Container>
    );
};