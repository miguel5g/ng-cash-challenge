import 'express-async-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { routes } from './routes';
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware';

function appFactory(): express.Express {
  const app = express();
  const errorHandlerMiddleware = new ErrorHandlerMiddleware();

  app.use(cors({ origin: ['http://localhost:3000', 'http://localhost'], credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(routes);
  app.use(errorHandlerMiddleware.handler);

  return app;
}

export { appFactory };
