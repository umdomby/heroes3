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
        <div className="mb-10">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="bg-red-500 text-black"><span className="mx-3 text-lg">Биржа ставок 2, 3 и 4 игрока</span></AccordionTrigger>
                    <AccordionContent className="bg-red-500 text-white-100 text-lg">
                        <div className="flex mx-3">
                             <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
                                        src="/coop/img.png"
                                        alt="Ставок (Биржа)"
                                        width={100}
                                        height={100}
                                        onClick={() => openDialog("/coop/img.png")}
                                    />
                                </DialogTrigger>
                                <DialogContent className="dialog-content">
                                    <DialogHeader>
                                        <DialogTitle>Биржа Ставок </DialogTitle>
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
                             </div>
                            <p>Сайт предоставляет возможность делать ставки на 2, 3 и 4 игроков. Это позволяет
                                пользователям участвовать в биржевой торговле, делая ставки на исходы игр.
                            Платформа поддерживает различные виды ставок, включая возможность устанавливать
                                коэффициенты и максимальные ставки. Это делает процесс ставок более гибким и интересным
                                для пользователей.</p>
                        </div>
                        <div className="mx-3"><p><a className="text-blue-800" target="_blank" href="/">Перейти</a></p></div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                <AccordionTrigger className="bg-blue-800 text-black"><span className="mx-3 text-lg">Статистика ставок</span></AccordionTrigger>
                    <AccordionContent className="bg-blue-800 text-white-100 text-lg">
                        <div className="flex mx-3">
                            <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                            <p>Статистика ставок позволяет пользователям отслеживать свои ставки и анализировать результаты. Это помогает в принятии более обоснованных решений в будущем.</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="bg-orange-800 text-black"><span className="mx-3 text-lg">Турниры</span></AccordionTrigger>
                    <AccordionContent className="bg-orange-800 text-white-100 text-lg">
                        <div className="mx-3">
                            <div className="flex-shrink-0">
                                <div className="flex-shrink-0">
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Image
                                                className="mr-3 cursor-pointer"
                                                src="/coop/img_12.png"
                                                alt="Турниры"
                                                width={100}
                                                height={100}
                                                onClick={() => openDialog("/coop/img_12.png")}
                                            />
                                        </DialogTrigger>
                                        <DialogContent className="dialog-content">
                                            <DialogHeader>
                                                <DialogTitle>Турниры</DialogTitle>
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
                                </div>
                            </div>
                            <p>🌟 Присоединяйтесь к Эпическим Турнирам по Heroes 3 HoTA! 🌟</p>
                            <p>
                                Готовы испытать свои навыки и стратегическое мышление? Примите участие в наших
                                захватывающих турнирах по Heroes 3 HoTA и покажите, на что вы способны!
                            </p>
                            <p> 🔥 Почему стоит участвовать?</p>

                            Соревнуйтесь: Испытайте свои силы против опытных игроков и поднимитесь на вершину
                            рейтинга.
                            Уникальные награды: Зарабатывайте ценные $ points и другие призы за победы в
                            турнирах.
                            Улучшайте свои навыки: Анализируйте свои игры и учитесь у лучших, чтобы стать
                            мастером Heroes 3 HoTA.
                            Сообщество единомышленников: Общайтесь и делитесь опытом с другими фанатами игры.
                            🎮 Как начать?
                            Зарегистрируйтесь на нашей платформе и создайте свой профиль.
                            Выберите турнир и подайте заявку на участие.
                            Играйте и побеждайте: Покажите свои лучшие стратегии и тактики в игре.
                            Не упустите шанс стать легендой Heroes 3 HoTA! Присоединяйтесь к нам и начните свое
                            путешествие к славе уже сегодня!
                            <div className="mx-3"><p><a className="text-blue-800" target="_blank" href="/turnir">Перейти</a>
                            </p></div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                <AccordionTrigger className="bg-green-500 text-black"><span className="mx-3 text-lg">Points $ и внутренние переводы</span></AccordionTrigger>
                    <AccordionContent className="bg-green-500 text-white-100 text-lg">
                        <div className="flex mx-3">
                                                        <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                            <p>Система внутренних $ points позволяет пользователям обмениваться баллами внутри платформы. Это создает экономику внутри сайта, где пользователи могут зарабатывать и тратить баллы.</p>
                        </div>
                        <div className="mx-3"><p><a className="text-blue-800" target="_blank" href="/transfer-points">Перейти</a></p></div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className="bg-yellow-500 text-black"><span className="mx-3 text-lg">P2P торговля</span></AccordionTrigger>
                    <AccordionContent className="bg-yellow-500 text-white-100 text-lg">
                        <div className="flex mx-3">
                                                        <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                                                        <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                            <p>P2P торговля позволяет пользователям обмениваться ресурсами напрямую, без посредников. Это упрощает процесс торговли и делает его более доступным. 1 points стоит 0,005 USD</p>
                        </div>
                        <div className="mx-3"><p><a className="text-blue-800" target="_blank" href="/order-p2p">Перейти</a></p></div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger className="bg-purple-500 text-black"><span className="mx-3 text-lg">Рейтинг points</span></AccordionTrigger>
                    <AccordionContent className="bg-purple-500 text-white-100 text-lg">
                        <div className="flex mx-3">
                                                        <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                            <p>Рейтинг points позволяет пользователям отслеживать свои достижения и сравнивать их с другими участниками платформы. Это стимулирует пользователей к активному участию и улучшению своих результатов.</p>
                        </div>
                        <div className="mx-3"><p><a className="text-blue-800" target="_blank" href="/rating">Перейти</a>
                        </p></div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                    <AccordionTrigger className="bg-teal-500 text-black"><span className="mx-3 text-lg">Статистика игроков и турниров</span></AccordionTrigger>
                    <AccordionContent className="bg-teal-500 text-white-100 text-lg">
                        <div className="flex mx-3">
                                                        <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                                                        <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                                                        <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                            <p>Статистика игроков и турниров предоставляет детальную информацию о результатах и достижениях участников. Это помогает пользователям анализировать свои успехи и планировать дальнейшие действия.</p>

                        </div>
                        <div className="mx-3">
                            <p><a className="text-blue-800" target="_blank" href="/tournament">Перейти</a></p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                    <AccordionTrigger className="bg-orange-500 text-black"><span className="mx-3 text-lg">Игры на $ points</span></AccordionTrigger>
                    <AccordionContent className="bg-orange-500 text-white-100 text-lg">
                        <div className="flex mx-3">
                                                        <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                                                        <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                                                        <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                            <p>Игры на $ points позволяют пользователям участвовать в различных соревнованиях и
                                зарабатывать баллы. Это делает платформу более интерактивной и увлекательной.</p>
                        </div>
                        <div className="mx-3">
                            <p><a className="text-blue-800" target="_blank" href="/user-game-create-2">Создать игру</a> нужна регистрация!</p>
                            <p><a className="text-blue-800" target="_blank" href="/user-game-2">Найти игру</a> нужна регистрация! </p>

                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-9">
                    <AccordionTrigger className="bg-pink-500 text-black"><span
                        className="mx-3 text-lg">Статистика сайта</span></AccordionTrigger>
                    <AccordionContent className="bg-pink-500 text-white-100 text-lg">
                        <div className="flex mx-3">
                                                        <div className="flex-shrink-0">
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Image
                                        className="mr-3 cursor-pointer"
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
                             </div>
                            <p>Статистика сайта предоставляет общую информацию о деятельности на платформе, активность и другие важные метрики. Открытая статистика
                                помогает пользователям heroes3.site следить за передвижением Points. Количество Points в
                                системе неизменно - 11 000 000</p>
                        </div>
                        <div className="mx-3"><p><a className="text-blue-800" target="_blank" href="/statistics">Перейти</a></p></div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}