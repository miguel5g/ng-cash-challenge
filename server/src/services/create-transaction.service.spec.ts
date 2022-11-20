import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../tests/helpers/prisma-mock';
import { prisma } from '../libs/prisma';
import { CreateTransactionService } from './create-transaction.service';
import { NotFoundError, UnauthorizedError, UnprocessableEntity } from '../errors';

describe('services/create-auth-session', () => {
  const userFrom = { id: 'id.user.1', account: { id: 'id.account.1', balance: 10 } };
  const userTo = { id: 'id.user.2', account: { id: 'id.account.2', balance: 10 } };
  let transaction: { amount: number; from: string; to: string };
  let service: CreateTransactionService;

  beforeEach(() => {
    transaction = { amount: 10, from: 'miguel', to: 'glimeu' };
    service = new CreateTransactionService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeInstanceOf(Function);
  });

  it('should throw an error if sender is not found', async () => {
    expect.assertions(4);

    (prisma.$transaction as jest.Mock<any>).mockResolvedValue([null, userTo]);

    try {
      await service.handler(transaction);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect((error as NotFoundError).message).toBe('Sender not found');
      expect(prisma.user.findUnique).toBeCalledTimes(2);
      expect(prisma.$transaction).toBeCalledTimes(1);
    }
  });

  it('should throw an error if recipient is not found', async () => {
    expect.assertions(4);

    (prisma.$transaction as jest.Mock<any>).mockResolvedValue([userFrom, null]);

    try {
      await service.handler(transaction);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect((error as NotFoundError).message).toBe('Recipient not found');
      expect(prisma.user.findUnique).toBeCalledTimes(2);
      expect(prisma.$transaction).toBeCalledTimes(1);
    }
  });

  it('should throw an error if sender does not have enough money', async () => {
    expect.assertions(4);

    (prisma.$transaction as jest.Mock<any>).mockResolvedValue([userFrom, userTo]);

    try {
      await service.handler({ ...transaction, amount: 100 });
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntity);
      expect((error as UnprocessableEntity).message).toBe("miguel doesn't have enough to send 100");
      expect(prisma.user.findUnique).toBeCalledTimes(2);
      expect(prisma.$transaction).toBeCalledTimes(1);
    }
  });

  it('should throw an error if sender does not have enough money', async () => {
    expect.assertions(4);

    (prisma.$transaction as jest.Mock<any>).mockResolvedValue([userFrom, userTo]);

    await service.handler(transaction);

    expect(prisma.user.findUnique).toBeCalledTimes(2);
    expect(prisma.account.update).toBeCalledTimes(2);
    expect(prisma.transaction.create).toBeCalledTimes(1);
    expect(prisma.$transaction).toBeCalledTimes(2);
  });
});
