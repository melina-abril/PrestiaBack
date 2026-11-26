import { Router } from 'express';
import { parse } from '../../shared/http/validation.js';
import { lenderListQuerySchema } from './lenders.schemas.js';
import { lendersService } from './lenders.service.js';

export const lendersRouter = Router();

/** GET /api/lenders; las URL de afiliación no se incluyen en la respuesta. */
lendersRouter.get('/', async (req, res) => {
  res.json(await lendersService.list(parse(lenderListQuerySchema, req.query)));
});
