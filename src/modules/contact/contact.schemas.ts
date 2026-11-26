import { z } from 'zod';

export const CONTACT_REASONS = ['DUDA_COMPARADOR', 'DATOS_PERSONALES', 'ENTIDAD', 'OTRO'] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];

/** Se valida primero para poder descartar el campo antispam sin guardar ni procesar datos personales. */
export const contactHoneypotSchema = z.object({
  web: z.string().optional(),
}).passthrough();

export const contactRequestSchema = z.object({
  nombre: z.string({ error: 'Ingresa tu nombre.' }).trim().min(2, 'Usa al menos 2 caracteres.').max(60, 'Usa hasta 60 caracteres.'),
  correo: z.email({ error: 'Ingresa un correo válido.' }),
  telefono: z.union([
    z.literal(''),
    z.string().regex(/^\+?[0-9]{9,15}$/, 'Ingresa entre 9 y 15 dígitos, con + inicial opcional.'),
  ]).optional(),
  motivo: z.enum(CONTACT_REASONS, { error: 'Selecciona un motivo válido.' }),
  mensaje: z.string({ error: 'Ingresa un mensaje.' }).trim().min(20, 'Usa al menos 20 caracteres.').max(1000, 'Usa hasta 1.000 caracteres.'),
  aceptaPrivacidad: z.literal(true, { error: 'Acepta la política de privacidad.' }),
  web: z.string().optional(),
});
export type ContactRequest = z.output<typeof contactRequestSchema>;

/** La misma respuesta para un envío guardado y uno descartado por el campo antispam. */
export interface ContactResponse {
  received: true;
}
