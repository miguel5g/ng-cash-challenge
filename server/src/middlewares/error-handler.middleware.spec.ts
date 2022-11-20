import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';

import { ErrorHandlerMiddleware } from './error-handler.middleware';
import { TestRequest, TestResponse } from '../tests/helpers/express-mock';
import { NotFoundError } from '../errors';
import { ZodError } from 'zod';

describe('middlewares/error-handler', () => {
  let middleware: ErrorHandlerMiddleware;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    middleware = new ErrorHandlerMiddleware();
    request = new TestRequest() as any;
    response = new TestResponse() as any;
  });

  it('should have an handler method', () => {
    expect(middleware.handler).toBeInstanceOf(Function);
  });

  it('should return internal server error if is an unknown error', async () => {
    middleware.handler({ message: 'unknown' }, request, response, jest.fn());

    expect(response.status).toBeCalledWith(500);
    expect(response.json).toBeCalledWith({ message: 'Internal server error' });
  });

  it('should return custom status and message if is instance of http error', async () => {
    middleware.handler(new NotFoundError('Test'), request, response, jest.fn());

    expect(response.status).toBeCalledWith(404);
    expect(response.json).toBeCalledWith({ message: 'Test not found' });
  });

  it('should return custom status and message if is instance of http error', async () => {
    middleware.handler(new ZodError([]), request, response, jest.fn());

    expect(response.status).toBeCalledWith(400);
    expect(response.json).toBeCalledWith({ message: 'Invalid request body', errors: [] });
  });
});
