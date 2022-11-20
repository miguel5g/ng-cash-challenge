import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';

import { TestRequest, TestResponse } from '../tests/helpers/express-mock';
import { GetAllTransactionsService } from '../services/get-all-transactions.service';
import { GetAllTransactionsController } from './get-all-transactions.controller';
import { BadRequestError } from '../errors';

describe('controllers/get-all-transactions', () => {
  let controller: GetAllTransactionsController;
  let service: GetAllTransactionsService;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    service = { handler: jest.fn() } as any;
    controller = new GetAllTransactionsController(service);
    request = new TestRequest() as any;
    response = new TestResponse() as any;
  });

  it('should have an handler method', () => {
    expect(controller.handler).toBeInstanceOf(Function);
  });

  it('should throw bad request error if type is invalid', async () => {
    expect.assertions(3);

    request.query = { type: ['credit', 'debit'] };

    try {
      await controller.handler(request, response);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect((error as BadRequestError).message).toBe('Invalid request query params');
      expect(service.handler).not.toBeCalled();
    }
  });

  it('should throw bad request error if type is invalid', async () => {
    expect.assertions(2);

    request.user = { accountId: 'miguel.account' } as any;
    request.query = { type: 'credit' };
    (service.handler as jest.Mock<any>).mockResolvedValue('transactions');

    await controller.handler(request, response);

    expect(service.handler).toBeCalledWith('miguel.account', 'credit');
    expect(response.json).toBeCalledWith({ transactions: 'transactions' });
  });
});
