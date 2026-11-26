import { z } from 'zod';

export const LOAN_PURPOSES = ['UNEXPECTED_EXPENSE', 'TRAVEL', 'PURCHASES', 'HOME', 'HEALTH', 'EDUCATION', 'OTHER'] as const;
export type LoanPurpose = (typeof LOAN_PURPOSES)[number];

export const EMPLOYMENT_STATUSES = ['EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED', 'STUDENT', 'OTHER'] as const;
export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

export const APPLICATION_STATUSES = ['RECIBIDA', 'OFERTADA', 'SIN_OFERTAS'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

const validBirthDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;
  const today = new Date();
  let age = today.getUTCFullYear() - date.getUTCFullYear();
  if (today.getUTCMonth() < date.getUTCMonth() ||
      (today.getUTCMonth() === date.getUTCMonth() && today.getUTCDate() < date.getUTCDate())) age--;
  return age >= 18 && age <= 100;
};

const validIdentityDocument = (value: string): boolean => {
  const normalized = value.toUpperCase();
  if (!/^(?:\d{8}|[XYZ]\d{7})[A-Z]$/.test(normalized)) return false;
  const digits = /^[XYZ]/.test(normalized)
    ? `${'XYZ'.indexOf(normalized[0] ?? '')}${normalized.slice(1, 8)}`
    : normalized.slice(0, 8);
  return normalized[8] === 'TRWAGMYFPDXBNJZSQVHLCKE'[Number(digits) % 23];
};

const validSpanishIban = (value: string): boolean => {
  if (!/^ES\d{22}$/.test(value)) return false;
  const rearranged = `${value.slice(4)}${value.slice(0, 4)}`;
  let remainder = 0;
  for (const character of rearranged) {
    const expanded = /[A-Z]/.test(character) ? String(character.charCodeAt(0) - 55) : character;
    for (const digit of expanded) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
};

export const loanApplicationRequestSchema = z.object({
  amount: z.number({ error: 'Ingresa un monto.' }).int('El monto tiene que ser entero.').min(50, 'El monto mínimo es 50 €.').max(2000, 'El monto máximo es 2.000 €.').refine((amount) => amount % 50 === 0, 'El monto debe avanzar de 50 € en 50 €.'),
  termDays: z.number({ error: 'Ingresa el plazo.' }).int('El plazo tiene que ser entero.').min(7, 'El plazo mínimo es de 7 días.').max(90, 'El plazo máximo es de 90 días.'),
  purpose: z.enum(LOAN_PURPOSES, { error: 'Selecciona un motivo válido.' }),
  firstName: z.string({ error: 'Ingresa tu nombre.' }).trim().min(1, 'Ingresa tu nombre.').max(100),
  lastName: z.string({ error: 'Ingresa tus apellidos.' }).trim().min(1, 'Ingresa tus apellidos.').max(150),
  identityDocument: z.string({ error: 'Ingresa tu DNI o NIE.' }).trim().toUpperCase().refine(validIdentityDocument, 'Ingresa un DNI o NIE válido.'),
  birthDate: z.string({ error: 'Ingresa tu fecha de nacimiento.' }).refine(validBirthDate, 'Debes tener entre 18 y 100 años.'),
  email: z.email({ error: 'Ingresa un correo válido.' }).trim().toLowerCase().max(254),
  phonePrefix: z.string({ error: 'Ingresa el prefijo.' }).trim().regex(/^\+\d{1,3}$/, 'Ingresa un prefijo válido.'),
  mobile: z.string({ error: 'Ingresa tu móvil.' }).trim().regex(/^\d{9,15}$/, 'Ingresa un móvil válido.'),
  employmentStatus: z.enum(EMPLOYMENT_STATUSES, { error: 'Selecciona tu situación laboral.' }),
  monthlyIncome: z.number({ error: 'Ingresa tus ingresos mensuales.' }).finite().min(0, 'Los ingresos no pueden ser negativos.').max(1_000_000),
  monthlyExpenses: z.number().finite().min(0, 'Los gastos no pueden ser negativos.').max(1_000_000).nullable(),
  iban: z.string({ error: 'Ingresa tu IBAN.' }).trim().toUpperCase().transform((value) => value.replace(/\s/g, '')).refine(validSpanishIban, 'Ingresa un IBAN español válido.'),
  privacyTermsAccepted: z.literal(true, { error: 'Acepta la privacidad y los términos.' }),
  creditCheckAccepted: z.literal(true, { error: 'Autoriza la consulta crediticia.' }),
  marketingAccepted: z.boolean({ error: 'Indica si aceptas las comunicaciones comerciales.' }),
});
export type LoanApplicationRequest = z.output<typeof loanApplicationRequestSchema>;

export const idempotencyKeySchema = z.string({ error: 'Envía el encabezado Idempotency-Key.' })
  .min(16, 'La clave de envío debe tener al menos 16 caracteres.')
  .max(128, 'La clave de envío es demasiado larga.')
  .regex(/^[\x21-\x7E]+$/, 'La clave de envío contiene caracteres inválidos.');

export interface LoanApplicationCreatedResponse {
  id: string;
}

export interface LoanOfferResponse {
  lenderId: string;
  lender: string;
  initials: string;
  amount: number;
  termDays: number;
  totalRepayment: number;
  firstLoanFree: boolean;
  responseTime: string;
  websiteUrl: string;
}

export interface LoanApplicationOffersResponse {
  applicationId: string;
  status: ApplicationStatus;
  offers: LoanOfferResponse[];
}
