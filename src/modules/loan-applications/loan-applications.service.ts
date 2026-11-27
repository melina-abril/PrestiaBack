import { nowTimestamp, toMoney } from '../../shared/db/db-utils.js';
import { BusinessRuleError, NotFoundError } from '../../shared/errors/http-errors.js';
import { loanApplicationsRepository, type Application, type Lender, type StoredOffer } from './loan-applications.repository.js';
import type { ApplicationCreatedResponse, ApplicationOfferResponse, ApplicationOffersResponse, ApplicationRequest, OfferClickResponse } from './loan-applications.schemas.js';

const ageOnToday = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  if (today.getUTCMonth() < birthDate.getUTCMonth() || (today.getUTCMonth() === birthDate.getUTCMonth() && today.getUTCDate() < birthDate.getUTCDate())) age -= 1;
  return age;
};

const eligible = (application: Application, lender: Lender): boolean => {
  const age = ageOnToday(application.birthDate.toDate());
  return lender.active
    && application.amount >= lender.minAmount && application.amount <= lender.maxAmount
    && application.termDays >= lender.minTermDays && application.termDays <= lender.maxTermDays
    && age >= lender.minAge && age <= lender.maxAge
    && (application.asnefStatus !== 'SI' || lender.acceptsAsnef)
    && (!['DESEMPLEADO_PRESTACION', 'OTROS_INGRESOS'].includes(application.employmentStatus) || lender.noPayslip);
};

/** Math.floor(x + 0.5) redondea los 0,50 € hacia arriba. */
const interest = (amount: number, days: number): number => Math.floor(amount * 0.01 * days + 0.5);

const offerFor = (application: Application, lender: Lender): ApplicationOfferResponse => ({
  lenderId: lender.id,
  name: lender.name,
  initials: lender.initials,
  amount: toMoney(application.amount),
  termDays: application.termDays,
  totalNew: toMoney(application.amount + interest(application.amount, lender.firstLoanFree ? Math.max(0, application.termDays - 30) : application.termDays)),
  totalReturning: toMoney(application.amount + interest(application.amount, application.termDays)),
  firstLoanFree: lender.firstLoanFree,
  responseMinutes: lender.responseMinutes,
  bestOffer: false,
});

export const loanApplicationsService = {
  async create(request: ApplicationRequest, idempotencyKey: string, ipAddress: string, userAgent: string): Promise<ApplicationCreatedResponse> {
    const acceptedAt = nowTimestamp();
    const result = await loanApplicationsRepository.createLimited(loanApplicationsRepository.newDocument({
      amount: request.amount,
      termDays: request.termDays,
      name: request.name,
      birthDate: loanApplicationsRepository.birthTimestamp(request.birthDate),
      mobile: request.mobile,
      email: request.email,
      employmentStatus: request.employmentStatus,
      asnefStatus: request.asnefStatus,
      privacyAccepted: true,
      privacyAcceptedAt: acceptedAt,
      marketingAccepted: request.marketingAccepted,
      marketingAcceptedAt: request.marketingAccepted ? acceptedAt : null,
      ipAddress,
      userAgent,
      idempotencyKey,
      status: 'RECIBIDA',
      offers: [],
      clicks: [],
    }));
    if (result.limited) throw new BusinessRuleError('TOO_MANY_APPLICATIONS', 'Has hecho demasiadas solicitudes. Inténtalo más tarde.');
    return { id: result.id };
  },

  async getOffers(id: string): Promise<ApplicationOffersResponse> {
    const application = await loanApplicationsRepository.findById(id);
    if (!application) throw new NotFoundError(`No existe la solicitud ${id}.`);

    const lenders = await loanApplicationsRepository.findActiveLenders();
    const offers = lenders.filter((lender) => eligible(application, lender)).map((lender) => offerFor(application, lender));
    offers.sort((a, b) => a.totalNew - b.totalNew || a.responseMinutes - b.responseMinutes || a.name.localeCompare(b.name, 'es'));
    if (offers.length > 0) offers[0]!.bestOffer = true;

    const stored: StoredOffer[] = offers.map(({ lenderId, totalNew, totalReturning }) => ({ lenderId, totalNew, totalReturning }));
    await loanApplicationsRepository.saveOffers(id, stored);
    return { status: offers.length > 0 ? 'OFERTADA' : 'SIN_OFERTAS', offers };
  },

  async recordClick(id: string, lenderId: string): Promise<OfferClickResponse> {
    const application = await loanApplicationsRepository.findById(id);
    if (!application || !application.offers.some((offer) => offer.lenderId === lenderId)) {
      throw new NotFoundError('No existe esa oferta para la solicitud.');
    }
    const lender = await loanApplicationsRepository.findLenderById(lenderId);
    if (!lender) throw new NotFoundError('No existe la entidad de la oferta.');

    let destination: URL;
    try {
      destination = new URL(lender.affiliateUrl);
    } catch {
      throw new BusinessRuleError('INVALID_AFFILIATE_URL', 'No se puede abrir esta entidad en este momento.');
    }
    if (destination.protocol !== 'https:') {
      throw new BusinessRuleError('INVALID_AFFILIATE_URL', 'No se puede abrir esta entidad en este momento.');
    }
    destination.searchParams.set('utm_source', 'credara');
    destination.searchParams.set('utm_medium', 'comparador');
    destination.searchParams.set('ref', id);

    if (!(await loanApplicationsRepository.appendClick(id, lenderId))) {
      throw new NotFoundError('No existe esa oferta para la solicitud.');
    }
    return { url: destination.toString() };
  },
};
