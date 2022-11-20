import { Prisma } from '@prisma/client';
import { NotFoundError } from '../errors';
import { prisma } from '../libs/prisma';

class GetUserByIdService {
  async handler(id: string) {
    try {
      const { account, ...user } = await prisma.user.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          username: true,
          account: { select: { balance: true, id: true } },
        },
      });

      const transactions = await prisma.transaction.findMany({
        where: { OR: [{ creditedAccountId: account.id }, { debitedAccountId: account.id }] },
        include: {
          creditedTo: { select: { owner: { select: { username: true } } } },
          debitedFrom: { select: { owner: { select: { username: true } } } },
        },
      });

      return {
        ...user,
        balance: account.balance,
        transactions: transactions.map((transaction) => ({
          id: transaction.id,
          from: transaction.debitedFrom.owner?.username,
          to: transaction.creditedTo.owner?.username,
          amount: transaction.value,
          type: transaction.creditedAccountId === account.id ? 'credit' : 'debit',
          createdAt: transaction.createdAt,
        })),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2001') {
        throw new NotFoundError('User');
      }

      throw error;
    }
  }
}

export { GetUserByIdService };
