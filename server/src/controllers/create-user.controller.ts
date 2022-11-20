import { Request, Response } from 'express';

import { CreateUserSchema } from '../validators';
import { CreateUserService } from '../services/create-user.service';

class CreateUserController {
  constructor(private service: CreateUserService) {
    this.handler = this.handler.bind(this);
  }

  async handler(request: Request, response: Response) {
    const { username, password } = request.body;

    const input = CreateUserSchema.parse({ username, password });

    await this.service.handler(input);

    response.status(201).json({ message: 'User successfully created' });
  }
}

export { CreateUserController };
