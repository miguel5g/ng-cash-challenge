import { HttpError } from './http-error';

class UnauthorizedError extends HttpError {
  constructor(message?: string) {
    super(message || 'Unauthorized', 401);
  }
}

export { UnauthorizedError };
