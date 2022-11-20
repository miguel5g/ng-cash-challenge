import { HttpError } from './http-error';

class BadRequestError extends HttpError {
  constructor(message?: string) {
    super(message || 'Bad request', 400);
  }
}

export { BadRequestError };
