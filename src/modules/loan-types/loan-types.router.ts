import { Router } from 'express';
import { parse } from '../../shared/http/validation.js';
import { loanTypeSlugSchema } from './loan-types.schemas.js';
import { loanTypesService } from './loan-types.service.js';

export const loanTypesRouter = Router();

/** GET /api/loan-types */
loanTypesRouter.get('/', async (_req, res) => {
  res.json(await loanTypesService.list());
});

/** GET /api/loan-types/:slug */
loanTypesRouter.get('/:slug', async (req, res) => {
  const { slug } = parse(loanTypeSlugSchema, req.params);
  res.json(await loanTypesService.get(slug));
});
