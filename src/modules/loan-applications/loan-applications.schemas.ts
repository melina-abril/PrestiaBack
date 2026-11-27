import { z } from 'zod';

export const EMPLOYMENT_STATUSES = ['CUENTA_AJENA', 'AUTONOMO', 'PENSIONISTA', 'DESEMPLEADO_PRESTACION', 'OTROS_INGRESOS'] as const;
export const ASNEF_STATUSES = ['NO', 'SI', 'NO_SE'] as const;
export const APPLICATION_STATUSES = ['RECIBIDA', 'OFERTADA', 'SIN_OFERTAS'] as const;

export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];
export type AsnefStatus = (typeof ASNEF_STATUSES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

const validAge = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;
  const today = new Date();
  let age = today.getUTCFullYear() - date.getUTCFullYear();
  const birthdayThisYear = `${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  const todayMonthDay = `${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;
  if (todayMonthDay < birthdayThisYear) age -= 1;
  return age >= 18 && age <= 100;
};

export const applicationRequestSchema = z.object({
  amount: z.number({ error: 'El importe es obligatorio.' }).min(50, 'El importe mínimo es 50 €.').max(2000, 'El importe máximo es 2.000 €.').multipleOf(50, 'Selecciona un importe en pasos de 50 €.'),
  termDays: z.number({ error: 'El plazo es obligatorio.' }).int('El plazo debe ser un número de días.').min(7, 'El plazo mínimo es 7 días.').max(90, 'El plazo máximo es 90 días.'),
  name: z.string({ error: 'El nombre es obligatorio.' }).trim().regex(/^[\p{L} '-]{2,60}$/u, 'El nombre debe tener entre 2 y 60 caracteres y solo letras, espacios, apóstrofos o guiones.'),
  birthDate: z.string({ error: 'La fecha de nacimiento es obligatoria.' }).refine(validAge, 'Debes tener entre 18 y 100 años.'),
  mobile: z.string({ error: 'El móvil es obligatorio.' }).regex(/^[67]\d{8}$/, 'Introduce un móvil español de 9 dígitos.'),
  email: z.email({ error: 'Introduce un correo válido.' }),
  employmentStatus: z.enum(EMPLOYMENT_STATUSES, { error: 'Selecciona una situación laboral válida.' }),
  asnefStatus: z.enum(ASNEF_STATUSES, { error: 'Selecciona una respuesta válida para ASNEF.' }),
  privacyAccepted: z.literal(true, { error: 'Debes aceptar la Política de privacidad y los Términos.' }),
  marketingAccepted: z.boolean().default(false),
});
export type ApplicationRequest = z.output<typeof applicationRequestSchema>;

export const idempotencyHeaderSchema = z.object({
  key: z.string({ error: 'La cabecera Idempotency-Key es obligatoria.' }).trim().min(1, 'La cabecera Idempotency-Key es obligatoria.').max(200, 'La clave de idempotencia es demasiado larga.'),
});

export const applicationIdSchema = z.object({ id: z.string().min(1, 'Indica el identificador de la solicitud.') });
export const clickRequestSchema = z.object({ lenderId: z.string({ error: 'Selecciona una entidad.' }).min(1, 'Selecciona una entidad.') });
export type ClickRequest = z.output<typeof clickRequestSchema>;

export interface ApplicationCreatedResponse {
  id: string;
}

export interface ApplicationOfferResponse {
  lenderId: string;
  name: string;
  initials: string;
  amount: number;
  termDays: number;
  totalNew: number;
  totalReturning: number;
  firstLoanFree: boolean;
  responseMinutes: number;
  bestOffer: boolean;
}

export interface ApplicationOffersResponse {
  status: 'OFERTADA' | 'SIN_OFERTAS';
  offers: ApplicationOfferResponse[];
}

export interface OfferClickResponse {
  url: string;
}
