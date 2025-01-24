'use server';
import {prisma} from '@/prisma/prisma-client';
import {getUserSession} from '@/components/lib/get-user-session';
import {PlayerChoice, Prisma} from '@prisma/client';
import {hashSync} from 'bcrypt';
import {revalidatePath, revalidateTag} from 'next/cache'
import requestIp from 'request-ip';
import axios from 'axios';

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
    const pointsBet = parseFloat((pointsBetResult._sum.totalBetAmount || 0).toFixed(2));

    // 3. Количество зарегистрированных пользователей
    const users = await prisma.user.count();

    // 4. Начальные очки (количество пользователей * 1000)
    const pointsStart = parseFloat((users * 1000).toFixed(2));

    // 5. Сумма всех очков пользователей
    const pointsAllUsersResult = await prisma.user.aggregate({
      _sum: {
        points: true,
      },
    });
    const pointsAllUsers = parseFloat((pointsAllUsersResult._sum.points || 0).toFixed(2));

    // 6. Общая маржа из всех закрытых ставок
    const marginResult = await prisma.betCLOSED.aggregate({
      _sum: {
        margin: true,
      },
    });
    const margin = parseFloat((marginResult._sum.margin || 0).toFixed(2));

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

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error('Пользователь не найден');
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
    //console.log('Error [UPDATE_USER]', err);
    throw err;
  }
}

function calculateMaxBets(initBetPlayer1: number, initBetPlayer2: number): { maxBetPlayer1: number, maxBetPlayer2: number } {
  const maxBetPlayer1 = parseFloat((initBetPlayer2 * 2.00).toFixed(2)); // 100% от суммы ставок на Player2
  const maxBetPlayer2 = parseFloat((initBetPlayer1 * 2.00).toFixed(2)); // 100% от суммы ставок на Player1
  return { maxBetPlayer1, maxBetPlayer2 };
}
const MARGIN = 0.05; // Маржа 5%
function calculateOdds(totalWithInitPlayer1: number, totalWithInitPlayer2: number) {
  const totalWithInit = totalWithInitPlayer1 + totalWithInitPlayer2;
  const payout = totalWithInit * (1 - MARGIN); // Общая сумма выплат с учетом маржи

  const oddsPlayer1 = totalWithInitPlayer1 === 0 ? 1 : payout / totalWithInitPlayer1;
  const oddsPlayer2 = totalWithInitPlayer2 === 0 ? 1 : payout / totalWithInitPlayer2;

  return {
    oddsPlayer1: parseFloat(oddsPlayer1.toFixed(2)),
    oddsPlayer2: parseFloat(oddsPlayer2.toFixed(2)),
  };
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

    const totalBetAmount = parseFloat((formData.initBetPlayer1 + formData.initBetPlayer2).toFixed(2));
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
        currentOdds1: parseFloat(formData.currentOdds1.toFixed(2)), // Инициализируем текущие коэффициенты (по умолчанию 1)
        currentOdds2: parseFloat(formData.currentOdds2.toFixed(2)), // Инициализируем текущие коэффициенты (по умолчанию 1)
        player1Id: formData.player1Id,
        player2Id: formData.player2Id,
        initBetPlayer1: parseFloat(formData.initBetPlayer1.toFixed(2)),
        initBetPlayer2: parseFloat(formData.initBetPlayer2.toFixed(2)),
        categoryId: formData.categoryId,
        productId: formData.productId,
        productItemId: formData.productItemId,
        creatorId: formData.creatorId,
        totalBetPlayer1: 0, // Инициализируем сумму ставок на игрока 1
        totalBetPlayer2: 0, // Инициализируем сумму ставок на игрока 2
        margin: 0, // Инициализируем общую маржу
        marginOverlap: 0, // Инициализируем возвращенную маржу от не до перекрытых ставок
        oddsBetPlayer1: 0, // Инициализируем разницу ставок перекрытия на игрока 1
        oddsBetPlayer2: 0, // Инициализируем разницу ставок перекрытия на игрока 2
      },
    });

    console.log("New bet created:", newBet); // Логируем созданную ставку

    console.log("User points remain unchanged:", user.points); // Логируем неизмененный баланс
    await updateGlobalData();
    // Ревалидируем путь (если используем Next.js)
    revalidatePath('/');

    return newBet; // Возвращаем созданную ставку
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.stack);
    }
    throw new Error('Failed to create bet. Please try again.');
  }
}

export async function placeBet(formData: { betId: number; userId: number; amount: number; player: PlayerChoice }) {
  try {
    const { betId, userId, amount, player } = formData;

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

    // Рассчитываем общие суммы ставок на каждого игрока
    const totalPlayer1 = bet.participants
        .filter(p => p.player === PlayerChoice.PLAYER1)
        .reduce((sum, p) => sum + p.amount, 0);

    const totalPlayer2 = bet.participants
        .filter(p => p.player === PlayerChoice.PLAYER2)
        .reduce((sum, p) => sum + p.amount, 0);

    const totalWithInitPlayer1 = totalPlayer1 + (bet.initBetPlayer1 || 0);
    const totalWithInitPlayer2 = totalPlayer2 + (bet.initBetPlayer2 || 0);

    const { oddsPlayer1, oddsPlayer2 } = calculateOdds(totalWithInitPlayer1, totalWithInitPlayer2);

    // Проверка на минимальный коэффициент
    if (
        (player === PlayerChoice.PLAYER1 && oddsPlayer1 <= 1.02) ||
        (player === PlayerChoice.PLAYER2 && oddsPlayer2 <= 1.02)
    ) {
      throw new Error('Ставка невозможна: коэффициент для выбранного игрока уже равен или ниже 1.02');
    }

    // Рассчитываем потенциальный выигрыш
    const potentialProfit = amount * (player === PlayerChoice.PLAYER1 ? oddsPlayer1 : oddsPlayer2);

    // Проверка на максимальную допустимую ставку
    const { maxBetPlayer1, maxBetPlayer2 } = calculateMaxBets(totalWithInitPlayer1, totalWithInitPlayer2);
    const maxAllowedBet = player === PlayerChoice.PLAYER1 ? maxBetPlayer1 : maxBetPlayer2;

    if (amount > maxAllowedBet) {
      throw new Error(`Максимально допустимая ставка: ${maxAllowedBet.toFixed(2)}`);
    }

    // Находим частично перекрытую ставку, если она существует
    const partiallyCoveredBet = bet.participants.find(p => p.isCovered && p.overlap < p.amount);

    let remainingAmount = amount;
    let overlapAmount = 0;

    if (partiallyCoveredBet) {
      // Перекрываем частично перекрытую ставку
      const overlap = Math.min(partiallyCoveredBet.amount - partiallyCoveredBet.overlap, remainingAmount);
      overlapAmount += overlap;
      remainingAmount -= overlap;

      // Обновляем частично перекрытую ставку
      await prisma.betParticipant.update({
        where: { id: partiallyCoveredBet.id },
        data: {
          overlap: partiallyCoveredBet.overlap + overlap,
        },
      });
    }

    // Если осталась сумма для перекрытия, перекрываем другие ставки
    if (remainingAmount > 0) {
      const oppositeParticipants = bet.participants
          .filter(p => p.player !== player && !p.isCovered)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      for (const participant of oppositeParticipants) {
        if (remainingAmount <= 0) break;

        const overlap = Math.min(participant.amount, remainingAmount);
        overlapAmount += overlap;
        remainingAmount -= overlap;

        await prisma.betParticipant.update({
          where: { id: participant.id },
          data: {
            isCovered: true,
            overlap: participant.overlap + overlap,
          },
        });
      }
    }

    // Создаем новую ставку
    const participantMargin = amount * MARGIN;
    const totalMargin = bet.participants.reduce((sum, p) => sum + p.margin, 0) + participantMargin;

    const newTotalBetPlayer1 = player === PlayerChoice.PLAYER1 ? totalPlayer1 + amount : totalPlayer1;
    const newTotalBetPlayer2 = player === PlayerChoice.PLAYER2 ? totalPlayer2 + amount : totalPlayer2;

    const oddsBetPlayer1 = newTotalBetPlayer1 - newTotalBetPlayer2;
    const oddsBetPlayer2 = newTotalBetPlayer2 - newTotalBetPlayer1;

    const marginOverlap = remainingAmount * MARGIN;

    const newMaxBetPlayer1 = player === PlayerChoice.PLAYER1 ? bet.maxBetPlayer1 : bet.maxBetPlayer1 + amount;
    const newMaxBetPlayer2 = player === PlayerChoice.PLAYER2 ? bet.maxBetPlayer2 : bet.maxBetPlayer2 + amount;

    await prisma.$transaction([
      prisma.betParticipant.create({
        data: {
          betId,
          userId,
          amount,
          player,
          odds: player === PlayerChoice.PLAYER1 ? oddsPlayer1 : oddsPlayer2,
          profit: potentialProfit,
          margin: participantMargin,
          marginOverlap,
          isCovered: overlapAmount > 0,
          overlap: overlapAmount,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          points: user.points - amount,
        },
      }),
      prisma.bet.update({
        where: { id: betId },
        data: {
          currentOdds1: oddsPlayer1,
          currentOdds2: oddsPlayer2,
          totalBetPlayer1: newTotalBetPlayer1,
          totalBetPlayer2: newTotalBetPlayer2,
          totalBetAmount: totalPlayer1 + totalPlayer2 + amount,
          margin: totalMargin,
          marginOverlap: bet.marginOverlap + marginOverlap,
          oddsBetPlayer1,
          oddsBetPlayer2,
          maxBetPlayer1: newMaxBetPlayer1,
          maxBetPlayer2: newMaxBetPlayer2,
        },
      }),
    ]);

    if (overlapAmount > 0) {
      const profit = overlapAmount * (player === PlayerChoice.PLAYER1 ? oddsPlayer1 : oddsPlayer2);
      const returnedAmount = remainingAmount * (1 - MARGIN);

      await prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: profit + returnedAmount,
          },
        },
      });
    }

    revalidatePath('/');
    await updateGlobalData();

    return { success: true, isCovered: overlapAmount > 0, overlapAmount };
  } catch (error) {
    console.error('Error in placeBet:', error);
    throw new Error('Failed to place bet. Please try again.');
  }
}

export async function closeBet(betId: number, winnerId: number) {
  'use server';

  try {
    if (winnerId === null || winnerId === undefined) {
      throw new Error("Не выбран победитель.");
    }

    await prisma.$transaction(async (prisma) => {
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
          currentOdds1: bet.currentOdds1,
          currentOdds2: bet.currentOdds2,
          totalBetAmount: bet.totalBetAmount,
          creatorId: bet.creatorId,
          status: 'CLOSED',
          categoryId: bet.categoryId,
          productId: bet.productId,
          productItemId: bet.productItemId,
          winnerId: bet.winnerId,
          margin: bet.margin,
          marginOverlap: bet.marginOverlap,
          createdAt: bet.createdAt,
          updatedAt: bet.updatedAt,
          oddsBetPlayer1: bet.oddsBetPlayer1,
          oddsBetPlayer2: bet.oddsBetPlayer2,
        },
      });

      const winningPlayer = bet.winnerId === bet.player1Id ? PlayerChoice.PLAYER1 : PlayerChoice.PLAYER2;

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

      const allParticipants = await prisma.betParticipant.findMany({
        where: { betId: betId },
      });

      for (const participant of allParticipants) {
        const profitFromOverlap = participant.overlap * participant.odds;
        const returnedMargin = (participant.amount - participant.overlap) * MARGIN * 0.5;

        await prisma.betParticipantCLOSED.create({
          data: {
            betCLOSEDId: betClosed.id,
            userId: participant.userId,
            amount: participant.amount,
            odds: participant.odds,
            profit: profitFromOverlap,
            player: participant.player,
            isWinner: participant.player === winningPlayer,
            margin: participant.margin,
            marginOverlap: returnedMargin,
            createdAt: participant.createdAt,
            isCovered: participant.isCovered,
            overlap: participant.overlap,
          },
        });
      }

      for (const participant of bet.participants) {
        if (participant.player === winningPlayer) {
          const profitFromOverlap = participant.overlap * participant.odds;
          const returnedAmount = (participant.amount - participant.overlap) * (1 - MARGIN);
          const returnedMargin = (participant.amount - participant.overlap) * MARGIN * 0.5;

          await prisma.user.update({
            where: { id: participant.userId },
            data: {
              points: {
                increment: profitFromOverlap + returnedAmount + returnedMargin,
              },
            },
          });
        } else {
          const lostAmount = participant.overlap;
          const returnedAmount = (participant.amount - participant.overlap) * (1 - MARGIN);
          const returnedMargin = (participant.amount - participant.overlap) * MARGIN * 0.5;

          await prisma.user.update({
            where: { id: participant.userId },
            data: {
              points: {
                decrement: lostAmount - returnedAmount - returnedMargin,
              },
            },
          });
        }
      }

      await prisma.betParticipant.deleteMany({
        where: { betId: betId },
      });

      await prisma.bet.delete({
        where: { id: betId },
      });

      await prisma.globalData.update({
        where: { id: 1 },
        data: {
          margin: {
            increment: bet.margin || 0,
          },
        },
      });
    });

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




















