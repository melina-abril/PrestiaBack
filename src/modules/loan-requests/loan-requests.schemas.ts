import { z } from 'zod';

export const EMPLOYMENT_STATUSES = ['CUENTA_AJENA', 'AUTONOMO', 'PENSIONISTA', 'DESEMPLEADO_PRESTACION', 'OTROS_INGRESOS'] as const;
export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

export const ASNEF_ANSWERS = ['NO', 'SI', 'NO_SE'] as const;
export type AsnefAnswer = (typeof ASNEF_ANSWERS)[number];

export const LOAN_REQUEST_STATUSES = ['RECIBIDA', 'OFERTADA', 'SIN_OFERTAS'] as const;
export type LoanRequestStatus = (typeof LOAN_REQUEST_STATUSES)[number];

export const loanRequestSchema = z.object({
  amount: z.number({ error: 'El importe es obligatorio.' })
    .min(50, 'El importe debe ser de al menos 50 €.')
    .max(2000, 'El importe no puede superar 2.000 €.')
    .refine((value) => value % 50 === 0, 'Selecciona un importe en pasos de 50 €.'),
  termDays: z.number({ error: 'El plazo es obligatorio.' }).int('El plazo debe ser un número entero.')
    .min(7, 'El plazo mínimo es de 7 días.').max(90, 'El plazo máximo es de 90 días.'),
  name: z.string({ error: 'El nombre es obligatorio.' }).trim()
    .regex(/^[\p{L} '-]{2,60}$/u, 'El nombre debe tener entre 2 y 60 caracteres y solo letras, espacios, apóstrofos o guiones.'),
  birthDate: z.string({ error: 'La fecha de nacimiento es obligatoria.' })
    .refine((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const date = new Date(`${value}T00:00:00Z`);
      if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;
      const today = new Date();
      const years = today.getUTCFullYear() - date.getUTCFullYear()
        - (today.getUTCMonth() < date.getUTCMonth()
          || (today.getUTCMonth() === date.getUTCMonth() && today.getUTCDate() < date.getUTCDate()) ? 1 : 0);
      return years >= 18 && years <= 100;
    }, 'Debes tener entre 18 y 100 años.'),
  mobile: z.string({ error: 'El móvil es obligatorio.' }).regex(/^[67]\d{8}$/, 'Introduce un móvil español de 9 dígitos.'),
  email: z.email({ error: 'Introduce un correo válido.' }).trim().toLowerCase(),
  employmentStatus: z.enum(EMPLOYMENT_STATUSES, { error: 'Selecciona tu situación laboral.' }),
  asnef: z.enum(ASNEF_ANSWERS, { error: 'Selecciona una respuesta para ASNEF.' }),
  acceptsPrivacy: z.literal(true, { error: 'Debes aceptar la Política de privacidad y los Términos.' }),
  acceptsCommunications: z.boolean().default(false),
});
export type LoanRequestInput = z.output<typeof loanRequestSchema>;

export const idempotencyKeySchema = z.string({ error: 'La cabecera Idempotency-Key es obligatoria.' })
  .min(8, 'La clave de idempotencia es demasiado corta.')
  .max(200, 'La clave de idempotencia es demasiado larga.')
  .regex(/^[A-Za-z0-9_-]+$/, 'La clave de idempotencia contiene caracteres inválidos.');

export const offerClickSchema = z.object({ lenderId: z.string({ error: 'Selecciona una entidad.' }).min(1, 'Selecciona una entidad.') });
export type OfferClickInput = z.output<typeof offerClickSchema>;

export interface LoanRequestCreatedResponse {
  id: string;
  status: LoanRequestStatus;
}

export interface LoanOfferResponse {
  lenderId: string;
  name: string;
  acronym: string;
  amount: number;
  termDays: number;
  totalNew: number;
  totalReturning: number;
  firstLoanFree: boolean;
  responseMinutes: number;
  bestOffer: boolean;
}

export interface OfferClickResponse {
  url: string;
}
