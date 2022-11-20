import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { z } from 'zod';

import { UnprocessableEntity } from '../errors';
import { CreateTransactionService } from '../services/create-transaction.service';
import { TestRequest, TestResponse } from '../tests/helpers/express-mock';
import { CreateTransactionController } from './create-transaction.controller';

describe('controllers/create-auth-session', () => {
  let controller: CreateTransactionController;
  let service: CreateTransactionService;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    service = { handler: jest.fn() } as any;
    controller = new CreateTransactionController(service);
    request = new TestRequest() as any;
    response = new TestResponse() as any;
  });

  it('should have an handler method', () => {
    expect(controller.handler).toBeInstanceOf(Function);
  });

  it('should thrown an error if request body is empty', async () => {
    request.user = { username: 'miguel' } as any;
    request.body = {};

    await expect(controller.handler(request, response)).rejects.toBeInstanceOf(z.ZodError);
    expect(service.handler).not.toBeCalled();
  });

  it('should thrown an error if is trying send money to yourself', async () => {
    expect.assertions(3);

    request.user = { username: 'miguel' } as any;
    request.body = { amount: 10, to: 'miguel' };

    try {
      await controller.handler(request, response);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntity);
      expect((error as UnprocessableEntity).message).toBe("Can't send to yourself");
      expect(service.handler).not.toBeCalled();
    }
  });

  it('should calls service with request body data', async () => {
    const input = { amount: 10, to: 'glimeu' };
    request.user = { username: 'miguel' } as any;
    request.body = input;
    (service.handler as jest.Mock<any>).mockResolvedValue(undefined);

    await controller.handler(request, response);

    expect(service.handler).toHaveBeenCalledWith({ ...input, from: 'miguel' });
    expect(response.status).toBeCalledTimes(1);
    expect(response.status).toBeCalledWith(201);
    expect(response.json).toBeCalledTimes(1);
    expect(response.json).toBeCalledWith({ message: 'Transaction successfully created' });
  });
});
