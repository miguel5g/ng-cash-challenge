import { jest } from '@jest/globals';

jest.mock('../../libs/prisma', () => {
  return {
    __esModule: true,
    prisma: {
      user: {
        count: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findUniqueOrThrow: jest.fn(),
      },
      account: {
        update: jest.fn(),
        create: jest.fn(),
      },
      transaction: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      $transaction: jest.fn(),
    },
  };
});
