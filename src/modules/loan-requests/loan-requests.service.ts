import { createHash } from 'node:crypto';
import { Timestamp } from 'firebase-admin/firestore';
import { NotFoundError, ConflictError, HttpError } from '../../shared/errors/http-errors.js';
import { loanRequestsRepository, type Lender, type LoanRequest, type StoredOffer } from './loan-requests.repository.js';
import type { LoanRequestInput, LoanRequestCreatedResponse, LoanOfferResponse, OfferClickResponse } from './loan-requests.schemas.js';

const ageOn = (birthDate: Date, today: Date): number => today.getUTCFullYear() - birthDate.getUTCFullYear()
  - (today.getUTCMonth() < birthDate.getUTCMonth()
    || (today.getUTCMonth() === birthDate.getUTCMonth() && today.getUTCDate() < birthDate.getUTCDate()) ? 1 : 0);

/** Redondeo comercial al euro: los 50 céntimos se redondean hacia arriba. */
const roundedInterest = (amount: number, days: number): number => Math.floor(amount * 0.01 * days + 0.5 + Number.EPSILON);

const eligible = (lender: Lender, request: LoanRequest, age: number): boolean =>
  request.amount >= lender.minAmount && request.amount <= lender.maxAmount
  && request.termDays >= lender.minTermDays && request.termDays <= lender.maxTermDays
  && age >= lender.minAge && age <= lender.maxAge
  && (request.asnef !== 'SI' || lender.acceptsAsnef)
  && (request.employmentStatus !== 'DESEMPLEADO_PRESTACION' && request.employmentStatus !== 'OTROS_INGRESOS' || lender.noPayslip);

const toOffer = (lender: Lender, request: LoanRequest): LoanOfferResponse => ({
  lenderId: lender.id,
  name: lender.name,
  acronym: lender.acronym,
  amount: request.amount,
  termDays: request.termDays,
  totalNew: request.amount + roundedInterest(request.amount, lender.firstLoanFree ? Math.max(0, request.termDays - 30) : request.termDays),
  totalReturning: request.amount + roundedInterest(request.amount, request.termDays),
  firstLoanFree: lender.firstLoanFree,
  responseMinutes: lender.responseMinutes,
  bestOffer: false,
});

/** El cuerpo no se almacena duplicado; se compara para impedir reutilizar una clave con datos distintos. */
const sameSubmission = (request: LoanRequest, input: LoanRequestInput, ipAddress: string): boolean =>
  request.amount === input.amount && request.termDays === input.termDays
  && request.name === input.name && request.birthDate.toDate().toISOString().slice(0, 10) === input.birthDate
  && request.mobile === input.mobile && request.email === input.email
  && request.employmentStatus === input.employmentStatus && request.asnef === input.asnef
  && request.acceptsPrivacy === input.acceptsPrivacy && request.acceptsCommunications === input.acceptsCommunications
  && request.ipAddress === ipAddress;

export const loanRequestsService = {
  async create(input: LoanRequestInput, idempotencyKey: string, ipAddress: string, userAgent: string): Promise<LoanRequestCreatedResponse> {
    const id = `LR-${createHash('sha256').update(idempotencyKey).digest('hex')}`;
    const now = new Date();
    const acceptedAt = Timestamp.fromDate(now);
    const result = await loanRequestsRepository.insertOnce(id, {
      ...input,
      birthDate: Timestamp.fromDate(new Date(`${input.birthDate}T00:00:00Z`)),
      privacyAcceptedAt: acceptedAt,
      communicationsAcceptedAt: input.acceptsCommunications ? acceptedAt : null,
      ipAddress,
      userAgent,
      idempotencyKey,
      status: 'RECIBIDA',
      offers: [],
      clicks: [],
    }, Timestamp.fromMillis(now.getTime() - 60 * 60 * 1000));
    if (result.limited) throw new HttpError(429, 'Has hecho demasiadas solicitudes. Inténtalo más tarde.', 'RATE_LIMITED');
    if (!sameSubmission(result.request, input, ipAddress)) {
      throw new ConflictError('Esta clave de idempotencia ya corresponde a otra solicitud.', 'idempotencyKey');
    }
    return { id: result.request.id, status: result.request.status };
  },

  async getOffers(id: string): Promise<LoanOfferResponse[]> {
    const request = await loanRequestsRepository.findById(id);
    if (!request) throw new NotFoundError(`No existe la solicitud ${id}.`);
    const lenders = await loanRequestsRepository.findActiveLenders();
    const age = ageOn(request.birthDate.toDate(), new Date());
    const offers = lenders.filter((lender) => eligible(lender, request, age)).map((lender) => toOffer(lender, request));
    offers.sort((left, right) => left.totalNew - right.totalNew
      || left.responseMinutes - right.responseMinutes || left.name.localeCompare(right.name, 'es'));
    if (offers.length) offers[0].bestOffer = true;
    const stored: StoredOffer[] = offers.map(({ lenderId, amount, termDays, totalNew, totalReturning, firstLoanFree, responseMinutes, bestOffer }) =>
      ({ lenderId, amount, termDays, totalNew, totalReturning, firstLoanFree, responseMinutes, bestOffer }));
    if (!(await loanRequestsRepository.saveOffers(id, stored))) throw new NotFoundError(`No existe la solicitud ${id}.`);
    return offers;
  },

  async recordClick(id: string, lenderId: string): Promise<OfferClickResponse> {
    const affiliateUrl = await loanRequestsRepository.recordClick(id, lenderId);
    if (!affiliateUrl) throw new NotFoundError('No existe esa oferta para la solicitud.');
    const url = new URL(affiliateUrl);
    url.searchParams.set('utm_source', 'credara');
    url.searchParams.set('utm_medium', 'comparador');
    url.searchParams.set('ref', id);
    return { url: url.toString() };
  },
};
