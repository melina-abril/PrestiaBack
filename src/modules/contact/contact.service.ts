import { newId } from '../../shared/db/db-utils.js';
import { HttpError } from '../../shared/errors/http-errors.js';
import { contactRepository } from './contact.repository.js';
import type { ContactRequest, ContactResponse } from './contact.schemas.js';

const HOURLY_LIMIT = 3;
const ONE_HOUR_MS = 60 * 60 * 1000;

/** La arquitectura no incluye un transporte de correo ni configuración SMTP. */
async function notifyContactTeam(_request: ContactRequest): Promise<void> {
  // Sustituir por el proveedor de correo configurado antes de habilitar notificaciones.
  console.warn('El mensaje de contacto se guardó, pero el aviso por correo no está configurado.');
}

export const contactService = {
  async create(request: ContactRequest, ipAddress: string): Promise<ContactResponse> {
    const recent = await contactRepository.countRecentByIp(ipAddress, Date.now() - ONE_HOUR_MS);
    if (recent >= HOURLY_LIMIT) {
      throw new HttpError(429, 'Has alcanzado el límite de tres mensajes por hora. Inténtalo más tarde.');
    }

    await contactRepository.insert(newId(), {
      name: request.nombre,
      email: request.correo,
      phone: request.telefono || null,
      reason: request.motivo,
      message: request.mensaje,
      acceptsPrivacy: true,
      ipAddress,
      status: 'NUEVO',
    });

    try {
      await notifyContactTeam(request);
    } catch (error: unknown) {
      console.error('No se pudo avisar al equipo del mensaje de contacto.', error);
    }
    return { received: true };
  },
};
