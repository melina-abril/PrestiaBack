import { z } from 'zod';

export const CONTACT_REASONS = ['DUDA_COMPARADOR', 'DATOS_PERSONALES', 'ENTIDAD', 'OTRO'] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];

export const contactRequestSchema = z.object({
  name: z.string({ error: 'Ingresa tu nombre.' }).trim().min(2, 'Usa al menos 2 caracteres.').max(60, 'Usa hasta 60 caracteres.'),
  email: z.email({ error: 'Ingresa un correo válido.' }).max(254, 'El correo es demasiado largo.'),
  phone: z.union([
    z.literal(''),
    z.string().regex(/^\+?[0-9]{9,15}$/, 'Usa entre 9 y 15 dígitos, con un signo + inicial opcional.'),
  ]).optional(),
  reason: z.enum(CONTACT_REASONS, { error: 'Selecciona un motivo válido.' }),
  message: z.string({ error: 'Ingresa un mensaje.' }).trim().min(20, 'Usa al menos 20 caracteres.').max(1000, 'Usa hasta 1.000 caracteres.'),
  privacyAccepted: z.literal(true, { error: 'Acepta la política de privacidad.' }),
  web: z.string().optional(),
});
export type ContactRequest = z.output<typeof contactRequestSchema>;

/** El campo oculto se comprueba antes de validar el resto del formulario. */
export const contactHoneypotSchema = z.object({ web: z.string().optional() });

export interface ContactResponse {
  accepted: true;
}
