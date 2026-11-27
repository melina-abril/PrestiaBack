import { Router } from 'express';
import { parse } from '../../shared/http/validation.js';
import { applicationIdSchema, applicationRequestSchema, clickRequestSchema, idempotencyHeaderSchema } from './loan-applications.schemas.js';
import { loanApplicationsService } from './loan-applications.service.js';

export const loanApplicationsRouter = Router();

/** POST /api/applications */
loanApplicationsRouter.post('/', async (req, res) => {
  const request = parse(applicationRequestSchema, req.body);
  const { key } = parse(idempotencyHeaderSchema, { key: req.get('Idempotency-Key') });
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const userAgent = req.get('User-Agent') ?? '';
  res.status(201).json(await loanApplicationsService.create(request, key, ipAddress, userAgent));
});

/** GET /api/applications/:id/offers */
loanApplicationsRouter.get('/:id/offers', async (req, res) => {
  const { id } = parse(applicationIdSchema, req.params);
  res.json(await loanApplicationsService.getOffers(id));
});

/** POST /api/applications/:id/clicks */
loanApplicationsRouter.post('/:id/clicks', async (req, res) => {
  const { id } = parse(applicationIdSchema, req.params);
  const { lenderId } = parse(clickRequestSchema, req.body);
  res.json(await loanApplicationsService.recordClick(id, lenderId));
});
