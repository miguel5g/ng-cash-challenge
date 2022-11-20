import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { z } from 'zod';

import { TestRequest, TestResponse } from '../tests/helpers/express-mock';
import { DeleteAuthSessionController } from './delete-auth-session.controller';

describe('controllers/create-user', () => {
  const systemTime = new Date();
  let controller: DeleteAuthSessionController;
  let request: Request;
  let response: Response;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(systemTime);
  });

  beforeEach(() => {
    controller = new DeleteAuthSessionController();
    request = new TestRequest() as any;
    response = new TestResponse() as any;
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should have an handler method', () => {
    expect(controller.handler).toBeInstanceOf(Function);
  });

  it('should delete current session token', async () => {
    expect.assertions(3);

    await controller.handler(request, response);

    expect(response.cookie).toBeCalledWith('token', '', {
      path: '/',
      expires: systemTime,
      httpOnly: true,
      secure: false,
    });
    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith({ message: 'Successfully unauthenticated' });
  });
});
