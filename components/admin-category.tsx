'use client';
import React, {useEffect, useState} from 'react';
import {Category, User} from '@prisma/client';
import toast from 'react-hot-toast';
import {Container} from './container';
import {Title} from './title';
import {Button, Input} from '@/components/ui';
import {categoryUpdate, categoryCreate, categoryDelete, uploadImage} from '@/app/actions';
import ImageAddBlobScreen from "@/components/image-add-blop-screen";

interface Props {
    data: User;
    category: Category[];
}

export const AdminCategory: React.FC<Props> = ({data, category}) => {

    const [categories, setCategories] = React.useState<Category[]>(category);
    const [categories2, setCategories2] = React.useState<Category[]>(category);
    const [categoryAdd, setCategoryAdd] = React.useState('');
    const blobRef = React.useRef<FormData | null>(null);


    useEffect(() => {
        setCategoryAdd('');
        setCategories(category);
        setCategories2(category);
    }, [category]);


    // Callback для получения FormData из ImageAddBlobScreen
    const handleFormDataReady = async (data: FormData) => {
        console.log("Получен объект FormData:", data);
        blobRef.current = data;
    };


    const eventSubmitCreate = async () => {
        try {
            if (categoryAdd === '') {
                return toast.error('Ошибка при создании данных, пустое поле', {
                    icon: '❌',
                });
            }
            if(blobRef.current !== null) {
                await uploadImage(blobRef.current as FormData).then(async blop => {
                    if ('error' in blop) {
                        return toast.error(`Failed to upload image: ${blop.error}`, {icon: '❌',});
                    }
                    toast.error('Image create 📝', {icon: '✅',});
                    console.log(blop.url)
                    await categoryCreate({
                        name: categoryAdd,
                        img: blop.url,
                    });
                });
            }else{
                await categoryCreate({
                    name: categoryAdd,
                    img: null,
                });
            }

            toast.error('Данные созданы 📝', {
                icon: '✅',
            });

        } catch (error) {
            return toast.error('Ошибка при создании данных', {
                icon: '❌',
            });
        }
    }

    const eventSubmitDelete = async (id: number, img :any) => {
        try {
            await categoryDelete({
                id: id,
            });

            await fetch('/api/blop/del/' + encodeURIComponent(img), {
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
    const eventSubmitUpdate = async (categories2Index: any) => {
        try {

            if (categories2Index.name === '') {
                return toast.error('Ошибка при создании данных, пустое поле', {
                    icon: '❌',
                });
            }
            if(blobRef.current !== null) {
            await uploadImage(blobRef.current as FormData).then(async blop => {
                if ('error' in blop) {
                    return toast.error(`Failed to upload image: ${blop.error}`, {icon: '❌',});
                }
                toast.error('Image create 📝', {icon: '✅',});
                await categoryUpdate({
                    id: categories2Index.id,
                    name: categories2Index.name,
                    img: blop.url,
                });

            });}else{
                await categoryUpdate({
                    id: categories2Index.id,
                    name: categories2Index.name,
                    img: null,
                });
            }


            await fetch('/api/blop/del/' + encodeURIComponent(categories2Index.img), {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
            });
            //setCategories(categories2);

            toast.error('Данные обновлены 📝', {
                icon: '✅',
            });

        } catch (error) {
            return toast.error('Ошибка при обновлении данных', {
                icon: '❌',
            });
        }
    }

    const eventHandler = (categoryIndex: any, value: any) => {
        setCategories2(categories.map((item) =>
            item.id === categoryIndex.id ? {...item, name: value} : item
        ));
    };
    return (
        <Container className="my-4">

            {/*<Title text={`#${data.role}`} size="md" className="font-bold"/>*/}
            <Title text={`Category Edit`} size="md" className="font-bold m-1"/>

            {categories.map((item, index) => (
                <div key={item.id} className="flex gap-4 w-[100%]">
                    <div className="w-[33%] text-ellipsis overflow-hidden whitespace-nowrap m-1">
                        <Input type='text'
                               defaultValue={item.name}
                               onChange={e => eventHandler(categories[index], e.target.value)
                               }/>
                    </div>
                    <div className="w-[33%] text-ellipsis overflow-hidden whitespace-nowrap">
                        <ImageAddBlobScreen onFormDataReady={handleFormDataReady}/>
                    </div>
                    <div className="w-[33%] text-ellipsis overflow-hidden whitespace-nowrap">
                        <Button
                            className="w-[40%] m-1"
                            type="submit"
                            // disabled={categories[index].name === categories2[index].name}
                            onClick={() => eventSubmitUpdate(categories2[index])}
                        >Up</Button>
                        <Button
                            className="w-[40%] m-1"
                            type="submit"
                            onClick={() => eventSubmitDelete(item.id, item.img)}

                        >Del</Button>
                    </div>
                </div>

            ))}

            <Title text={`Category Add`} size="md" className="font-bold"/>
            <ImageAddBlobScreen onFormDataReady={handleFormDataReady}/>
            <div className="flex w-full max-w-sm items-center space-x-2 m-1">
                <Input type='text'
                       value={categoryAdd}
                       onChange={e => {
                           setCategoryAdd(e.target.value)
                       }
                       }/>
                <Button
                    type="submit"
                    disabled={categoryAdd === ''}
                    onClick={eventSubmitCreate}
                >Add</Button>
            </div>
        </Container>
    );
};
