import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import '../tests/helpers/token-mock';
import * as token from '../libs/token';
import { UnauthorizedError } from '../errors';
import { TestRequest, TestResponse } from '../tests/helpers/express-mock';
import { ProtectedRouteMiddleware } from './protected-route.middleware';

describe('middlewares/protected-route', () => {
  let middleware: ProtectedRouteMiddleware;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    middleware = new ProtectedRouteMiddleware();
    request = new TestRequest() as any;
    response = new TestResponse() as any;
  });

  it('should have an handler method', () => {
    expect(middleware.handler).toBeInstanceOf(Function);
  });

  it('should throw unauthorized error if token is not received', async () => {
    expect.assertions(1);

    try {
      middleware.handler(request, response, jest.fn());
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }
  });

  it('should throw unauthorized error when token is expired', async () => {
    expect.assertions(2);

    const mockToken = 'mock-token';
    request.cookies.token = mockToken;
    (token.decode as jest.Mock).mockImplementation(() => {
      throw new TokenExpiredError('Test', new Date(Date.now() - 1));
    });

    try {
      middleware.handler(request, response, jest.fn());
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }

    expect(token.decode).toBeCalledWith(mockToken);
  });

  it('should throw unauthorized error when token is invalid', async () => {
    expect.assertions(2);

    const mockToken = 'mock-token';
    request.cookies.token = mockToken;
    (token.decode as jest.Mock).mockImplementation(() => {
      throw new JsonWebTokenError('Invalid token');
    });

    try {
      middleware.handler(request, response, jest.fn());
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }

    expect(token.decode).toBeCalledWith(mockToken);
  });

  it('should throw default error when error is unknown', async () => {
    expect.assertions(2);

    const mockToken = 'mock-token';
    const initialError = new Error('Unknown error');
    request.cookies.token = mockToken;
    (token.decode as jest.Mock).mockImplementation(() => {
      throw initialError;
    });

    try {
      middleware.handler(request, response, jest.fn());
    } catch (error) {
      expect(error).toBe(initialError);
    }

    expect(token.decode).toBeCalledWith(mockToken);
  });
});
