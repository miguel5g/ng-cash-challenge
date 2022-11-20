import { afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';

import '../tests/helpers/encryption-mock';
import '../tests/helpers/prisma-mock';
import '../tests/helpers/token-mock';
import * as encrypt from '../libs/encryption';
import * as token from '../libs/token';
import { prisma } from '../libs/prisma';
import { CreateAuthSessionService } from './create-auth-session.service';
import { NotFoundError, UnauthorizedError } from '../errors';

const sampleUser = {
  id: 'id',
  username: 'username',
  password: 'password',
  account: { id: 'account id' },
};

describe('services/create-auth-session', () => {
  let credentials: { username: string; password: string };
  let service: CreateAuthSessionService;

  beforeEach(() => {
    credentials = { username: 'test', password: '132456Aa' };
    service = new CreateAuthSessionService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a handler method', () => {
    expect(service.handler).toBeInstanceOf(Function);
  });

  it('should calls prisma.user.findUnique and return not found error if user does not exist', async () => {
    expect.assertions(2);

    (encrypt.compareText as jest.Mock<any>).mockResolvedValue(true);
    (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(null);

    try {
      await service.handler(credentials);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(prisma.user.findUnique).toBeCalledTimes(1);
    }
  });

  it('should call the method compare text with the values passed', async () => {
    expect.assertions(2);

    (encrypt.compareText as jest.Mock<any>).mockResolvedValue(false);
    (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(sampleUser);

    try {
      await service.handler(credentials);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(encrypt.compareText).toBeCalledTimes(1);
    }
  });

  it('should return a token with user id and permissions inside the payload', async () => {
    const mockToken = 'token';

    (encrypt.compareText as jest.Mock<any>).mockResolvedValue(true);
    (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(sampleUser);
    (token.encode as jest.Mock<any>).mockResolvedValue(mockToken);

    const output = await service.handler(credentials);

    expect(token.encode).toBeCalledTimes(1);
    expect(token.encode).toBeCalledWith({ id: sampleUser.id, username: sampleUser.username, accountId: sampleUser.account.id });
    expect(output).toBe(mockToken);
  });
});
