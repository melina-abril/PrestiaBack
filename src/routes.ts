import { Router } from 'express';
import { blogRouter } from './modules/blog/blog.router.js';
import { contactRouter } from './modules/contact/contact.router.js';
import { loanRequestsRouter } from './modules/loan-requests/loan-requests.router.js';
import { lendersRouter } from './modules/lenders/lenders.router.js';
import { loanTypesRouter } from './modules/loan-types/loan-types.router.js';

export const apiRouter = Router();

apiRouter.use('/articulos', blogRouter);
apiRouter.use('/contacto', contactRouter);
apiRouter.use('/loan-requests', loanRequestsRouter);
apiRouter.use('/lenders', lendersRouter);
apiRouter.use('/loan-types', loanTypesRouter);
