import { Request, Response } from 'express';

class DeleteAuthSessionController {
  constructor() {
    this.handler = this.handler.bind(this);
  }

  async handler(_request: Request, response: Response) {
    return response
      .cookie('token', '', {
        path: '/',
        expires: new Date(),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({ message: 'Successfully unauthenticated' });
  }
}

export { DeleteAuthSessionController };
