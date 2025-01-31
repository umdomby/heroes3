'use server';
import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/components/lib/get-user-session';
import { PlayerChoice, Prisma, IsCovered, BetParticipant, Bet } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { revalidatePath, revalidateTag } from 'next/cache';

const MARGIN = parseFloat(process.env.MARGIN || '0.05');

// Функция для обновления глобальных данных
export async function updateGlobalData() {
    try {
        // 1. Количество пользователей, участвующих в открытых ставках
        const usersPlay = await prisma.betParticipant.count({
            where: {
                bet: {
                    status: 'OPEN', // Предполагаем, что статус открытой ставки — 'OPEN'
                },
            },
        });

        // 2. Общая сумма ставок в открытых ставках
        const pointsBetResult = await prisma.bet.aggregate({
            _sum: {
                totalBetAmount: true,
            },
            where: {
                status: 'OPEN', // Только открытые ставки
            },
        });
        // Округляем до двух знаков после запятой
        const pointsBet = Math.floor((pointsBetResult._sum.totalBetAmount || 0) * 100) / 100;

        // 3. Количество зарегистрированных пользователей
        const users = await prisma.user.count();

        // 4. Начальные очки (количество пользователей * 1000)
        const pointsStart = Math.floor(users * 1000 * 100) / 100;

        // 5. Сумма всех очков пользователей
        const pointsAllUsersResult = await prisma.user.aggregate({
            _sum: {
                points: true,
            },
        });
        // Округляем до двух знаков после запятой
        const pointsAllUsers = Math.floor((pointsAllUsersResult._sum.points || 0) * 100) / 100;

        // 6. Общая маржа из всех закрытых ставок
        const marginResult = await prisma.betCLOSED.aggregate({
            _sum: {
                margin: true,
            },
        });
        // Округляем до двух знаков после запятой
        const margin = Math.floor((marginResult._sum.margin || 0) * 100) / 100;

        // Обновляем или создаем запись в GlobalData
        await prisma.globalData.upsert({
            where: { id: 1 },
            update: {
                usersPlay,
                pointsBet,
                users,
                pointsStart,
                pointsAllUsers,
                margin, // Обновляем общую маржу
            },
            create: {
                id: 1,
                usersPlay,
                pointsBet,
                users,
                pointsStart,
                pointsAllUsers,
                margin, // Создаем запись с общей маржой
            },
        });

        console.log('GlobalData updated successfully');
    } catch (error) {
        console.error('Error updating GlobalData:', error);
        throw new Error('Failed to update GlobalData');
    }
}

// Функция для обновления информации о пользователе
export async function updateUserInfo(body: Prisma.UserUpdateInput) {
    try {
        const currentUser = await getUserSession();

        if (!currentUser) {
            throw new Error('Пользователь не найден');
        }

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(currentUser.id),
            },
        });

        await prisma.user.update({
            where: {
                id: Number(currentUser.id),
            },
            data: {
                fullName: body.fullName,
                email: body.email,
                password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
            },
        });
    } catch (err) {
        throw err;
    }
}

export async function clientCreateBet(formData: any) {
    const session = await getUserSession();
    if (!session) {
        throw new Error("User session is not available.");
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(session.id) },
        });

        if (!user) {
            throw new Error("Пользователь не найден");
        }

        // Округляем до двух знаков после запятой
        const totalBetAmount = Math.floor((formData.initBetPlayer1 + formData.initBetPlayer2) * 100) / 100;
        if (totalBetAmount > 100) {
            throw new Error("Сумма начальных ставок не должна превышать 100 баллов");
        }

        const { maxBetPlayer1, maxBetPlayer2 } = calculateMaxBets(formData.initBetPlayer1, formData.initBetPlayer2);

        const newBet = await prisma.bet.create({
            data: {
                status: 'OPEN', // Устанавливаем статус ставки как "открытая"
                totalBetAmount: 0, // Общая сумма начальных ставок
                maxBetPlayer1: maxBetPlayer1, // Максимальная сумма ставок на игрока 1
                maxBetPlayer2: maxBetPlayer2, // Максимальная сумма ставок на игрока 2
                // Округляем до двух знаков после запятой
                oddsBetPlayer1: Math.floor((parseFloat(formData.oddsBetPlayer1) * 100)) / 100, // Инициализируем текущие коэффициенты
                oddsBetPlayer2: Math.floor((parseFloat(formData.oddsBetPlayer2) * 100)) / 100, // Инициализируем текущие коэффициенты
                player1Id: formData.player1Id,
                player2Id: formData.player2Id,
                // Округляем до двух знаков после запятой
                initBetPlayer1: Math.floor((parseFloat(formData.initBetPlayer1) * 100)) / 100,
                initBetPlayer2: Math.floor((parseFloat(formData.initBetPlayer2) * 100)) / 100,
                overlapPlayer1: 0, // Перекрытие на игрока 1
                overlapPlayer2: 0, // Перекрытие на игрока 2
                categoryId: formData.categoryId,
                productId: formData.productId,
                productItemId: formData.productItemId,
                creatorId: formData.creatorId,
                totalBetPlayer1: 0, // Инициализируем сумму ставок на игрока 1
                totalBetPlayer2: 0, // Инициализируем сумму ставок на игрока 2
                margin: 0, // Инициализируем общую маржу
            },
        });

        console.log("New bet created:", newBet); // Логируем созданную ставку

        console.log("User points remain unchanged:", user.points); // Логируем неизмененный баланс
        await updateGlobalData();
        revalidatePath('/');

        return newBet; // Возвращаем созданную ставку
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.stack);
        }
        throw new Error('Failed to create bet. Please try again.');
    }
}

// Функция для расчета коэффициентов
function calculateOdds(totalWithInitPlayer1: number, totalWithInitPlayer2: number) {
    const totalWithInit = totalWithInitPlayer1 + totalWithInitPlayer2;

    // Calculate odds without margin
    const oddsPlayer1 = totalWithInitPlayer1 === 0 ? 1 : totalWithInit / totalWithInitPlayer1;
    const oddsPlayer2 = totalWithInitPlayer2 === 0 ? 1 : totalWithInit / totalWithInitPlayer2;

    return {
        // Округляем до двух знаков после запятой
        oddsPlayer1: Math.floor((oddsPlayer1 * 100)) / 100,
        oddsPlayer2: Math.floor((oddsPlayer2 * 100)) / 100,
    };
}

// Функция для расчета максимальных ставок
function calculateMaxBets(initBetPlayer1: number, initBetPlayer2: number): {
    maxBetPlayer1: number,
    maxBetPlayer2: number
} {
    // Округляем до двух знаков после запятой
    const maxBetPlayer1 = Math.floor((initBetPlayer2 * 1.00) * 100) / 100; // 100% от суммы ставок на Player2
    const maxBetPlayer2 = Math.floor((initBetPlayer1 * 1.00) * 100) / 100; // 100% от суммы ставок на Player1
    return { maxBetPlayer1, maxBetPlayer2 };
}

function areNumbersEqual(num1: number, num2: number): boolean {
    return Math.abs(num1 - num2) < Number.EPSILON;
}

export async function placeBet(formData: { betId: number; userId: number; amount: number; player: PlayerChoice }) {
    try {
        console.log('Запуск функции placeBet с formData:', formData);

        if (!formData || typeof formData !== 'object') {
            throw new Error('Неверные данные формы');
        }

        const { betId, userId, amount, player } = formData;

        if (!betId || !userId || !amount || !player) {
            throw new Error('Отсутствуют обязательные поля в данных формы');
        }

        const bet = await prisma.bet.findUnique({
            where: { id: betId },
            include: { participants: true },
        });

        if (!bet || bet.status !== 'OPEN') {
            throw new Error('Ставка недоступна для участия');
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || user.points < amount) {
            throw new Error('Недостаточно баллов для совершения ставки');
        }

        const totalPlayer1 = bet.participants
            .filter(p => p.player === PlayerChoice.PLAYER1)
            .reduce((sum, p) => sum + p.profit, 0);

        const totalPlayer2 = bet.participants
            .filter(p => p.player === PlayerChoice.PLAYER2)
            .reduce((sum, p) => sum + p.profit, 0);

        const totalWithInitPlayer1 = totalPlayer1 + (bet.initBetPlayer1 || 0);
        const totalWithInitPlayer2 = totalPlayer2 + (bet.initBetPlayer2 || 0);

        const currentOdds = player === PlayerChoice.PLAYER1 ? bet.oddsBetPlayer1 : bet.oddsBetPlayer2;
        const potentialProfit = amount * (currentOdds - 1);

        const { maxBetPlayer1, maxBetPlayer2 } = calculateMaxBets(totalWithInitPlayer1, totalWithInitPlayer2);
        const maxAllowedBet = player === PlayerChoice.PLAYER1 ? maxBetPlayer1 : maxBetPlayer2;

        if (amount > maxAllowedBet) {
            throw new Error(`Максимально допустимая ставка: ${maxAllowedBet}`);
        }

        await prisma.betParticipant.create({
            data: {
                betId,
                userId,
                amount,
                player,
                odds: currentOdds,
                profit: potentialProfit,
                margin: 0,
                isCovered: "OPEN",
                overlap: 0,
            },
        });

        await prisma.user.update({
            where: { id: userId },
            data: {
                points: user.points - amount,
            },
        });

        const {
            oddsPlayer1,
            oddsPlayer2
        } = calculateOdds(totalWithInitPlayer1 + (player === PlayerChoice.PLAYER1 ? amount : 0), totalWithInitPlayer2 + (player === PlayerChoice.PLAYER2 ? amount : 0));
        const totalMargin = await prisma.betParticipant.aggregate({
            _sum: {
                margin: true,
            },
            where: {
                betId: betId,
            },
        });

        const updatedBetData = {
            // Округляем до двух знаков после запятой
            oddsBetPlayer1: Math.floor((oddsPlayer1 * (parseFloat(process.env.CORRECT_ODDS || '0.85')) * 100)) / 100,
            oddsBetPlayer2: Math.floor((oddsPlayer2 * (parseFloat(process.env.CORRECT_ODDS || '0.85')) * 100)) / 100,
            totalBetPlayer1: player === PlayerChoice.PLAYER1 ? totalPlayer1 + amount : totalPlayer1,
            totalBetPlayer2: player === PlayerChoice.PLAYER2 ? totalPlayer2 + amount : totalPlayer2,
            totalBetAmount: totalPlayer1 + totalPlayer2 + amount,
            margin: totalMargin._sum.margin || 0,
            maxBetPlayer1: player === PlayerChoice.PLAYER1 ? bet.maxBetPlayer1 : bet.maxBetPlayer1 + amount,
            maxBetPlayer2: player === PlayerChoice.PLAYER2 ? bet.maxBetPlayer2 : bet.maxBetPlayer2 + amount,
            overlapPlayer1: player === PlayerChoice.PLAYER1 ? bet.overlapPlayer1 + amount : bet.overlapPlayer1,
            overlapPlayer2: player === PlayerChoice.PLAYER2 ? bet.overlapPlayer2 + amount : bet.overlapPlayer2,
        };

        await prisma.bet.update({
            where: { id: betId },
            data: updatedBetData,
        }).then(async () => {
            await balanceOverlaps(betId);
        }).then(async () => {
            // Обновление статуса isCovered
            const participants = await prisma.betParticipant.findMany({
                where: { betId },
                orderBy: { createdAt: 'asc' },
            });
            for (const participant of participants) {
                let newIsCoveredStatus: IsCovered;

                if (areNumbersEqual(participant.overlap, 0)) {
                    newIsCoveredStatus = IsCovered.OPEN;
                } else if (participant.overlap >= participant.profit) {
                    newIsCoveredStatus = IsCovered.CLOSED;
                } else {
                    newIsCoveredStatus = IsCovered.PENDING;
                }

                if (participant.isCovered !== newIsCoveredStatus) {
                    await prisma.betParticipant.update({
                        where: { id: participant.id },
                        data: { isCovered: newIsCoveredStatus },
                    });
                }
            }
        }).then(async () => {
            await updateGlobalData();
        });

        revalidatePath('/');

        return { success: true };
    } catch (error) {
        if (error === null || error === undefined) {
            console.error('Ошибка в placeBet: Неизвестная ошибка (error is null или undefined)');
        } else if (error instanceof Error) {
            console.error('Ошибка в placeBet:', error.message);
            console.error('Стек ошибки:', error.stack);
        } else {
            console.error('Ошибка в placeBet:', error);
        }

        throw new Error('Не удалось разместить ставку. Пожалуйста, попробуйте еще раз.');
    }
}

// Функция для балансировки перекрытий
async function balanceOverlaps(betId: number) {
    console.log(`Начало balanceOverlaps для betId: ${betId}`);

    // Получаем всех участников с данным betId, отсортированных по дате создания
    const participants = await prisma.betParticipant.findMany({
        where: { betId },
        orderBy: { createdAt: 'asc' },
    });

    // Получаем текущие значения overlap для ставки
    let bet = await prisma.bet.findUnique({
        where: { id: betId },
    });

    // Проверяем, что ставка существует
    if (!bet) {
        throw new Error('Ставка не найдена');
    }

    // Вложенная функция для переноса перекрытий между участниками
    async function transferOverlap(
        targetParticipants: BetParticipant[],
        overlapField: 'overlapPlayer1' | 'overlapPlayer2',
        bet: Bet
    ) {
        // Цикл продолжается, пока не будет достигнуто равенство profit и overlap для всех участников
        // или пока не исчерпаны ресурсы для перекрытия
        while (bet[overlapField] > 0) {
            let allProfitEqualOverlap = true; // Предполагаем, что все равны, пока не найдём исключение

            // Проходим по всем участникам-целям
            for (let i = 0; i < targetParticipants.length; i++) {
                const target = targetParticipants[i];

                // Проверяем, что profit не равен overlap
                if (Math.floor(target.profit * 100) / 100 !== Math.floor(target.overlap * 100) / 100) {
                    allProfitEqualOverlap = false; // Если найдена запись, где profit не равен overlap, продолжаем цикл

                    // Вычисляем, сколько нужно добавить в overlap, чтобы достичь равенства с profit
                    const neededOverlap = target.profit - target.overlap;

                    console.log('( profit: ' + target.profit + " ), не равен (overlap: " + target.overlap + " ), profit - overlap : " + neededOverlap + ", bet[overlapField] " + bet[overlapField]);
                    // Определяем, сколько можно добавить в overlap, учитывая доступные ресурсы
                    const overlapToAdd = Math.min(neededOverlap, bet[overlapField]);

                    console.log(`Цель: ${target.id}, Необходимо: ${neededOverlap}, Добавить: ${overlapToAdd}`);

                    // Если есть возможность добавить overlap
                    if (overlapToAdd > 0) {
                        // Вычисляем новое значение overlap
                        const newOverlap = Math.floor((target.overlap + overlapToAdd) * 100) / 100;
                        // Проверяем, что новое значение overlap не превышает profit
                        if (newOverlap > target.profit) {
                            throw new Error('Ошибка: overlap не может быть больше profit');
                        }

                        // Обновляем overlap у участника-цели
                        await prisma.betParticipant.update({
                            where: { id: target.id },
                            data: {
                                overlap: newOverlap,
                            },
                        });

                        // Обновляем значение overlap в ставке
                        await prisma.bet.update({
                            where: { id: betId },
                            data: {
                                [overlapField]: Math.floor((bet[overlapField] - overlapToAdd) * 100) / 100,
                            },
                        });

                        // Обновляем объект bet в памяти
                        bet[overlapField] = Math.floor((bet[overlapField] - overlapToAdd) * 100) / 100;

                        // Обновляем локальные данные участника
                        targetParticipants[i].overlap = newOverlap;

                        // Если у источника больше нет доступной суммы, выходим из внутреннего цикла
                        if (bet[overlapField] <= 0) break;
                    }
                }
            }

            // Если все profit равны overlap, выходим из внешнего цикла
            if (allProfitEqualOverlap) break;
        }
    }

    // Разделяем участников на две группы: те, кто ставил на PLAYER1, и те, кто ставил на PLAYER2
    const participantsPlayer1 = participants.filter(p => p.player === PlayerChoice.PLAYER1);
    const participantsPlayer2 = participants.filter(p => p.player === PlayerChoice.PLAYER2);

    console.log('Переносим перекрытия от участников PLAYER1');
    await transferOverlap(participantsPlayer1, 'overlapPlayer2', bet);

    console.log('Переносим перекрытия от участников PLAYER2');
    await transferOverlap(participantsPlayer2, 'overlapPlayer1', bet);

    console.log(`Завершение balanceOverlaps для betId: ${betId}`);
}

// Функция для закрытия ставки
export async function closeBet(betId: number, winnerId: number) {
    'use server';

    try {
        if (winnerId === null || winnerId === undefined) {
            throw new Error("Не выбран победитель.");
        }

        await prisma.$transaction(async (prisma) => {
            // Обновляем статус ставки и получаем данные
            const bet = await prisma.bet.update({
                where: { id: betId },
                data: {
                    status: 'CLOSED',
                    winnerId: winnerId,
                },
                include: {
                    participants: true,
                    player1: true,
                    player2: true,
                },
            });

            if (!bet) {
                throw new Error("Ставка не найдена");
            }

            // Создаем запись в BetCLOSED
            const betClosed = await prisma.betCLOSED.create({
                data: {
                    player1Id: bet.player1Id,
                    player2Id: bet.player2Id,
                    initBetPlayer1: bet.initBetPlayer1,
                    initBetPlayer2: bet.initBetPlayer2,
                    totalBetPlayer1: bet.totalBetPlayer1,
                    totalBetPlayer2: bet.totalBetPlayer2,
                    maxBetPlayer1: bet.maxBetPlayer1,
                    maxBetPlayer2: bet.maxBetPlayer2,
                    totalBetAmount: bet.totalBetAmount,
                    creatorId: bet.creatorId,
                    status: 'CLOSED',
                    categoryId: bet.categoryId,
                    productId: bet.productId,
                    productItemId: bet.productItemId,
                    winnerId: bet.winnerId,
                    margin: bet.margin,
                    createdAt: bet.createdAt,
                    updatedAt: bet.updatedAt,
                    oddsBetPlayer1: bet.oddsBetPlayer1,
                    oddsBetPlayer2: bet.oddsBetPlayer2,
                    overlapPlayer1: bet.overlapPlayer1,
                    overlapPlayer2: bet.overlapPlayer2,
                },
            });

            // Определяем победителя
            const winningPlayer = bet.winnerId === bet.player1Id ? PlayerChoice.PLAYER1 : PlayerChoice.PLAYER2;

            // Обновляем статус участников
            await prisma.betParticipant.updateMany({
                where: { betId: betId },
                data: {
                    isWinner: false,
                },
            });

            await prisma.betParticipant.updateMany({
                where: {
                    betId: betId,
                    player: winningPlayer,
                },
                data: {
                    isWinner: true,
                },
            });

            // Перераспределяем баллы
            const allParticipants = await prisma.betParticipant.findMany({
                where: { betId: betId },
            });

            let totalMargin = 0;

            for (const participant of allParticipants) {
                let pointsToReturn = 0;
                let margin = 0;

                if (participant.isWinner) {
                    if (participant.isCovered === "CLOSED" && participant.profit === participant.overlap) {
                        margin = participant.overlap * MARGIN;
                        pointsToReturn = participant.overlap + participant.amount - margin;
                    } else if (participant.isCovered === "OPEN" && participant.overlap === 0) {
                        pointsToReturn = participant.amount;
                    } else if (participant.isCovered === "PENDING" && participant.profit > participant.overlap) {
                        margin = participant.overlap * MARGIN;
                        pointsToReturn = participant.overlap + participant.amount - margin;
                    }
                    totalMargin += margin;
                } else {
                    if (participant.isCovered === "CLOSED" && participant.profit === participant.overlap) {
                        pointsToReturn = 0;
                    } else if (participant.isCovered === "OPEN" && participant.overlap === 0) {
                        pointsToReturn = participant.amount;
                    } else if (participant.isCovered === "PENDING" && participant.profit > participant.overlap) {
                        pointsToReturn = (participant.amount - (participant.overlap / participant.odds)) / (parseFloat(process.env.LOSE_PENDING_BET || '2'));
                    }
                }

                // Обновляем баллы пользователя
                if (pointsToReturn > 0) {
                    await prisma.user.update({
                        where: { id: participant.userId },
                        data: {
                            // Округляем до двух знаков после запятой
                            points: {
                                increment: Math.floor(pointsToReturn * 100) / 100,
                            },
                        },
                    });
                }

                // Создаем запись в BetParticipantCLOSED
                await prisma.betParticipantCLOSED.create({
                    data: {
                        betCLOSEDId: betClosed.id,
                        userId: participant.userId,
                        amount: participant.amount,
                        odds: participant.odds,
                        profit: participant.profit,
                        player: participant.player,
                        isWinner: participant.isWinner,
                        margin: margin,
                        createdAt: participant.createdAt,
                        isCovered: participant.isCovered,
                        overlap: participant.overlap,
                        // Округляем до двух знаков после запятой
                        return: Math.floor(pointsToReturn * 100) / 100,
                    },
                });
            }

            // Обновляем поле margin в BetCLOSED
            await prisma.betCLOSED.update({
                where: { id: betClosed.id },
                data: {
                    // Округляем до двух знаков после запятой
                    margin: Math.floor(totalMargin * 100) / 100,
                },
            });

            // Удаляем участников и ставку
            await prisma.betParticipant.deleteMany({
                where: { betId: betId },
            });

            await prisma.bet.delete({
                where: { id: betId },
            });

            // Обновляем глобальные данные
            await prisma.globalData.update({
                where: { id: 1 },
                data: {
                    // Округляем до двух знаков после запятой
                    margin: {
                        increment: Math.floor(bet.margin * 100) / 100,
                    },
                },
            });
        });

        // Ревалидация данных
        await updateGlobalData();
        revalidatePath('/');
        revalidateTag('bets');
        revalidateTag('user');

        return { success: true, message: 'Ставка успешно закрыта' };
    } catch (error) {
        console.error("Ошибка при закрытии ставки:", error);

        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Не удалось закрыть ставку.");
        }
    }
}