import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';

import { TestRequest, TestResponse } from '../tests/helpers/express-mock';
import { GetUserByIdService } from '../services/get-user-by-id.service';
import { GetUserByIdController } from './get-user-by-id.controller';
import { UnauthorizedError } from '../errors';

describe('controllers/get-user-by-id', () => {
  let controller: GetUserByIdController;
  let service: GetUserByIdService;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    service = { handler: jest.fn() } as any;
    controller = new GetUserByIdController(service);
    request = new TestRequest() as any;
    response = new TestResponse() as any;
  });

  it('should have an handler method', () => {
    expect(controller.handler).toBeInstanceOf(Function);
  });

  it('should throw unauthorized error if trying to find another user', async () => {
    expect.assertions(3);

    request.params = { id: 'miguel' };

    try {
      await controller.handler(request, response);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect((error as UnauthorizedError).message).toBe(
        "You are not allowed to view other users's data."
      );
      expect(service.handler).not.toBeCalled();
    }
  });

  it('should calls service and return user data', async () => {
    expect.assertions(2);

    request.user = { id: 'miguel' } as any;
    request.params = { id: 'me' };
    (service.handler as jest.Mock<any>).mockResolvedValue('user');

    await controller.handler(request, response);

    expect(service.handler).toBeCalledWith('miguel');
    expect(response.json).toBeCalledWith('user');
  });
});
