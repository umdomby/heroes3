"use client"
import React, {useState} from "react";
import Image from "next/image";
import {Images} from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface Props {
    img: string | (() => string)
}

export const ImageBlopDialog: React.FC<Props> = ({img}) => {
    const [imageSrc, setImageSrc] = useState<string>(img);


    return (

            <Dialog>
                <DialogTrigger><Images className="h-5"/></DialogTrigger>
                <DialogContent  className="dialog-content">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription>
                                <Image
                                    onError={() =>
                                        setImageSrc(
                                            "https://g7ttfzigvkyrt3gn.public.blob.vercel-storage.com/nfs/nfs_most_wanted_2005.jpg"
                                        ) // Устанавливаем запасное изображение
                                    }
                                    src={imageSrc}
                                    alt={''}
                                    width={500}
                                    height={800}
                                    // layout="fill" // Используем fill для адаптивного изображения
                                    // objectFit="contain" // Или cover, в зависимости от ваших предпочтений
                                />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

    )
}