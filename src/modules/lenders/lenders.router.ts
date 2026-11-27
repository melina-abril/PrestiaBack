import { Router } from 'express';
import { parse } from '../../shared/http/validation.js';
import { lenderFeaturedQuerySchema, lenderListQuerySchema } from './lenders.schemas.js';
import { lendersService } from './lenders.service.js';

export const lendersRouter = Router();

/** GET /api/lenders; featured=true ignora los demás parámetros. */
lendersRouter.get('/', async (req, res) => {
  const { featured } = parse(lenderFeaturedQuerySchema, req.query);
  if (featured === 'true') {
    res.json(await lendersService.list({ page: 0, size: 3, order: 'recommended', featured: true }));
    return;
  }
  res.json(await lendersService.list(parse(lenderListQuerySchema, req.query)));
});
