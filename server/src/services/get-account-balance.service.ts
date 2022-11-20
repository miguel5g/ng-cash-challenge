import { NotFoundError } from '../errors';
import { prisma } from '../libs/prisma';

class GetAccountBalanceService {
  async handler(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        account: { select: { balance: true } },
      },
    });

    if (!user) throw new NotFoundError('User');

    return user.account.balance;
  }
}

export { GetAccountBalanceService };
