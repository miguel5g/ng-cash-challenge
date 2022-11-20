import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { z } from 'zod';

import { TestRequest, TestResponse } from '../tests/helpers/express-mock';
import { CreateUserService } from '../services/create-user.service';
import { CreateUserController } from './create-user.controller';

describe('controllers/create-user', () => {
  let controller: CreateUserController;
  let service: CreateUserService;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    service = { handler: jest.fn() } as any;
    controller = new CreateUserController(service);
    request = new TestRequest() as any;
    response = new TestResponse() as any;
  });

  it('should have an handler method', () => {
    expect(controller.handler).toBeInstanceOf(Function);
  });

  it('should thrown an error if request body is empty', async () => {
    expect.assertions(2);

    request.body = {};

    try {
      await controller.handler(request, response);
    } catch (error) {
      expect(error).toBeInstanceOf(z.ZodError);
      expect(service.handler).not.toBeCalled();
    }
  });

  it('should calls service and return response', async () => {
    expect.assertions(3);

    const input = { username: 'miguel', password: '123456Aa' };
    request.body = input;

    await controller.handler(request, response);

    expect(service.handler).toBeCalledWith(input);
    expect(response.status).toBeCalledWith(201);
    expect(response.json).toBeCalledWith({ message: 'User successfully created' });
  });
});
