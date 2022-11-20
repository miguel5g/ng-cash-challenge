import { NotFoundError, UnprocessableEntity } from '../errors';
import { prisma } from '../libs/prisma';

interface CreateTransactionInput {
  amount: number;
  from: string;
  to: string;
}

class CreateTransactionService {
  async handler({ amount, from, to }: CreateTransactionInput) {
    const [sender, recipient] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { username: from },
        select: { account: { select: { id: true, balance: true } } },
      }),
      prisma.user.findUnique({
        where: { username: to },
        select: { account: { select: { id: true, balance: true } } },
      }),
    ]);

    if (!sender) throw new NotFoundError('Sender');

    if (!recipient) throw new NotFoundError('Recipient');

    if (sender.account.balance - amount < 0)
      throw new UnprocessableEntity(`${from} doesn't have enough to send ${amount}`);

    await prisma.$transaction([
      prisma.account.update({
        data: { balance: { decrement: amount } },
        where: { id: sender.account.id },
      }),
      prisma.account.update({
        data: { balance: { increment: amount } },
        where: { id: recipient.account.id },
      }),
      prisma.transaction.create({
        data: {
          value: amount,
          debitedAccountId: sender.account.id,
          creditedAccountId: recipient.account.id,
        },
      }),
    ]);
  }
}

export { CreateTransactionService };
