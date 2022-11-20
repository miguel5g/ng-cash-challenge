import { HttpError } from './http-error';

class UnprocessableEntity extends HttpError {
  constructor(message?: string) {
    super(message || 'Unprocessable', 422);
  }
}

export { UnprocessableEntity };
