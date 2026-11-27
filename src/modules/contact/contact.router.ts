import { Router } from 'express';
import { parse } from '../../shared/http/validation.js';
import { contactHoneypotSchema, contactRequestSchema } from './contact.schemas.js';
import { contactService } from './contact.service.js';

/** El router se monta en /api/contacto. No requiere sesión. */
export const contactRouter = Router();

contactRouter.post('/', async (req, res) => {
  const honeypot = parse(contactHoneypotSchema, req.body);
  if (honeypot.web?.trim()) {
    res.status(201).json({ accepted: true });
    return;
  }

  const request = parse(contactRequestSchema, req.body);
  const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  res.status(201).json(await contactService.create(request, ip));
});
