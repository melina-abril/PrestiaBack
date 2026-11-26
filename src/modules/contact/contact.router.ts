import { Router } from 'express';
import { parse } from '../../shared/http/validation.js';
import { contactHoneypotSchema, contactRequestSchema } from './contact.schemas.js';
import { contactService } from './contact.service.js';

export const contactRouter = Router();

/** POST /api/contacto */
contactRouter.post('/', async (req, res) => {
  const { web } = parse(contactHoneypotSchema, req.body);
  if (web?.trim()) {
    res.status(201).json({ received: true });
    return;
  }

  const request = parse(contactRequestSchema, req.body);
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  res.status(201).json(await contactService.create(request, ipAddress));
});
