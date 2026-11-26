import { Router } from 'express';
import { loanRequestsRouter } from './modules/loan-requests/loan-requests.router.js';
import { lendersRouter } from './modules/lenders/lenders.router.js';
import { loanTypesRouter } from './modules/loan-types/loan-types.router.js';

export const apiRouter = Router();

apiRouter.use('/loan-requests', loanRequestsRouter);
apiRouter.use('/lenders', lendersRouter);
apiRouter.use('/loan-types', loanTypesRouter);
