import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../tests/helpers/encryption-mock';
import '../tests/helpers/prisma-mock';
import { TestPrismaKnowError } from '../tests/helpers/prisma-client-mock';
import { prisma } from '../libs/prisma';
import { CreateUserService } from './create-user.service';
import { BadRequestError } from '../errors';

describe('services/create-user', () => {
  let sampleUser: { username: string; password: string };
  let service: CreateUserService;

  beforeEach(() => {
    sampleUser = { username: 'miguel', password: '123456Aa' };
    service = new CreateUserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeInstanceOf(Function);
  });

  it('should throw an error if username already exists', async () => {
    expect.assertions(2);

    (prisma.$transaction as jest.Mock<any>).mockImplementation((cb: Function) => cb(prisma));
    (prisma.account.create as jest.Mock<any>).mockResolvedValue({ id: 'account id' });
    (prisma.user.create as jest.Mock<any>).mockRejectedValue(new TestPrismaKnowError('P2002'));

    try {
      await service.handler(sampleUser);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect((error as BadRequestError).message).toBe('Username must be unique');
    }
  });

  it('should throw the original error it is not unique constraint error', async () => {
    expect.assertions(4);
    const originalError = new Error('Test error');

    (prisma.$transaction as jest.Mock<any>).mockImplementation((cb: Function) => cb(prisma));
    (prisma.account.create as jest.Mock<any>).mockRejectedValue(originalError);

    try {
      await service.handler(sampleUser);
    } catch (error) {
      expect(error).toEqual(originalError);
      expect(prisma.$transaction).toBeCalledTimes(1);
      expect(prisma.account.create).toBeCalledTimes(1);
      expect(prisma.user.create).not.toBeCalled();
    }
  });

  it('should create user and account', async () => {
    expect.assertions(3);

    (prisma.$transaction as jest.Mock<any>).mockImplementation((cb: Function) => cb(prisma));
    (prisma.account.create as jest.Mock<any>).mockResolvedValue({ id: 'account id' });
    (prisma.user.create as jest.Mock<any>).mockResolvedValue(null);

    await service.handler(sampleUser);

    expect(prisma.$transaction).toBeCalledTimes(1);
    expect(prisma.account.create).toBeCalledTimes(1);
    expect(prisma.user.create).toBeCalledTimes(1);
  });
});
