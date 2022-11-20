import { HttpError } from './http-error';

class NotFoundError extends HttpError {
  constructor(resource?: string) {
    super(`${resource} not found`, 404);
  }
}

export { NotFoundError };
