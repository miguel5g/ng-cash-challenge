import { Router } from 'express';

import { CreateAuthSessionController } from './controllers/create-auth-session.controller';
import { CreateTransactionController } from './controllers/create-transaction.controller';
import { CreateUserController } from './controllers/create-user.controller';
import { DeleteAuthSessionController } from './controllers/delete-auth-session.controller';
import { GetAccountBalanceController } from './controllers/get-account-balance.controller';
import { GetAllTransactionsController } from './controllers/get-all-transactions.controller';
import { GetUserByIdController } from './controllers/get-user-by-id.controller';
import { ProtectedRouteMiddleware } from './middlewares/protected-route.middleware';
import { CreateAuthSessionService } from './services/create-auth-session.service';
import { CreateTransactionService } from './services/create-transaction.service';
import { CreateUserService } from './services/create-user.service';
import { GetAccountBalanceService } from './services/get-account-balance.service';
import { GetAllTransactionsService } from './services/get-all-transactions.service';
import { GetUserByIdService } from './services/get-user-by-id.service';

const routes = Router();

const createAuthSessionController = new CreateAuthSessionController(new CreateAuthSessionService());
const createTransactionController = new CreateTransactionController(new CreateTransactionService());
const createUserController = new CreateUserController(new CreateUserService());
const deleteAuthSessionController = new DeleteAuthSessionController();
const getAccountBalanceController = new GetAccountBalanceController(new GetAccountBalanceService());
const getTransactionsController = new GetAllTransactionsController(new GetAllTransactionsService());
const getUserByIdController = new GetUserByIdController(new GetUserByIdService());
const protectedRouteMiddleware = new ProtectedRouteMiddleware();

routes.get('/health', (_request, response) => {
  response.status(204).json();
});

routes.post('/users', createUserController.handler);
routes.get('/users/:id', protectedRouteMiddleware.handler, getUserByIdController.handler);

routes.post('/auth', createAuthSessionController.handler);
routes.delete('/auth', protectedRouteMiddleware.handler, deleteAuthSessionController.handler);

routes.get(
  '/account/balance',
  protectedRouteMiddleware.handler,
  getAccountBalanceController.handler
);

routes.post('/transactions', protectedRouteMiddleware.handler, createTransactionController.handler);
routes.get('/transactions', protectedRouteMiddleware.handler, getTransactionsController.handler);

export { routes };
