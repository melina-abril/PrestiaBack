import { Router } from 'express';
import { loanApplicationsRouter } from './modules/loan-applications/loan-applications.router.js';

export const apiRouter = Router();

apiRouter.use('/loan-applications', loanApplicationsRouter);
