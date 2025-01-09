'use server';
import {prisma} from '@/prisma/prisma-client';
import {getUserSession} from '@/components/lib/get-user-session';
import {Prisma} from '@prisma/client';
import {hashSync} from 'bcrypt';
import * as z from 'zod'
import { revalidatePath } from 'next/cache';
import { BetParticipant, PlayerChoice } from '@prisma/client'


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
    throw err;
  }
}
export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });
    if (user) {
      throw new Error('Пользователь уже существует');
    }
    await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });
  } catch (err) {
    console.log('Error [CREATE_USER]', err);
    throw err;
  }
}

const createBetSchema = z.object({
  player1: z.string().min(1, { message: 'Введите имя игрока 1' }),
  player2: z.string().min(1, { message: 'Введите имя игрока 2' }),
  initialOdds1: z.number().positive({ message: 'Коэффициент должен быть положительным числом' }), // Add this
  initialOdds2: z.number().positive({ message: 'Коэффициент должен быть положительным числом' }), // Add this
  categoryId: z.number().int(),
  productId: z.number().int(),
  productItemId: z.number().int(),
});

export async function createBet(formData: any) {
  const session = await getUserSession();
  console.log("formData:", formData); // Log the incoming data
  console.log("session:", session); // Log the session
  const data = createBetSchema.parse(formData);
  console.log("Parsed data:", data);  // Log the parsed data
  try {
    console.log("creatorId:", Number(session?.id)); // Log creatorId before Prisma call
    console.log("Other data:", { ...data, currentOdds1: data.oddsPlayer1, currentOdds2: data.oddsPlayer2 });
    await prisma.bet.create({
      data: {
        ...data,
        creatorId: Number(session?.id), // Make sure creatorId is a number
        initialOdds1: data.initialOdds1, // Use initialOdds1 from formData
        initialOdds2: data.initialOdds2, // Use initialOdds2 from formData
        currentOdds1: data.initialOdds1,  // Initialize current odds
        currentOdds2: data.initialOdds2,  // Initialize current odds
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.error("Error creating bet:", error)
    if (error instanceof z.ZodError) {
      throw new Error(error.message)
    } else if (error instanceof Error) {
      throw new Error(error.message)


    } else {
      throw new Error("Failed to create bet.")
    }
  }
}

export async function clientCreateBet(formData: any) { // This is the new wrapper
  'use server'; // Mark the wrapper as a server action
  try {
    await createBet(formData); // Call the ORIGINAL createBet function
    revalidatePath('/');
  } catch (error) {
    console.error("Ошибка при создании ставки:", error);
    throw error; // Re-throw to be caught by the client
  }
}



const placeBetSchema = z.object({
  betId: z.number().int(),
  userId: z.number().int(),
  amount: z.number().positive({ message: 'Сумма должна быть положительным числом' }),
  player: z.nativeEnum(PlayerChoice), // Use zod.nativeEnum
});

export async function placeBet(formData: z.infer<typeof placeBetSchema>) {
  try {

    const data = placeBetSchema.parse(formData);

    const bet = await prisma.bet.findUnique({
      where: { id: data.betId },
      include: {
        participants: { include: { user: true } }
      }
    });


    if (!bet) {
      throw new Error("Ставка не найдена");
    }

    if (bet.status === 'CLOSED') {
      throw new Error("Ставка закрыта");
    }

    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    if (user.points < data.amount) {
      throw new Error("Недостаточно средств");
    }


    const participant = await prisma.betParticipant.create({
      data: {
        betId: data.betId,
        userId: data.userId,
        amount: data.amount,
        odds: data.player === "PLAYER1" ? bet.currentOdds1 : bet.currentOdds2, // Correct odds recording
        player: data.player
      },
    });

    await prisma.user.update({
      where: { id: data.userId },
      data: { points: { decrement: data.amount } },
    });


    const totalBetAmount = bet.participants.reduce((acc, p) => acc + p.amount, 0) + participant.amount

    const odds1 = calculateOdds(totalBetAmount, data.betId, 'PLAYER1');
    const odds2 = calculateOdds(totalBetAmount, data.betId, 'PLAYER2');

    await prisma.bet.update({
      where: { id: data.betId },
      data: {
        totalBetAmount: totalBetAmount,
        currentOdds1: odds1,
        currentOdds2: odds2,
      }
    });

    revalidatePath('/')



  } catch (error) {

    console.error("Error placing bet:", error);
    if (error instanceof z.ZodError) {

      throw new Error(error.format()._errors[0])

    } else if (error instanceof Error) {

      throw new Error(error.message)


    } else {

      throw new Error("Failed to place bet.");

    }
  }
}


async function calculateOdds(totalBetAmount: number, betId: number, player: PlayerChoice) {
  const participants = await prisma.betParticipant.findMany({
    where: { betId, player },
  });
  const totalBetsOnPlayer = participants.reduce((sum, p) => sum + p.amount, 0);

  if(totalBetsOnPlayer === 0){
    return 0
  }
  const oppositePlayer = player === 'PLAYER1' ? 'PLAYER2' : 'PLAYER1';
  const betsOnOppositePlayer = await prisma.betParticipant.findMany({ where: { betId: betId, player: oppositePlayer } })
  const totalBetsOnOppositePlayer = betsOnOppositePlayer.reduce((acc, cur) => acc + cur.amount, 0)


  const odds = totalBetsOnOppositePlayer / totalBetsOnPlayer
  if(isNaN(odds)){
    return 0
  }
  return odds
}


export async function getBets() {
  'use server'; // Mark as server action

  try {
    const bets = await prisma.bet.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: true,
        participants: {
          include: { user: true },
        },
        category: true,
        product: true,
        productItem: true,
      },
    });
    return bets;
  } catch (error) {
    console.error("Error getting bets:", error);
    throw new Error("Failed to retrieve bets."); // Throw error for server component error handling
  }
}

export async function closeBet(betId: number, winnerId: number) {
  'use server'


  try {
    const bet = await prisma.bet.update({
      where: { id: betId },
      data: { status: 'CLOSED', winnerId: winnerId },
      include: {
        participants: {
          include: {
            user: true,
          }
        }
      }
    });

    if (!bet) {
      throw new Error("Ставка не найдена");
    }


    const winningPlayer = bet.winnerId === bet.creatorId ? PlayerChoice.PLAYER1 : PlayerChoice.PLAYER2;



    for (const participant of bet.participants) {
      if (participant.player === winningPlayer) {

        const winAmount = participant.amount * participant.odds;

        await prisma.user.update({
          where: { id: participant.userId },
          data: { points: { increment: winAmount } },
        });


        await prisma.betParticipant.update({
          where: {id: participant.id},
          data: {
            isWinner: true,
          }
        })
      }
    }


    revalidatePath('/')



  } catch (error) {
    console.error("Error closing bet:", error)

    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error("Failed to close bet.")
    }

  }

}

