import { envText } from '../../config/env.js';
import { newId } from '../../shared/db/db-utils.js';
import { contactRepository } from './contact.repository.js';
import type { ContactRequest, ContactResponse } from './contact.schemas.js';

/**
 * Aviso externo pendiente de integrar con un transporte de correo. El paquete fijo no
 * incluye un cliente de correo; no se comunica al visitante que se haya enviado.
 */
const notifyAttentionTeam = (request: ContactRequest): void => {
  const inbox = envText('CONTACT_INBOX', '');
  if (!inbox) {
    console.warn('Mensaje de contacto guardado; CONTACT_INBOX no está configurada.');
    return;
  }
  console.warn(`Mensaje de contacto guardado; aviso por correo pendiente de integración para ${inbox}. Asunto: [Contacto] ${request.reason} · ${request.name}`);
};

export const contactService = {
  async create(request: ContactRequest, ip: string): Promise<ContactResponse> {
    await contactRepository.insertWithinHourlyLimit(newId(), {
      name: request.name,
      email: request.email,
      phone: request.phone || null,
      reason: request.reason,
      message: request.message,
      privacyAccepted: true,
      ip,
      status: 'NUEVO',
    });

    try {
      notifyAttentionTeam(request);
    } catch (error: unknown) {
      console.error('No se pudo preparar el aviso del mensaje de contacto.', error);
    }
    return { accepted: true };
  },
};
