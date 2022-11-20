import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../tests/helpers/prisma-mock';
import { prisma } from '../libs/prisma';
import { GetAccountBalanceService } from './get-account-balance.service';
import { NotFoundError } from '../errors';

describe('services/get-account-balance', () => {
  let service: GetAccountBalanceService;

  beforeEach(() => {
    service = new GetAccountBalanceService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeInstanceOf(Function);
  });

  it('should throw an error if username not exists', async () => {
    expect.assertions(2);

    (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(null);

    try {
      await service.handler('any');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect((error as NotFoundError).message).toBe('User not found');
    }
  });

  it('should return account balance', async () => {
    expect.assertions(1);
    const user = { account: { balance: 10 } };

    (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(user);

    const output = await service.handler('any');

    expect(output).toBe(user.account.balance);
  });
});
