'use client';

import React, {useEffect} from 'react';
import {Category, Product, User} from '@prisma/client';
import toast from 'react-hot-toast';
import {Container} from './container';
import {Title} from './title';
import {Button, Input} from '@/components/ui';
import {
    productCreate,
    productUpdate,
    productDelete
} from '@/app/actions';

interface Props {
    data: User;
    category: Category[];
    product: Product[];
}

export const AdminProduct: React.FC<Props> = ({data, category, product}) => {

    const [categoryNameState, setCategoryNameState] = React.useState('');
    const [productState, setProductState] = React.useState<Product[]>(product);
    const [productFindState, setProductFindState] = React.useState<Product[]>([]);
    const [productFindState2, setProductFindState2] = React.useState<Product[]>([]);
    const [createState, setCreateState] = React.useState("");
    const categoryIdRef = React.useRef(null);

    useEffect(() => {
        let array: Product[] = []
        setProductState(product)
        if(categoryIdRef.current !== null) {
            for (let i = 0; i < product.length; i++) {
                if (product[i].categoryId === categoryIdRef.current) {
                    array.push(product[i]);
                }
            }
            setProductFindState(array);
            setProductFindState2(array);
            setCreateState('')
        }
    }, [product]);

    const productFind = (item : any) => {
        let array = []
        for (let i = 0; i < productState.length; i++) {
            if (productState[i].categoryId === item.id) {
                array.push(productState[i]);
            }
        }
        categoryIdRef.current = item.id;
        setProductFindState(array);
        setProductFindState2(array);
        setCategoryNameState(item.name);
    }


    const eventHandler = (data: any, value: any) => {
        setProductFindState2(
            productFindState.map((item) =>
                item.id === data.id ? {...item, name: value} : item
            )
        )
    };

    const eventSubmitCreate = async () => {
        try {
            if(createState === '') {
                return toast.error('Error create data, filed empty', {
                    icon: '❌',
                });
            }
            await productCreate({
                name: createState,
                categoryId: categoryIdRef.current,
            });
            toast.error('Data create 📝', {
                icon: '✅',
            });
        } catch (error) {
            return toast.error('Error create data', {
                icon: '❌',
            });
        }
    }

    const eventSubmitDelete = async (item: any) => {
        try {
            await productDelete({
                id: item.id,
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

    const eventSubmitUpdate = async (data: any) => {
        try {
            if(data.name === '') {
                return toast.error('Ошибка при создании данных, пустое поле', {
                    icon: '❌',
                });
            }
            await productUpdate({
                id: data.id,
                name: data.name,
            });
            toast.error('Данные обновлены 📝', {
                icon: '✅',
            });
        } catch (error) {
            return toast.error('Ошибка при обновлении данных', {
                icon: '❌',
            });
        }
    }

    return (
        <Container className="mt-4">

            {/*<Title text={`#${data.role}`} size="md" className="font-bold"/>*/}

            <div className="flex">
                <div className="w-[30%]">
                    <Title text={`Category List`} size="md" className="font-bold"/>
                    {category.map((item) => (
                        <div key={item.id} className="flex w-full max-w-sm items-center space-x-2 mb-1">
                            <Button onClick={() => productFind(item)}>{item.name}</Button>
                        </div>
                    ))}
                </div>

                <div className="flex-1 w-[35%]">
                    <Title text={`${categoryNameState}`} size="md" className="font-bold"/>
                    <Title text={`Product Edit`} size="xs" />

                    {categoryIdRef.current !== null && productFindState.map((item, index) => (
                        <div key={item.id} className="flex w-full max-w-sm items-center space-x-2 mb-1">
                            <p>{item.id}</p>
                            <Input type='text'
                                   defaultValue={item.name}
                                   onChange={e => eventHandler(productFindState[index], e.target.value)}
                            />
                            <Button
                                type="submit"
                                disabled={productFindState[index].name === productFindState2[index].name}
                                onClick={() => eventSubmitUpdate(productFindState2[index])}
                            >Up</Button>
                            <Button
                                type="submit"
                                onClick={() => eventSubmitDelete(item)}
                            >Del</Button>
                        </div>
                    ))}
                </div>

                <div className="flex-1 w-[35%]">
                    <Title text={`${categoryNameState}`} size="md" className="font-bold"/>
                    <Title text={`Product Add`} size="xs" />
                    {categoryIdRef.current !== null &&
                        <div className="flex w-full max-w-sm items-center space-x-2 mb-1">
                            <Input type='text'
                                   value={createState}
                                   onChange={e => {
                                       setCreateState(e.target.value)
                                   }}
                            />
                            <Button
                                type="submit"
                                disabled={createState === ''}
                                onClick={eventSubmitCreate}
                            >Add</Button>
                        </div>
                    }
                </div>
            </div>
        </Container>
    );
};
