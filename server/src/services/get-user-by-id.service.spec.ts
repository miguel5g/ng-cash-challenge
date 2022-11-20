import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../tests/helpers/prisma-mock';
import { prisma } from '../libs/prisma';
import { TestPrismaKnowError } from '../tests/helpers/prisma-client-mock';
import { GetUserByIdService } from './get-user-by-id.service';
import { NotFoundError } from '../errors';

const sampleTransactions = [
  {
    id: '1',
    value: 10,
    createdAt: 'today',
    creditedAccountId: 'glimeu.account',
    debitedFrom: { owner: { username: 'miguel' } },
    creditedTo: { owner: { username: 'glimeu' } },
  },
  {
    id: '2',
    value: 20,
    createdAt: 'yesterday',
    creditedAccountId: 'miguel.account',
    debitedFrom: { owner: { username: 'glimeu' } },
    creditedTo: { owner: { username: 'miguel' } },
  },
];

describe('services/get-user-by-id', () => {
  let service: GetUserByIdService;

  beforeEach(() => {
    service = new GetUserByIdService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeInstanceOf(Function);
  });

  it('should throw an error if user not found', async () => {
    expect.assertions(2);

    (prisma.user.findUniqueOrThrow as jest.Mock<any>).mockRejectedValue(
      new TestPrismaKnowError('P2001')
    );

    try {
      await service.handler('any');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect((error as NotFoundError).message).toBe('User not found');
    }
  });

  it('should throw the original error if it is not a not found error', async () => {
    expect.assertions(1);

    const originalError = new Error('Any other error');

    (prisma.user.findUniqueOrThrow as jest.Mock<any>).mockRejectedValue(originalError);

    try {
      await service.handler('any');
    } catch (error) {
      expect(error).toBe(originalError);
    }
  });

  it('should return user data', async () => {
    expect.assertions(1);

    (prisma.user.findUniqueOrThrow as jest.Mock<any>).mockResolvedValue({
      id: 'miguel.user',
      username: 'miguel',
      account: { id: 'miguel.account', balance: 10 },
    });
    (prisma.transaction.findMany as jest.Mock<any>).mockResolvedValue(sampleTransactions);

    const output = await service.handler('miguel.user');

    expect(output).toEqual({
      id: 'miguel.user',
      username: 'miguel',
      balance: 10,
      transactions: [
        {
          id: '1',
          from: 'miguel',
          to: 'glimeu',
          amount: 10,
          type: 'debit',
          createdAt: 'today',
        },
        {
          id: '2',
          from: 'glimeu',
          to: 'miguel',
          amount: 20,
          type: 'credit',
          createdAt: 'yesterday',
        },
      ],
    });
  });
});
