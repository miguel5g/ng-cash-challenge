import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const client = new PrismaClient();

(async () => {
  await client.account.upsert({
    where: {
      id: 'jane.account',
    },
    update: {},
    create: {
      id: 'jane.account',
      owner: {
        create: {
          id: 'jane.user',
          username: 'jane',
          password: bcrypt.hashSync('123456Aa', +process.env.SALT_ROUNDS),
        },
      },
    },
  });

  await client.account.upsert({
    where: {
      id: 'john.account',
    },
    update: {},
    create: {
      id: 'john.account',
      owner: {
        create: {
          id: 'john.user',
          username: 'john',
          password: bcrypt.hashSync('123456Aa', +process.env.SALT_ROUNDS),
        },
      },
    },
  });
})();
