import { Router } from 'express';
import { idParamSchema, parse } from '../../shared/http/validation.js';
import { idempotencyKeySchema, loanApplicationRequestSchema } from './loan-applications.schemas.js';
import { loanApplicationsService } from './loan-applications.service.js';

/** Rutas públicas; src/routes.ts monta este router bajo /loan-applications. */
export const loanApplicationsRouter = Router();

loanApplicationsRouter.post('/', async (req, res) => {
  const key = parse(idempotencyKeySchema, req.get('Idempotency-Key'));
  const request = parse(loanApplicationRequestSchema, req.body);
  const sourceIp = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const result = await loanApplicationsService.create(request, key, sourceIp);
  res.status(result.created ? 201 : 200).json(result.response);
});

loanApplicationsRouter.get('/:id/offers', async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await loanApplicationsService.getOffers(id));
});
