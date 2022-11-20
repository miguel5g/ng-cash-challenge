import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../tests/helpers/prisma-mock';
import { prisma } from '../libs/prisma';
import { GetAllTransactionsService } from './get-all-transactions.service';
import { UnprocessableEntity } from '../errors';

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

describe('services/get-all-transactions', () => {
  let service: GetAllTransactionsService;

  beforeEach(() => {
    service = new GetAllTransactionsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeInstanceOf(Function);
  });

  it('should throw an error if type is not valid', async () => {
    expect.assertions(2);

    try {
      await service.handler('any', 'invalid');
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntity);
      expect((error as UnprocessableEntity).message).toBe('Type must be credit or debit');
    }
  });

  it('should return all transactions', async () => {
    expect.assertions(1);

    (prisma.transaction.findMany as jest.Mock<any>).mockResolvedValue(sampleTransactions);

    const output = await service.handler('miguel.account');

    expect(output).toEqual([
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
    ]);
  });

  it('should return just credit transactions', async () => {
    expect.assertions(1);

    (prisma.transaction.findMany as jest.Mock<any>).mockResolvedValue([sampleTransactions[1]]);

    const output = await service.handler('miguel.account', 'credit');

    expect(output).toEqual([
      {
        id: '2',
        from: 'glimeu',
        to: 'miguel',
        amount: 20,
        type: 'credit',
        createdAt: 'yesterday',
      },
    ]);
  });
});
