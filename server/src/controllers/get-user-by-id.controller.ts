import { Request, Response } from 'express';
import { UnauthorizedError } from '../errors';
import { GetUserByIdService } from '../services/get-user-by-id.service';

class GetUserByIdController {
  constructor(private service: GetUserByIdService) {
    this.handler = this.handler.bind(this);
  }

  async handler(request: Request, response: Response) {
    const { id } = request.params;

    if (id !== 'me') throw new UnauthorizedError("You are not allowed to view other users's data.");

    const user = await this.service.handler(request.user.id);

    response.json(user);
  }
}

export { GetUserByIdController };
