"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function COOP() {
    const [dialogImage, setDialogImage] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const openDialog = (imageSrc: string) => {
        setDialogImage(imageSrc);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogImage(null);
        setIsDialogOpen(false);
    };

    return (
        <div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="bg-red-500"><span className="mx-3">(Биржа) 2,3 и 4 игрока</span> </AccordionTrigger>
                    <AccordionContent className="bg-red-500">
                        <div className="mx-3">
                        <p>Сайт предоставляет возможность делать ставки на 2, 3 и 4 игроков. Это позволяет пользователям участвовать в биржевой торговле, делая ставки на исходы игр.</p>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img.png"
                                    alt="Ставок (Биржа)"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>Ставок (Биржа)</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <p>Платформа поддерживает различные виды ставок, включая возможность устанавливать коэффициенты и максимальные ставки. Это делает процесс ставок более гибким и интересным для пользователей.</p>
                        <p><a href="https://heroes3.site/">Подробнее</a></p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Статистика ставок</AccordionTrigger>
                    <AccordionContent>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_7.png"
                                    alt="Статистика ставок"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_7.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>Статистика ставок</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <p>Статистика ставок позволяет пользователям отслеживать свои ставки и анализировать результаты. Это помогает в принятии более обоснованных решений в будущем.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Внутренние $ points и внутренние переводы</AccordionTrigger>
                    <AccordionContent>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_11.png"
                                    alt="Внутренние $ points"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_11.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>Внутренние $ points</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <p>Система внутренних $ points позволяет пользователям обмениваться баллами внутри платформы. Это создает экономику внутри сайта, где пользователи могут зарабатывать и тратить баллы.</p>
                        <p><a href="https://heroes3.site/transfer-points">Подробнее</a></p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>P2P торговля</AccordionTrigger>
                    <AccordionContent>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_1.png"
                                    alt="P2P торговля"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_1.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>P2P торговля</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_2.png"
                                    alt="P2P торговля"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_2.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>P2P торговля</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <p>P2P торговля позволяет пользователям обмениваться ресурсами напрямую, без посредников. Это упрощает процесс торговли и делает его более доступным.</p>
                        <p><a href="https://heroes3.site/order-p2p">Подробнее</a></p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>Рейтинг points</AccordionTrigger>
                    <AccordionContent>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_6.png"
                                    alt="Рейтинг points"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_6.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>Рейтинг points</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <p>Рейтинг points позволяет пользователям отслеживать свои достижения и сравнивать их с другими участниками платформы. Это стимулирует пользователей к активному участию и улучшению своих результатов.</p>
                        <p><a href="https://heroes3.site/rating">Подробнее</a></p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger>Статистика игроков и турниров</AccordionTrigger>
                    <AccordionContent>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_3.png"
                                    alt="Статистика игроков"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_3.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>Статистика игроков</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_4.png"
                                    alt="Статистика турниров"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_4.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>Статистика турниров</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_5.png"
                                    alt="Статистика турниров"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_5.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>Статистика турниров</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <p>Статистика игроков и турниров предоставляет детальную информацию о результатах и достижениях участников. Это помогает пользователям анализировать свои успехи и планировать дальнейшие действия.</p>
                        <p><a href="https://heroes3.site/tournament">Подробнее</a></p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                    <AccordionTrigger>Игры на $ points</AccordionTrigger>
                    <AccordionContent>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_8.png"
                                    alt="Игры на $ points"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_8.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>Игры на $ points</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_9.png"
                                    alt="Игры на $ points"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_9.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>Игры на $ points</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_10.png"
                                    alt="Игры на $ points"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_10.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>Игры на $ points</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <p>Игры на $ points позволяют пользователям участвовать в различных соревнованиях и зарабатывать баллы. Это делает платформу более интерактивной и увлекательной.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                    <AccordionTrigger>Статистика сайта</AccordionTrigger>
                    <AccordionContent>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Image
                                    src="/coop/img_14.png"
                                    alt="Статистика сайта"
                                    width={100}
                                    height={100}
                                    onClick={() => openDialog("/coop/img_14.png")}
                                />
                            </DialogTrigger>
                            <DialogContent className="dialog-content">
                                <DialogHeader>
                                    <DialogTitle>Статистика сайта</DialogTitle>
                                </DialogHeader>
                                {dialogImage && (
                                    <img
                                        src={dialogImage}
                                        alt="Enlarged Image"
                                        className="enlarged-image"
                                    />
                                )}
                                <DialogFooter>
                                    <Button onClick={closeDialog}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <p>Статистика сайта предоставляет общую информацию о деятельности на платформе, включая количество пользователей, активность и другие важные метрики.</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}