import { Request, Response } from 'express';

import { GetAccountBalanceService } from '../services/get-account-balance.service';

class GetAccountBalanceController {
  constructor(private service: GetAccountBalanceService) {
    this.handler = this.handler.bind(this);
  }

  async handler(request: Request, response: Response) {
    const { id } = request.user;

    const balance = await this.service.handler(id);

    response.json({ balance });
  }
}

export { GetAccountBalanceController };
