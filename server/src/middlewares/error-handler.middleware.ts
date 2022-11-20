import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { HttpError } from '../errors';
import { parserMessage } from '../validators';

class ErrorHandlerMiddleware {
  constructor() {
    this.handler = this.handler.bind(this);
  }

  handler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
    if (error instanceof HttpError) {
      return response.status(error.statusCode).json({ message: error.message });
    }

    if (error instanceof z.ZodError) {
      return response.status(400).json({
        message: 'Invalid request body',
        errors: error.issues.map((issue) => parserMessage(issue as any)),
      });
    }

    return response.status(500).json({ message: 'Internal server error' });
  }
}

export { ErrorHandlerMiddleware };
