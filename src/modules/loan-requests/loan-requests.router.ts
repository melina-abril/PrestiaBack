import { Router } from 'express';
import { idParamSchema, parse } from '../../shared/http/validation.js';
import { idempotencyKeySchema, loanRequestSchema, offerClickSchema } from './loan-requests.schemas.js';
import { loanRequestsService } from './loan-requests.service.js';

/** Rutas públicas, montadas bajo /api/loan-requests. */
export const loanRequestsRouter = Router();

loanRequestsRouter.post('/', async (req, res) => {
  const input = parse(loanRequestSchema, req.body);
  const key = parse(idempotencyKeySchema, req.get('Idempotency-Key'));
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const result = await loanRequestsService.create(input, key, ipAddress, req.get('User-Agent') ?? '');
  res.status(201).json(result);
});

loanRequestsRouter.get('/:id/offers', async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await loanRequestsService.getOffers(id));
});

loanRequestsRouter.post('/:id/clicks', async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  const { lenderId } = parse(offerClickSchema, req.body);
  res.json(await loanRequestsService.recordClick(id, lenderId));
});
