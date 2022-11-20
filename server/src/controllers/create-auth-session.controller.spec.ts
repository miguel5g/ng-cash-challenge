import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { z } from 'zod';

import { CreateAuthSessionService } from '../services/create-auth-session.service';
import { TestRequest, TestResponse } from '../tests/helpers/express-mock';
import { CreateAuthSessionController } from './create-auth-session.controller';

describe('controllers/create-auth-session', () => {
  let controller: CreateAuthSessionController;
  let service: CreateAuthSessionService;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    service = { handler: jest.fn() } as any;
    controller = new CreateAuthSessionController(service);
    request = new TestRequest() as any;
    response = new TestResponse() as any;
  });

  it('should have an handler method', () => {
    expect(controller.handler).toBeInstanceOf(Function);
  });

  it('should thrown an error if request body is empty', async () => {
    request.body = {};

    await expect(controller.handler(request, response)).rejects.toBeInstanceOf(z.ZodError);
    expect(service.handler).not.toBeCalled();
  });

  it('should calls service with request body data', async () => {
    const tokenMock = 'token-mock';
    const input = { username: 'test', password: '123456Aa' };
    request.body = input;
    (service.handler as jest.Mock<any>).mockResolvedValue(tokenMock);

    await controller.handler(request, response);

    expect(service.handler).toHaveBeenCalledWith(input);
    expect(response.cookie).toBeCalledTimes(1);
    expect(response.cookie).toBeCalledWith('token', tokenMock, {
      expires: expect.any(Date),
      httpOnly: true,
      path: '/',
      secure: false,
    });
    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(201);
    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ message: 'Successfully authenticated' });
  });
});
