import { Prisma } from '@prisma/client';

import { BadRequestError } from '../errors';
import { hashText } from '../libs/encryption';
import { prisma } from '../libs/prisma';

interface CreateUserInput {
  username: string;
  password: string;
}

class CreateUserService {
  async handler({ username, password }: CreateUserInput) {
    try {
      await prisma.$transaction(async (trx) => {
        const { id } = await trx.account.create({ data: {} });

        await trx.user.create({
          data: { username, password: await hashText(password), account: { connect: { id } } },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestError('Username must be unique');
      }

      throw error;
    }
  }
}

export { CreateUserService };
