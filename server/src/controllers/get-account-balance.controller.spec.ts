import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';

import { TestRequest, TestResponse } from '../tests/helpers/express-mock';
import { GetAccountBalanceService } from '../services/get-account-balance.service';
import { GetAccountBalanceController } from './get-account-balance.controller';

describe('controllers/get-account-balance', () => {
  let controller: GetAccountBalanceController;
  let service: GetAccountBalanceService;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    service = { handler: jest.fn() } as any;
    controller = new GetAccountBalanceController(service);
    request = new TestRequest() as any;
    response = new TestResponse() as any;
  });

  it('should have an handler method', () => {
    expect(controller.handler).toBeInstanceOf(Function);
  });

  it('should calls service and calls response.json with balance', async () => {
    expect.assertions(2);

    (service.handler as jest.Mock<any>).mockResolvedValue(10);
    request.user = { id: 'miguel.user' } as any;

    await controller.handler(request, response);

    expect(service.handler).toBeCalledWith('miguel.user');
    expect(response.json).toBeCalledWith({ balance: 10 });
  });
});
