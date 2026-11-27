import { Router } from 'express';
import { lendersRouter } from './modules/lenders/lenders.router.js';
import { loanApplicationsRouter } from './modules/loan-applications/loan-applications.router.js';
import { loanTypesRouter } from './modules/loan-types/loan-types.router.js';

export const apiRouter = Router();

apiRouter.use('/lenders', lendersRouter);
apiRouter.use('/applications', loanApplicationsRouter);
apiRouter.use('/loan-types', loanTypesRouter);
