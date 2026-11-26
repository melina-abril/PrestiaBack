import { z } from 'zod';
import { pageQuerySchema } from '../../shared/http/page.js';

export const LENDER_SORTS = ['recommended', 'total', 'maxAmount', 'response'] as const;
export type LenderSort = (typeof LENDER_SORTS)[number];

const optionalNumber = (minimum: number, maximum: number) =>
  z.coerce.number({ error: 'Ingresa un número válido.' }).min(minimum, `El valor mínimo es ${minimum}.`).max(maximum, `El valor máximo es ${maximum}.`).optional();

const optionalFlag = z.enum(['true', 'false'], { error: 'Usa true o false.' })
  .transform((value) => value === 'true')
  .optional();

export const lenderListQuerySchema = pageQuerySchema.extend({
  amount: optionalNumber(50, 2000),
  termDays: optionalNumber(7, 90).refine((value) => value === undefined || Number.isInteger(value), 'Ingresa un número entero de días.'),
  age: optionalNumber(18, 100).refine((value) => value === undefined || Number.isInteger(value), 'Ingresa una edad en años enteros.'),
  firstLoanFree: optionalFlag,
  asnef: optionalFlag,
  noPayslip: optionalFlag,
  sort: z.enum(LENDER_SORTS, { error: 'Elige un orden válido.' }).default('recommended'),
  featured: optionalFlag,
}).superRefine((query, context) => {
  if (query.featured !== true && query.sort === 'total' && (query.amount === undefined || query.termDays === undefined)) {
    context.addIssue({ code: 'custom', path: ['sort'], message: 'Para ordenar por total, ingresa el importe y el plazo.' });
  }
});

export type LenderListQuery = z.output<typeof lenderListQuerySchema>;

/** Las URL de afiliación nunca forman parte del contrato público de listado. */
export interface LenderResponse {
  id: string;
  name: string;
  acronym: string;
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
  totalNew: number | null;
  totalRecurring: number | null;
}
