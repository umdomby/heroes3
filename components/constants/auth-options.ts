import { AuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import requestIp from 'request-ip';
import axios from 'axios';

import { prisma } from '@/prisma/prisma-client';
import { compare, hashSync } from 'bcrypt';
import { UserRole } from '@prisma/client';

function generateCardId() {
  const length = 16; // Длина идентификатора, например, 16 цифр
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10); // Добавляем случайную цифру
  }
  return result;
}

// Функция для проверки VPN
async function checkVPN(ip: string): Promise<boolean> {
  try {
    const response = await axios.get(`https://v2.api.iphub.info/ip/${ip}`, {
      headers: {
        'X-Key': process.env.IPHUB_API_KEY!, // Ваш API-ключ от IPHub
      },
    });
    return response.data.block === 1; // Если block === 1, то это VPN/прокси
  } catch (error) {
    console.error('Ошибка при проверке VPN:', error);
    return false;
  }
}

// Функция для обновления истории входов
async function updateLoginHistory(userId: number, ip: string, isVPN: boolean) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // Используем any для упрощения
    let loginHistory: any[] = [];

    if (Array.isArray(user.loginHistory)) {
      // Если loginHistory уже массив, используем его
      loginHistory = user.loginHistory;
    } else if (typeof user.loginHistory === 'string') {
      // Если loginHistory — строка, пытаемся распарсить её как JSON
      try {
        const parsedHistory = JSON.parse(user.loginHistory);
        if (Array.isArray(parsedHistory)) {
          loginHistory = parsedHistory;
        }
      } catch (error) {
        console.error('Ошибка при парсинге loginHistory:', error);
      }
    }

    // Ищем существующую запись
    const existingEntry = loginHistory.find((entry: any) => entry.ip === ip);

    if (existingEntry) {
      // Обновляем существующую запись
      existingEntry.lastLogin = new Date().toISOString();
      existingEntry.vpn = isVPN;
      existingEntry.loginCount += 1;
    } else {
      // Добавляем новую запись
      loginHistory.push({
        ip,
        lastLogin: new Date().toISOString(),
        vpn: isVPN,
        loginCount: 1,
      });
    }

    // Обновляем запись пользователя в базе данных
    await prisma.user.update({
      where: { id: userId },
      data: {
        loginHistory,
      },
    });

    console.log('Login history updated for user:', userId); // Логируем обновление истории
  } catch (error) {
    console.error('Ошибка при обновлении истории входов:', error);
    throw error;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const values = {
          email: credentials.email,
        };

        const findUser = await prisma.user.findFirst({
          where: values,
        });

        if (!findUser) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, findUser.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: findUser.id,
          email: findUser.email,
          name: findUser.fullName,
          role: findUser.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, req }: any) {
      try {
        if (account?.provider === 'credentials') {
          return true;
        }

        if (!user.email) {
          return false;
        }

        let ip = '';
        if (req && req.headers) {
          // Получаем IP-адрес из заголовков запроса
          ip =
              (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
              (req.headers['x-real-ip'] as string) ||
              req.socket?.remoteAddress ||
              'unknown';
        } else {
          // Если req недоступен, используем сторонний сервис для получения IP-адреса
          try {
            const response = await axios.get('https://api.ipify.org?format=json');
            ip = response.data.ip;
          } catch (error) {
            console.error('Ошибка при получении IP-адреса:', error);
            ip = 'unknown';
          }
        }

        console.log('IP-адрес:', ip);

        const isVPN = await checkVPN(ip); // Проверяем VPN
        console.log('Результат проверки VPN:', isVPN); // Логируем результат проверки VPN

        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              { provider: account?.provider, providerId: account?.providerAccountId },
              { email: user.email },
            ],
          },
        });

        if (findUser) {
          // Обновляем историю входов
          await updateLoginHistory(findUser.id, ip, isVPN);

          return true;
        }

        // Если используется VPN, points = 0
        if (isVPN) {
          console.log('Используется VPN. Устанавливаем points = 0');
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              fullName: user.name || 'User #' + user.id,
              password: hashSync(user.id.toString(), 10),
              provider: account?.provider,
              providerId: account?.providerAccountId,
              points: 0, // Устанавливаем points = 0, если используется VPN
              cardId: generateCardId(),
              loginHistory: [
                {
                  ip,
                  lastLogin: new Date().toISOString(),
                  vpn: isVPN,
                  loginCount: 1,
                },
              ],
            },
          });

          return true;
        }

        // Если VPN не используется, проверяем IP в истории входов
        const allUsers = await prisma.user.findMany();

        // Проверяем, был ли такой IP в истории входов
        let ipExists = false;
        for (const user of allUsers) {
          if (user.loginHistory && Array.isArray(user.loginHistory)) {
            const hasIP = user.loginHistory.some((entry: any) => entry.ip === ip);
            if (hasIP) {
              ipExists = true;
              break;
            }
          }
        }

        // Если IP уже был в истории входов, points = 0, иначе points = 1000
        const points = ipExists ? 0 : 1000;
        console.log('IP уже был в истории входов:', ipExists);
        console.log('Устанавливаем points:', points);

        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            fullName: user.name || 'User #' + user.id,
            password: hashSync(user.id.toString(), 10),
            provider: account?.provider,
            providerId: account?.providerAccountId,
            points, // Устанавливаем points
            cardId: generateCardId(),
            loginHistory: [
              {
                ip,
                lastLogin: new Date().toISOString(),
                vpn: isVPN,
                loginCount: 1,
              },
            ],
          },
        });

        return true;
      } catch (error) {
        console.error('Error [SIGNIN]', error);
        return false;
      }
    },
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      const findUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (findUser) {
        token.id = String(findUser.id);
        token.email = findUser.email;
        token.role = findUser.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};



