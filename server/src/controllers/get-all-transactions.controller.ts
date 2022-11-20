import { Request, Response } from 'express';

import { BadRequestError } from '../errors';
import { GetAllTransactionsService } from '../services/get-all-transactions.service';

class GetAllTransactionsController {
  constructor(private service: GetAllTransactionsService) {
    this.handler = this.handler.bind(this);
  }

  async handler(request: Request, response: Response) {
    const { accountId } = request.user;
    const { type } = request.query;

    if (!['string', 'undefined'].includes(typeof type))
      throw new BadRequestError('Invalid request query params');

    const transactions = await this.service.handler(accountId, type as any);

    return response.json({ transactions });
  }
}

export { GetAllTransactionsController };
