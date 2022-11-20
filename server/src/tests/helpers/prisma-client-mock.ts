import { jest } from '@jest/globals';

jest.mock('@prisma/client', () => {
  return {
    __esModule: true,
    Prisma: {
      PrismaClientKnownRequestError: TestPrismaKnowError,
    },
  };
});

class TestPrismaKnowError extends Error {
  code: string;

  constructor(code: string) {
    super();

    this.code = code;
  }
}

export { TestPrismaKnowError };
