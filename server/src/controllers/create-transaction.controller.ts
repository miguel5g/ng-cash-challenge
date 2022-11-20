import { Request, Response } from 'express';
import { UnprocessableEntity } from '../errors';

import { CreateTransactionService } from '../services/create-transaction.service';
import { CreateTransactionSchema } from '../validators';

class CreateTransactionController {
  constructor(private service: CreateTransactionService) {
    this.handler = this.handler.bind(this);
  }

  async handler(request: Request, response: Response) {
    const { username } = request.user;
    const { to, amount } = request.body;

    if (username === to) throw new UnprocessableEntity("Can't send to yourself");

    const transaction = CreateTransactionSchema.parse({ amount, from: username, to });

    await this.service.handler(transaction);

    response.status(201).json({ message: 'Transaction successfully created' });
  }
}

export { CreateTransactionController };
