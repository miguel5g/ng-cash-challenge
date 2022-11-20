import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { UnauthorizedError } from '../errors';
import { decode } from '../libs/token';

class ProtectedRouteMiddleware {
  constructor() {
    this.handler = this.handler.bind(this);
  }

  handler(request: Request, _response: Response, next: NextFunction) {
    const { token } = request.cookies;

    if (!token) throw new UnauthorizedError('Invalid token');

    try {
      const payload = decode(token);

      request.user = payload;

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedError('Your token has expired');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError('Your token is invalid');
      }

      throw error;
    }
  }
}

export { ProtectedRouteMiddleware };
