import { Prisma } from '@prisma/client';

import { UnprocessableEntity } from '../errors';
import { prisma } from '../libs/prisma';

class GetAllTransactionsService {
  async handler(id: string, type?: string) {
    if (type && !['credit', 'debit'].includes(type))
      throw new UnprocessableEntity('Type must be credit or debit');

    const conditions: Prisma.TransactionWhereInput['OR'] = [];

    if ((type && type === 'credit') || !type) {
      conditions.push({ creditedAccountId: id });
    }

    if ((type && type === 'debit') || !type) {
      conditions.push({ debitedAccountId: id });
    }

    const transactions = await prisma.transaction.findMany({
      where: { OR: conditions },
      include: {
        creditedTo: { select: { owner: { select: { username: true } } } },
        debitedFrom: { select: { owner: { select: { username: true } } } },
      },
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      from: transaction.debitedFrom.owner?.username,
      to: transaction.creditedTo.owner?.username,
      amount: transaction.value,
      type: transaction.creditedAccountId === id ? 'credit' : 'debit',
      createdAt: transaction.createdAt,
    }));
  }
}

export { GetAllTransactionsService };
