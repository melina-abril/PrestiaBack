import { z } from 'zod';
import { pageQuerySchema } from '../../shared/http/page.js';

export const LENDER_ORDERS = ['recommended', 'total', 'maxAmount', 'response'] as const;
export type LenderOrder = (typeof LENDER_ORDERS)[number];

const booleanQuerySchema = z.enum(['true', 'false'], { error: 'Usa true o false.' }).transform((value) => value === 'true');

/** Se valida por separado para que featured=true ignore los demás filtros. */
export const lenderFeaturedQuerySchema = z.object({
  featured: z.enum(['true', 'false'], { error: 'Usa true o false.' }).optional(),
});

export const lenderListQuerySchema = pageQuerySchema.extend({
  amount: z.coerce.number({ error: 'Ingresa un importe válido.' }).min(50, 'El importe debe estar entre 50 € y 2.000 €.').max(2000, 'El importe debe estar entre 50 € y 2.000 €.').optional(),
  termDays: z.coerce.number({ error: 'Ingresa un plazo válido.' }).int('El plazo debe ser un número entero.').min(7, 'El plazo debe estar entre 7 y 90 días.').max(90, 'El plazo debe estar entre 7 y 90 días.').optional(),
  age: z.coerce.number({ error: 'Ingresa una edad válida.' }).int('La edad debe ser un número entero.').min(18, 'La edad debe estar entre 18 y 100 años.').max(100, 'La edad debe estar entre 18 y 100 años.').optional(),
  firstLoanFree: booleanQuerySchema.optional(),
  acceptsAsnef: booleanQuerySchema.optional(),
  noPayslip: booleanQuerySchema.optional(),
  order: z.enum(LENDER_ORDERS, { error: 'Elige un orden válido.' }).default('recommended'),
  featured: booleanQuerySchema.optional(),
});
export type LenderListQuery = z.output<typeof lenderListQuerySchema>;

/** La URL de afiliación nunca forma parte del contrato público. */
export interface LenderResponse {
  id: string;
  name: string;
  initials: string;
  minAmount: number;
  maxAmount: number;
  minTermDays: number;
  maxTermDays: number;
  minAge: number;
  maxAge: number;
  firstLoanFree: boolean;
  acceptsAsnef: boolean;
  noPayslip: boolean;
  responseMinutes: number;
  recommended: boolean;
  totalNew?: number;
  totalReturning?: number;
}
